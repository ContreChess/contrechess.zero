import pgp        from 'openpgp';
import Marionette from 'backbone.marionette';
let _self;

const PGPUtility = Marionette.Object.extend({
  channelName: 'pgp',
  radioRequests: {
    'key:create': 'createKey'
  },
  initialize: function (options) {
    _self = this;
  },
  createKey: function (options) {
      console.log('[pgp] enter createKey');
    let pgpOptions = {
      userIds: [
        {
          name: options.name,
          email :options.address + '@contrechess.com'
        }
      ], 
      numBits: 4096,                                            // RSA key size
      passphrase: options.passphrase         // protects the private key
    },
    promise = pgp.generateKey(pgpOptions);

    promise
      .then(function(key) {
        _self.getChannel().trigger('create', key);
      });

    return promise;
  },
  readArmored: function (text) {
    return pgp.key.readArmored(text);
  },
  isValidArmoredKey: function (text) {
    let result;
    try {
      result = _self.readArmored(text);
    } catch (e) {
      return false;
    }
    
    return result.err === undefined || result.err.length === 0;
  },
  encrypt: function (options) {
    console.log('[pgp] enter encrypt');
    let promise = pgp.encrypt(options);

    promise
      .then(function (ciphertext) {
        _self.getChannel().trigger('encrypt', ciphertext);
      });

    return promise;
  }
});

export default PGPUtility;
