var pgp         = require('openpgp'),
    Marionette  = require('backbone.marionette'),
    _self;

module.exports = Marionette.Object.extend({
  channelName: 'pgp',
  radioRequests: {
    'key:create': 'createKey'
  },
  initialize: function (options) {
    _self = this;
  },
  createKey: function (options) {
      console.log('[pgp] enter createKey');
    var pgpOptions = {
      userIds: [
        {
          name: options.name,
          email :options.address + '@contrechess.com'
        }
      ], 
      numBits: 4096,                                            // RSA key size
      passphrase: options.passphrase         // protects the private key
    },
      promise = pgp.generateKey(pgpOptions)

      promise
        .then(function(key) {
          _self.getChannel().trigger('create', key);
        });

    return promise;
  }
});
