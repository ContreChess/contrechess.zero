var Marionette      = require('backbone.marionette'),
    Backbone        = require('backbone'),
    nextMessageId   = 1,
    wrapperNonce    = document.location.href.replace(/.*wrapper_nonce=([A-Zaz0-9]+).*/, '$1'),
    pendingPromises = {},
    siteInfoModel,
    target,
    _self;

module.exports = Marionette.Object.extend({
  channelName: 'zeronet',
  initialize: function (options) {
    _self = this;
    target = window.parent;
    addEventListener('message', this.onMessageReceived, false);
  },
  send: function (message) {
    var promise = new Promise(function (resolve, reject) {
      if (!message) {
        reject(new Error('[src/js/utilities/zeronet] no message supplied'));
      }

      message.wrapper_nonce = wrapperNonce;
      message.id = nextMessageId++;
      pendingPromises[message.id] = this;
      target.postMessage(message, '*');
    });

    return promise;
  },
  // message consists of message.id, message.cmd and message.data
  onMessageReceived: function (event) {
    var message = event.data,
        cmd = event.cmd;

    switch (event.cmd) {
      case 'response':
        var promise = pendingPromises[message.to];
        if (promise) {
          promise.resolve(message.result);
          delete pendingPromises[message.to];
        } else {
          console.log('[src/js/utilities/zeronet] pending promises out of sync', message.to);
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
    var promise = _self.send({ cmd: 'siteInfo', params: {} });
    
    promise
      .then(function(siteInfo) {
        siteInfoModel = new Backbone.Model(siteInfo);
      },
      function (error){
      });

    return promise;
  },
  addCertificate: function (certificate) {
    if (siteInfoModel && siteInfoModel.has('auth_address')) {
      return _self.send({
        cmd: 'certAdd',
        params: {
          domain: 'contrechess.io',
          auth_type: 'web',
          auth_user_name: siteInfoModel.get('auth_address'),
          cert: certificate
        }
      });
    } else {
      return new Promise(function (resolve, reject) {
        reject(new Error("'siteInfo' unknown. Run 'getSiteInfo' before attempting to add a certificate"));
      });
    }
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
  publish: function (filePath) {
    return _self.send({
      cmd: 'sitePublish',
      params: {
        inner_path: filePath
      }
    });
  },
  displayNotification: function(type, message, timeout) {
    var options = {
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
});
