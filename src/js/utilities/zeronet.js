import Marionette   from 'backbone.marionette';
import Backbone     from 'backbone';
import ZeroNetError from '../_base/zeroneterror.js';
const wrapperNonce    = document.location.href.replace(/.*wrapper_nonce=([A-Zaz0-9]+).*/, '$1');
let nextMessageId   = 1,
    pendingZeroNetMessages = {},
    pendingPromiseResolvers = {},
    siteInfoModel,
    target,
    _self;

const ZeroNetUtilty = Marionette.Object.extend({
  channelName: 'zeronet',
  initialize: function (options) {
    _self = this;
    target = window.parent;
    // TODO: get smart enough to know when running inside ZeroNet or not (window.parent == window)
    addEventListener('message', this.onMessageReceived, false);
  },
  send: function (message) {
    let wrapperNonce = document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1");

    message.id = nextMessageId++;
    message.wrapper_nonce = wrapperNonce;

    let promise = new Promise(function (resolve, reject) {
      if (!message) {
        reject(new Error('[src/js/utilities/zeronet] no message supplied'));
      }

      target.postMessage(message, '*');

      pendingPromiseResolvers[message.id] = {
        cmd: message.cmd,
        message: message,
        resolve: resolve,
        reject: reject
      };
      
    });

    

    return promise;
  },
  // message consists of message.id, message.cmd and message.data
  onMessageReceived: function (event) {
    let  message = event.data,
        cmd = message.cmd;

    switch (cmd) {
      case 'response':
          let  pendingPromiseResolver = pendingPromiseResolvers[message.to];
          if(pendingPromiseResolver) {
            if (_self.shouldResolve(pendingPromiseResolver.cmd, message)) {
              pendingPromiseResolver.resolve(message.result || message);
            } else {
              // TODO: parse message and create Error instance
              pendingPromiseResolver.reject(new ZeroNetError('zeroframe error', message));
            }

            delete pendingPromiseResolvers[message.to];
          }
        break;
      case 'wrapperReady':
        _self.send({ cmd: 'innerReady', params: {} });
        break;
      case 'ping':
        _self.send({ cmd: 'response', to: message.id, result: 'pong' });
        break;
      case 'wrapperOpenedWebsocket':
        _self.onWrapperOpenedWebsocket();
        break;
      case 'wrapperClosedWebsocket':
        _self.onWrapperClosedWebsocket();
        break;
      default:
        console.log('[src/js/utilities/zeronet] unknown request', message);
    }
_self.getChannel().trigger('receive:message', message);
  },
  onWrapperOpenedWebsocket: function () {
    _self.getChannel().trigger('wrapper:open:websocket');
  },
  onWrapperClosedWebsocket: function () {
    _self.getChannel().trigger('wrapper:close:websocket');
  },
  getSiteInfo: function () {
    let  promise = _self.send({ cmd: 'siteInfo', params: {} });
    
    promise
      .then(function(siteInfo) {
        siteInfoModel = new Backbone.Model(siteInfo);
      },
      function (error){
      });

    return promise;
  },
  addCertificate: function (certificate, userName) {
    if (siteInfoModel && siteInfoModel.has('auth_address')) {
      return _self.send({
        cmd: 'certAdd',
        params: {
          domain: 'contrechess.io',
          auth_type: 'web',
          auth_user_name: userName || siteInfoModel.get('auth_address'),
          cert: certificate
        }
      });
    } else {
      return new Promise(function (resolve, reject) {
        reject(new Error("'siteInfo' unknown. Run 'getSiteInfo' before attempting to add a certificate"));
      });
    }
  },
  selectCertificate: function (domains) {
    
    if (typeof domains === "string") {
      domains = [domains];
    }

    return _self.send({
      cmd: 'certSelect',
      params: {
        accepted_domains: domains
      }
    });
  },
  writeFile: function (filePath, content) {
    return _self.send({
      cmd: 'fileWrite',
      params: {
        inner_path: filePath,
        content_base64: content
      }
    });
  },
  sign: function (filePath) {
    return _self.send({
      cmd: 'siteSign',
      params: {
        inner_path: filePath
      }
    });
  },
  publish: function (filePath) {
    return _self.send({
      cmd: 'sitePublish',
      params: {
        inner_path: filePath
      }
    });
  },
  displayNotification: function(type, message, timeout) {
    let  options = {
      cmd: 'wrapperNotification',
      params: {
        type: type,
        message: message
      }
    };

    if (timeout) {
      options.params.timeout = timeout;
    }
    
    return _self.send(options);
  },
  fileQuery: function (filePath , query) {
    return _self.send({
      cmd: 'fileQuery',
      params: {
        dir_inner_path: filePath,
        query: query 
      }
    });
  },
  shouldResolve: function shouldResolve(cmd, response) {
    try {
      switch (cmd) {
        case 'certAdd': 
          return (response.result === 'ok' || response.result === 'Not changed');
        case 'fileWrite':
        case 'siteSign':
        case 'sitePublish':
          return (response.result === 'ok' || response === 'ok');
        default:
          return true;
      }
    } catch (e) {
      console.log('error determining whether or not to resolve a zeronet promise', cmd, response, e);
      return false;
    }
  }
});

export default ZeroNetUtilty;
