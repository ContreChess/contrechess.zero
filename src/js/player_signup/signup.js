var SubComponent    = require('../_base/subcomponent'),
    Radio           = require('backbone.radio'),
    View            = require('./views/signup'),
    Router          = require('./router'),
    Model           = require('./models/user'),
    CurrencyManager = require('../utilities/currency'),
    PrivacyManager  = require('../utilities/pgp'),
    ZeroNetManager  = require('../utilities/zeronet'),
    InigoMontoya    = require('../inigo'),
    appChannel      = Radio.channel('app'),
    FileSaver       = require('file-saver'),
    QR              = require('qrious'),
    BitMessage      = require('bitmessage');
    copyToClipboard = require('copy-to-clipboard'),
    currency,
    pgp,
    zeronet,
    inigo,
    _clearTextEmail,
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
    }

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get', { name: 'zeronet', serviceClass: ZeroNetManager });
    }

    if (options && options.inigo) {
    } else {
      inigo = appChannel.request('service:get', { name: 'inigo', serviceClass: InigoMontoya });
    }
  },
  radioEvents: {
    'pgp:create': 'pgpCreateKey',
    'user:create': 'createUser',
    'set:email': 'setEmail',
    'btc:copy:public': 'copyPublicBTC',
    'btc:copy:private': 'copyPrivateBTC'
  },
  radioRequests: {
    'validate:bitMessageAddress': 'validateBitMessageAddress'
  },
  signup: function () {
    // TODO: use sed or gulp to insert file path to console.log for all js files
    console.log('[src/js/player_signup/signup] we called signup');

    _self
      .getParentComponent().showView(_self.getView());

    currency
      .btcCreateKey()
      .then(function (key) {
        _self.btcAddress = key;
        _self.model.set('btcAddress', key.getAddress());
        var qrPublic = new QR({ value: 'bitcoin:' + key.getAddress() }),
            qrPrivate = new QR({ value: key.toWIF() });
        _self.getChannel().trigger('success:btc:create', key.getAddress(), qrPublic, qrPrivate);
      });

  },
  pgpCreateKey: function (passPhrase) {
    if (_self.btcAddress) {
      pgp.createKey({
        name: _self.model.get('userName'),
        address: _self.model.get('btcAddress'),
        passphrase: passPhrase
      })
      .then(function(key) {
        console.log('[signup controller] pgp.createKey succeeded');
        _self.pgpKey = key;
        _self.model.set('pgpPublicKeyArmored', key.publicKeyArmored);
        _self.downloadFile('private-key.asc', key.privateKeyArmored);
        _self.getChannel().trigger('success:pgp:create');
      }, function (error){
        console.log('[signup controller] pgp.createKey failed');
        _self.getChannel().trigger('fail:pgp:create');
      });
    } else {
      // TODO: wait for currency module to gen a key before requesting a pgp key
    }
  },
  downloadFile: function (fileName, content) {
    var file = new File([content], fileName, { type: 'text/plain' });

    FileSaver.saveAs(file);
  },
  createUser: function (options) {
    // TODO:
    // 1. validate that pgp public key is valid
    if (!pgp.isValidArmoredKey(_self.model.get('pgpPublicKeyArmored'))) {
      _self.getChannel().trigger('fail:user:create', 'pgp public key is not valid');
      return;
    }
    
    var filePath = 'data/users/' + _self.model.get('btcAddress') + '/user.json';

    zeronet
      .getSiteInfo()
      .then(function (siteInfo) {
        // 2. sign site address plus user address in base64
        //    using user address private key
        var textToSign = siteInfo.auth_address + '#web/' + _self.model.get('btcAddress'),
            cert = _self.btcAddress.sign(textToSign.toString('base64'));

        return zeronet.addCertificate(cert);
      })
      .then(function (response) {
        // 3. write the model to the file system
        return zeronet.writeFile(filePath, _self.model.toJSON().toString('base64'));
      })
      .then(function (response) {
        return zeronet.publish(filePath);
      })
      .then(function (response) {
        // 4. handle errors or process notifications
      });
  },
  setEmail: function (address) {
    // when coming from the view, 'address' has a value
    // when coming from an update to 'pgpPublicKeyArmored', address will be undefined
    // but _clearTextEmail should have a value
    _clearTextEmail = address || _clearTextEmail;

    if (_clearTextEmail) {
      if (pgp && _self.model.has('pgpPublicKeyArmored')) {
        var options = {
          data: _clearTextEmail,
          publicKeys: [pgp.readArmored(inigo.getPublickKey()).keys, pgp.readArmored(_self.model.get('pgpPublicKeyArmored')).keys]
        };

        pgp
          .encrypt(options)
          .then(function (cyphertext) {
            _self.model.set('emailAddress');
          });
        
      } else {
        _self.listenToOnce(_self.model, 'change:pgpPublicKeyArmored', _self.setEmail);
      }
    }
  },
  copyPublicBTC: function () {
    if (_self.btcAddress) {
      copyToClipboard(_self.btcAddress.getAddress());
    }
  },
  copyPrivateBTC: function () {
    if (_self.btcAddress) {
      copyToClipboard(_self.btcAddress.toWIF());
    }
  },
  validateBitMessageAddress: function (value) {
    // TODO: refactor out into bitmessage utility
    var result;

    try {
      result = BitMessage.Address.decode(value);
    } catch (e) {
      return false;
    }

    return BitMessage.Address.isAddress(result);
  }
});
 
