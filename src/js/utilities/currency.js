var Marionette  = require('backbone.marionette'),
    bitcoin    = require('bitcoinjs-lib'),
    _self;

module.exports = Marionette.Object.extend({
  channelName: 'currency',
  initialize: function (options) {
    _self = this;
  },
  radioRequests: {
    'key:create:btc': 'btcCreateKey'
  },
  btcCreateKey: function () {
    var promise = new Promise(function (resolve, reject) {
      var key = bitcoin.ECPair.makeRandom(); 
      resolve(key);
    });

    promise
      .then(function(key) {
        _self.getChannel().trigger('create:key', key)
      });

    return promise;
  }
});
