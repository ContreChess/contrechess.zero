var Marionette  = require('backbone.marionette'),
    bitcoin     = require('bitcoinjs-lib'),
    bigi        = require('bigi'),
    Buffer      = require('buffer/').Buffer,
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
  },
  btcFromWIF: function (wif) {
    var promise = new Promise(function (resolve, reject) {
      var key = bitcoin.ECPair.fromWIF(wif);
      resolve(key);
    });

    promise
      .then(function(key) {
        _self.getChannel().trigger('import:key', key)
      });

    return promise;
  },
  btcSignMessage: function (key, message) {
    var hash = bitcoin.crypto.sha256(message),
        signature = key.sign(hash);

    return signature;
  },
});
