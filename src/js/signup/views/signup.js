var Marionette    = require('backbone.marionette'),
    $             = require('jquery'),
    popup         = require('../../../../semantic/dist/components/popup'),
    transition    = require('../../../../semantic/dist/components/transition'),
    semanticForm  = require('../../../../semantic/dist/components/form'),
    Radio         = require('backbone.radio'),
    Model         = require('../models/user'),
    tmpl          = require('../templates/signup.chbs'),
    signupChannel = Radio.channel('signup'),
    _self;

module.exports = Marionette.View.extend({
  initialize: function () {
    _self = this;

    if (!this.model) {
      console.log('no model passed in to the signup view');
      this.model = new Model();
    }

    this.listenTo(signupChannel, 'success:pgp:create', this.onPgpCreateSuccess);
    this.listenTo(signupChannel, 'fail:pgp:create', this.onPgpCreateFailure);

    this.listenTo(signupChannel, 'success:user:create', this.onUserCreateSuccess);
    this.listenTo(signupChannel, 'fail:user:create', this.onUserCreateFailure);

    this.listenTo(signupChannel, 'success:btc:get', this.onBtcGetSuccess);
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  ui: {
    bitmessageAddress: 'input[type=text][name=bitmessage-address]',
    copyPublicBTC: 'button.copy.public.btc.key',
    createKey: 'button.create.key',
    emailAddress: 'input[type=text][name=email]',
    form: '#signupform',
    name: 'input[type=text][name=name]',
    passphrase: 'input[type=text][name=passphrase]',
    passphraseRequiredMessage: '.passphrase.required.message',
    pgpGenerationInputs: '.pgp.generation.inputs',
    pgpPublicKeyArmored: 'textarea[name=pgppublickeyarmored]',
    publicBTC: '.signup.public.btc.key.value',
    qrPublicBTC: '.signup.public.btc.key.qr',
    rightRail: '.right.dividing.rail',
    showPgpGeneration: 'button.show.pgp.generation',
    submit: 'button.submit.button',
  },
  triggers: {
    'click @ui.createKey': 'pgp:create',
    'submit @ui.form': 'form:submit',
    'change @ui.name': 'name:changed',
    'input @ui.name': 'name:changing',
    'change @ui.pgpPublicKeyArmored': 'pgp:publicKey:armored:changed', 
    'change @ui.emailAddress': 'email:address:changed',
    'change @ui.bitmessageAddress': 'bitmessage:address:changed',
    'change @ui.passphrase': 'passphrase:changed',
    'click @ui.copyPublicBTC': 'copy:btc:public',
    'click @ui.showPgpGeneration' : 'show:pgp:generation'
  },
  modelEvents: {
    'change:pgpPublicKeyArmored': function (model, value) {
      this.getUI('pgpPublicKeyArmored').val(value);
    },
  },
  onPgpCreate: function () {
    var createKeyButton  = this.getUI('createKey'),
        passPhrase = this.getUI('passphrase'),
        passphraseRequiredMessage = this.getUI('passphraseRequiredMessage');
    // validate passphrase
    if (!passPhrase.val()) {
      passphraseRequiredMessage.addClass('error');
      return false;
    }
    
    createKeyButton.addClass('disabled loading');
    createKeyButton.attr('disabled', 'disabled');
    createKeyButton.attr('disabled', 'disabled');

    signupChannel.trigger('pgp:create', passPhrase.val());
  },
  onFormSubmit: function () {
    signupChannel.trigger('user:create');
    return false;
  },
  onPgpCreateSuccess: function () {
    console.log('[signup view] pgp create succeeded');
    this.enableCreateKeyButton();
    this.clearPassPhrase();
  },
  onPgpCreateFailure: function () {
    console.error('[signup view] pgp create failed');
    // TODO: add failure messaging
    this.enableCreateKeyButton();
    this.clearPassPhrase();
  },
  enableCreateKeyButton: function () {
    var createKeyButton  = this.getUI('createKey');
    createKeyButton.removeClass('disabled loading');
    createKeyButton.removeAttr('disabled');
  },
  clearPassPhrase: function () {
    var passPhrase = this.getUI('passphrase');

    passPhrase.val('');
  },
  onRender: function (view) {
    var copyPublicBTC = this.getUI('copyPublicBTC'),
        buttons = copyPublicBTC,
        form = this.getUI('form');

    if (jQuery.fn.popup) {
      var popups =
      buttons.popup({
        on: 'click',
        content: 'Copied!',
        onVisible: function () {
          var _selector  = this;
          setTimeout(function () {
            _selector.popup('hide all');
          }, 2000);
        }
      });
    }

    if (jQuery.fn.form) {
      var forms =
      form.form({
        fields: {
          name: {
            identifier: 'name',
            rules: [
              {
                type: 'empty',
                prompt: 'Please enter your name'
              }
            ]
          }
        }
      });
    }
  },
  onUserCreateSuccess: function () {
  },
  onUserCreateFailure: function () {
  },
  onBtcGetSuccess: function (btcAddress, qrPublic) {
    var publicBTC = this.getUI('publicBTC'),
        qrPublicBTC = this.getUI('qrPublicBTC'),
        rightRail = this.getUI('rightRail');

    publicBTC.html(btcAddress);
    qrPublicBTC.attr('src', qrPublic.toDataURL());
    rightRail.removeClass('hidden');
  },
  onNameChanged: function () {
    this.model.set('userName', _self.getUI('name').val());
  },
  onNameChanging: function () {
    // TODO: verify that handle isn't taken yet
  },
  onPgpPublicKeyArmoredChanged: function () {
    var pgpPublicKeyArmored = _self.getUI('pgpPublicKeyArmored');

    if (_self.model.has('pgpPublicKeyArmored') &&
        _self.model.get('pgpPublicKeyArmored') === pgpPublicKeyArmored.val()) {
      return false;
    }

    _self.model.set('pgpPublicKeyArmored', pgpPublicKeyArmored.val());
  },
  onEmailAddressChanged: function () {
    var emailAddress = _self.getUI('emailAddress');

    // validate email address
    if (signupChannel.request('validate:email', emailAddress.val())) {
      signupChannel.trigger('set:email', emailAddress);
    } else {
      // TODO: add validation error messaging
    }
  },
  onBitmessageAddressChanged: function () {
    var bitmessageAddress = _self.getUI('bitmessageAddress');
    if (signupChannel.request('validate:bitmessage', bitmessageAddress.val())) {
      _self.model.set('bitmessageAddress', bitmessageAddress.val());
    } else {
      // TODO: add validation error messaging
    }
  },
  onCopyBtcPublic: function () {
    signupChannel.trigger('btc:copy:public');
  },
  onShowPgpGeneration: function () {
    var pgpGenerationInputs = _self.getUI('pgpGenerationInputs');

    pgpGenerationInputs.show();
  },
  onPassphraseChanged: function () {
    var passphrase = _self.getUI('passphrase'),
        passphraseRequiredMessage = _self.getUI('passphraseRequiredMessage');
    if (passphrase.val()) {
      passphraseRequiredMessage.removeClass('error');
    }
  }
});
