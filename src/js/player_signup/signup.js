var SubComponent    = require('../_base/subcomponent'),
    Radio           = require('backbone.radio'),
    View            = require('./views/signup'),
    Router          = require('./router'),
    Model           = require('./models/user'),
    CurrencyManager = require('../utilities/currency'),
    PrivacyManager  = require('../utilities/pgp'),
    ZeroNetManager  = require('../utilities/zeronet'),
    appChannel      = Radio.channel('app'),
    FileSaver       = require('file-saver'),
    currency,
    pgp,
    zeronet,
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

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get', { name: 'zeronet', serviceClass: ZeroNetManager });
    }

      currency
        .btcCreateKey()
        .then(function (key) {
          _self.userKey = key;
          _self.model.set('authAddress', key.getAddress());
        });
         }
  },
  radioEvents: {
    'pgp:create': 'pgpCreateKey',
    'user:create': 'createUser'
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
        address: _self.model.get('authAddress'),
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
    var file = new File([text], 'private-key.asc', { type: 'text/plain' });

    FileSaver.saveAs(file);
  },
  createUser: function (options) {
    // TODO:
    // 1. validate that pgp public key is valid
    // readArmored
    zeronet
      .getSiteInfo()
      .then(function (siteInfo) {
        // 2. sign site address plus user address in base64
        //    using user address private key
        var textToSign = siteInfo.address + '#' + _self.model.get('authAddress');

        cert = _self.userKey.sign(textToSign.toString('base64'));

        return zeronet.addCertificate({ cert: cert });
      })
      .then(function (response) {
        // 3. write the model to the file system
        var filePath = 'data/users/' + _self.model.get('authAddress') + '/user.json';
        return zeronet.writeFile(filePath, _self.model.toJSON().toString('base64'));
      })
      .then(function (response) {
        // 4. handle errors or process notifications
      });
  }
});

