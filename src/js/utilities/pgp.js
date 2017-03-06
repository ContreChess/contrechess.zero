var pgp         = require('openpgp'),
    Marionette  = require('backbone.marionette'),
    Radio       = require('backbone.radio'),
    pgpChannel  = Radio.channel('pgp');

module.exports = Marionette.Object.extend({
  initialize: function (options) {
    pgpChannel.reply('pgp:create', this.pgpCreateKey);
  },
  pgpCreateKey: function (options) {
    var pgpOptions = {
      userIds: [
        {
          name: options.name,
          email :options.address + '@contrechess.com'
        }
      ], 
      numBits: 4096,                                            // RSA key size
      passphrase: options.passphrase         // protects the private key
    };

    return openpgp
      .generateKey(pgpOptions)
      /*.then(function(key) {
        var privkey = key.privateKeyArmored, // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
            pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
      });*/
      .then(function(key) {
        
      });
  }
});
