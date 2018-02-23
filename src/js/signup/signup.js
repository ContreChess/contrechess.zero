import Backbone        from 'backbone';
import BitMessage      from 'bitmessage';
import CurrencyManager from '../utilities/currency';
import FileSaver       from 'file-saver';
import InigoMontoya    from '../inigo';
import PrivacyManager  from '../utilities/pgp';
import QR              from 'qrious';
import Radio           from 'backbone.radio';
import Router          from './router';
import SignupView      from './views/signup';
import ViewComponent   from '../_base/view-component';
import ZeroNetManager  from '../utilities/zeronet';
import copyToClipboard from 'copy-to-clipboard';

let appChannel = Radio.channel('app'),
    _clearTextEmail,
    _self,
    currency,
    inigo,
    pgp,
    zeronet;

const Signup = ViewComponent.extend({
  channelName: 'signup',
  initialize: function (options) {
    _self = this;

    _self.router = new Router({ controller: _self });
    _self.model = new Backbone.Model();
    _self.view = new SignupView({model: _self.model });

    if (options && options.currencyManager) {
      currency = options.currencyManager;
    } else {
      currency = appChannel.request('service:get',
        { name: 'currency', serviceClass: CurrencyManager });
    }

    if (options && options.pgpManager) {
      pgp = options.pgpManager;
    } else {
      pgp = appChannel.request('service:get',
        { name: 'pgp', serviceClass: PrivacyManager });
    }

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get',
        { name: 'zeronet', serviceClass: ZeroNetManager });
    }

    if (options && options.inigo) {
    } else {
      inigo = appChannel.request('service:get',
        { name: 'inigo', serviceClass: InigoMontoya });
    }
  },
  radioEvents: {
    'pgp:create': 'pgpCreateKey',
    'user:create': 'createUser',
    'set:email': 'setEmail',
    'btc:copy:public': 'copyPublicBTC',
    'add:avatar': 'addAvatar'
  },
  radioRequests: {
    'validate:bitmessage': 'validateBitMessageAddress',
    'validate:email': 'validateEmailAddress'
  },
  signup: function () {
    // TODO: use sed or gulp to insert file path to console.log for all js files
    console.log('[src/js/player_signup/signup] we called signup');


    _self.getContainer().showView(_self.getView());
    //appChannel.trigger('view:show', _self.getView());

    currency
      .btcFromWIF(inigo.getUserContentBitcoinSignatureWIF())
      .then(function (key) {
        _self.contentAddress = key;
      });

    zeronet
      .getSiteInfo()
      .then(function (siteInfo) {
        _self.btcAddress = siteInfo.auth_address;
        _self.model.set('btcAddress', siteInfo.auth_address);
        let qrPublic = new QR({ value: 'bitcoin:' + siteInfo.auth_address });
        _self.getChannel().trigger('success:btc:get', siteInfo.auth_address, qrPublic);
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
        // instead of setting the pgp key on the model the key is placed in
        // a file of its own
        _self.pgpKey = key;
        _self.downloadFile('private-key.asc', key.privateKeyArmored);
        _self.getChannel().trigger('success:pgp:create', key.publicKeyArmored);
      }, function (error){
        console.log('[signup controller] pgp.createKey failed');
        _self.getChannel().trigger('fail:pgp:create');
      });
    } else {
      _self.listenToOnce(_self.getChannel(), 'success:btc:get', _self.pgpCreateKey(passPhrase));
      // btcAddress isn't ready yet, attempt again later
    }
  },
  downloadFile: function (fileName, content) {
    let file = new File([content], fileName, { type: 'text/plain' });

    FileSaver.saveAs(file);
  },
  createUser: function (options) {
    // TODO:
    // 1. check the existence of a pgp key
    if (!_self.hasOwnProperty('pgpKey')) {
      _self.getChannel().trigger('fail:user:create', 'pgp public key is not valid');
      return;
    }
    
    let userDirectoryPath = 'data/users/' + _self.model.get('btcAddress'),
        userFilePath      = userDirectoryPath + '/user.json',
        pgpFilePath       = userDirectoryPath + '/pgp.asc',
        emailFilePath     = userDirectoryPath + '/email.asc';

    // 2. sign user address, plus cert type, plus user address (again) in base64
    //    using site's user content address private key
    let textToSign = _self.model.get('btcAddress') + '#web/' + _self.model.get('userName'),
        cert = currency
          .btcSignMessage(_self.contentAddress, textToSign)
          .toDER()
          .toString('base64');

    return zeronet.addCertificate(cert, _self.model.get('userName'))
      .then(function (response) {
        // 3. write the model to the file system
        let userFileContent = btoa(unescape(encodeURIComponent(JSON.stringify(_self.model.toJSON(), null, '  '))));

        let userFileWritePromise = zeronet.writeFile(userFilePath, userFileContent),
            pgpFileWritePromise  = zeronet.writeFile(pgpFilePath, _self.pgpKey.publicKeyArmored);

        let promiseArray = [userFileWritePromise, pgpFileWritePromise];

        if (_self.hasOwnProperty('emailCipherText')) {
          promiseArray.push(zeronet.writeFile(emailFilePath, _self.emailCipherText));
        }

        return Promise.all(promiseArray);
      })
      .then(function (response) {
        // publishing a file in the user subdirectory
        // actually signs and publishes the 'content.json' file
        // in the user subdirectory
        return zeronet.publish(userFilePath);
      })
      .then(function (response) {
        console.log(response);
        // handle errors or process notifications
      });
  },
  setEmail: function (address) {
    // when coming from the view, 'address' has a value
    // when coming from an update to 'pgpPublicKeyArmored', address will be undefined
    // but _clearTextEmail should have a value
    _clearTextEmail = address.val() || _clearTextEmail;

    if (_clearTextEmail) {
      if (pgp && _self.hasOwnProperty('pgpKey')) {
        let options = {
          data: _clearTextEmail,
          publicKeys: pgp.readArmored(inigo.getPublickKey()).keys.concat(pgp.readArmored(_self.pgpKey).keys)
        };

        pgp
          .encrypt(options)
          .then(function (ciphertext) {
            _self.emailCipherText = ciphertext.data;
          });
        
      } else {
        _self.listenToOnce(_self.getChannel(), 'success:pgp:create', _self.setEmail);
      }
    }
  },
  copyPublicBTC: function () {
    if (_self.btcAddress) {
      copyToClipboard(_self.btcAddress);
    }
  },
  validateBitMessageAddress: function (value) {
    // TODO: refactor out into bitmessage utility
    let result;

    try {
      result = BitMessage.Address.decode(value);
    } catch (e) {
      return false;
    }

    return BitMessage.Address.isAddress(result);
  },
  validateEmailAddress: function (value) {
    let validEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

    return validEmail.test(value);
  },
  addAvatar: function (file) {
    console.log('adding file from signup controller');
    let reader = new FileReader();

    reader.onload = function () {
      _self.getChannel().trigger('success:avatar:load', reader.result);

      let avatarFileContent = reader.result.replace(/.*,/, ""),
          fileExtension = file.name.substr(file.name.lastIndexOf('.')),
          avatarFilePath = 'data/users/' + _self.model.get('btcAddress') + '/avatar' + fileExtension;

      return zeronet.writeFile(avatarFilePath, avatarFileContent);
    };

    reader.onabort = function () {
      _self.getChannel().trigger('failure:avatar:load');
    };
    reader.onerror = function () {
      _self.getChannel().trigger('failure:avatar:load');
    };

    reader.readAsDataURL(file);
  }
});
 
export default Signup;
