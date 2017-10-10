import Marionette from 'backbone.marionette';
import bitcoin    from 'bitcoinjs-lib';
import bigi       from 'bigi';
import Buffer     from 'buffer/';
let _self;

const BitcoinUtility = Marionette.Object.extend({
  channelName: 'currency',
  initialize: function (options) {
    _self = this;
  },
  radioRequests: {
    'key:create:btc': 'btcCreateKey'
  },
  btcCreateKey: function () {
    let promise = new Promise(function (resolve, reject) {
      let key = bitcoin.ECPair.makeRandom(); 
      resolve(key);
    });

    promise
      .then(function(key) {
        _self.getChannel().trigger('create:key', key);
      });

    return promise;
  },
  btcFromWIF: function (wif) {
    let  promise = new Promise(function (resolve, reject) {
      let key = bitcoin.ECPair.fromWIF(wif);
      resolve(key);
    });

    promise
      .then(function(key) {
        _self.getChannel().trigger('import:key', key);
      });

    return promise;
  },
  btcSignMessage: function (key, message) {
    let hash = bitcoin.crypto.sha256(message),
        signature = key.sign(hash);

    return signature;
  },
});

export default BitcoinUtility;
