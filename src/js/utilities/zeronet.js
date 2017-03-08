var Marionette  = require('backbone.marionette'),
    _self;

module.exports = Marionette.Object.extend({
  channelName: 'zeronet',
  initialize: function (options) {
    _self = this;

    addEventListener("message", this.onMessageReceived, false);
  },
  radioRequests: {
    'user:create': 'createUser'
  },
  // message consists of message.id, message.cmd and message.data
  onMessageReceived: function (message) {
  },
  saveFile: function (options) {
  },
  listFiles: function (options) {
  },
  createUser: function (options) {
    var promise = new Promise(function (resolve, reject) {
    });

    /*promise
      .then(function(key) {
        _self.getChannel().trigger('create:key', key)
      });
    */

    return promise;
  },
  getSiteInfo: function () {
  }
});
