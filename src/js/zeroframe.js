var Marionette  = require('backbone.marionette'),
    radio = require('backbone.radio'),
      Player      = require('./models/player'),
      View        = require('./views/player_listing'),
      Router      = require('./router'),
      uuid        = require('uuid/v4'),
      callbacks   = {};

module.exports = Marionette.Object.extend({
  initialize: function (options) {
    addEventListener("message", this.receiveMessage, false);

    this.send({
      cmd: "innerReady",
      params: {}
    });
  },
  send: function (message, callback) {
    if (callback && typeof callback === 'function') {
      message.id = uuid();
      callbacks[message.id] = callback;
    }
    parent.postMessage(message, this.receiveMessage, false);
    
  },
  receiveMessage: function (event) {
    console.log(event.origin);
    var message = event.data;

  },
  processors: {
    response: function (message) {
    },
    wrapperReady: function () {
    },
    ping: function (message) {
    },
    wrapperOpenedWebsocket: function () {
      // TODO: send message via radio
    },
    wrapperClosedWebsocket: function () {
    }
  }
});

