var SubComponent    = require('../_base/subcomponent'),
    Radio           = require('backbone.radio'),
    View            = require('./views/signup'),
    Router          = require('./router'),
    Model           = require('./models/user'),
    CurrencyManager = require('../utilities/currency'),
    PrivacyManager  = require('../utilities/pgp'),
    appChannel      = Radio.channel('app'),
    currency,
    pgp,
    _self;

module.exports = SubComponent.extend({
  channelName: 'signup',
  initialize: function (options) {
    _self = this;

    _self.router = new Router({ controller: _self });
    _self.model = new Model();
    _self.view = new View({model: _self.model });

    if (options && options.currencyManager) {
      currency = options.currencyManager;
    } else {
      currency = appChannel.request('service:get', { name: 'currency', serviceClass: CurrencyManager });
    }

    if (options && options.pgpManager) {
      pgp = options.pgpManager;
    } else {
      pgp = appChannel.request('service:get', { name: 'pgp', serviceClass: PrivacyManager });

      currency
        .btcCreateKey()
        .then(function (key) {
          _self.userKey = key;
          _self.model.set('authAddress', key.getAddress());
        });
         }
  },
  radioEvents: {
    'pgp:create': 'pgpCreateKey'
  },
  signup: function () {
    console.log('we called signup');
    _self
      .getParentComponent().showView(_self.getView());
  },
  pgpCreateKey: function () {
    if (_self.userKey) {
      // TODO: get the user's passphrase
      pgp.createKey({
        name: _self.model.get('userName'),
        email: _self.model.get('authAddress'),
        passphrase: 'This is one effing salty passphrase'
      })
      .then(function(key) {
        console.log('[signup controller] pgp.createKey succeeded');
        _self.pgpKey = key;
        _self.model.set('pgpPublicKey', key.publicKeyArmored);
        _self.downloadPrivateKey(key.privateKeyArmored);
        _self.getChannel().trigger('success:pgp:create');
      }, function (error){
        console.log('[signup controller] pgp.createKey failed');
        _self.getChannel().trigger('fail:pgp:create');
      });
    } else {
      // TODO: wait for currency module to gen a key before requesting a pgp key
    }
  },
  downloadPrivateKey: function (text) {
    var file = new File([text], 'private-key.asc', { type: 'text/plain' }),
        urlHandle = URL.createObjectURL(file),
        fileWindow = window.open(urlHandle, 'private-pgp-key');

    URL.revokeObjectURL(urlHandle);
  }
});

