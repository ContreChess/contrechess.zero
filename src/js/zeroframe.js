var Marionette  = require('backbone.marionette'),
    radio       = require('backbone.radio'),
    uuid        = require('uuid/v4'),
    callbacks   = {},
    _self;

module.exports = Marionette.Object.extend({
  initialize: function (options) {
    _self = this;
    addEventListener("message", this.receiveMessage, false);

    this.send({
      cmd: "innerReady",
      params: {}
    });
  },
  certAdd:
  certSelect:
  fileDelete:
  fileList:
  fileRules:
  fileWrite:
  send: function (message, callback) {
    if (callback && typeof callback === 'function') {
      message.id = uuid();
      callbacks[message.id] = callback;
    }
    parent.postMessage(message, this.receiveMessage, false);
    
  },
  siteInfo:
  sitePublish: 
  siteSign: function (privateKey, contentJsonPath, callback) {
    _self.send(
  },
  receiveMessage: function (event) {
    console.log(event.origin);
    var message = event.data;

  },
  processors: {
    ping: function (message) {
    },
    response: function (message) {
    },
    setSiteInfo: function (message) {
    },
    wrapperReady: function () {
    },
    wrapperOpenedWebsocket: function () {
      // TODO: send message via radio
    },
    wrapperClosedWebsocket: function () {
    }
  }
});

