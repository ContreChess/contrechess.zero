var Marionette    = require('backbone.marionette'),
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

    this.listenTo(signupChannel, 'success:btc:create', this.onBtcCreateSuccess);

  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  ui: {
    rightRail: '.right.dividing.rail',
    publicBTC: '.signup.public.btc.key.value',
    qrPublicBTC: '.signup.public.btc.key.qr',
    copyPublicBTC: 'button.copy.public.btc.key',
    qrPrivateBTC: '.signup.private.btc.key.qr',
    copyPrivateBTC: 'button.copy.private.btc.key',
    showPgpGeneration: 'a.show.pgp.generation',
    pgpGenerationInputs: '.pgp.generation.inputs',
    name: 'input[type=text][name=name]',
    pgpPublicKeyArmored: 'textarea[name=pgppublickeyarmored]',
    passphrase: 'input[type=text][name=passphrase]',
    createKey: 'button.create.key',
    bitMessageAddress: 'input[type=text][name=bitmessage-address]',
    emailAddress: 'input[type=text][name=email]',
    submit: 'button.submit.button',
    form: '#signupform'
  },
  triggers: {
    'click @ui.createKey': 'pgp:create',
    'submit @ui.form': 'formSubmit',
    'change @ui.name': 'onNameChanged',
    'input @ui.name': 'onNameChanging',
    'change @ui.pgpPublicKeyArmored': 'onPgpPublicKeyArmoredChanged', 
    'change @ui.emailAddress': 'onEmailAddressChanged',
    'change @ui.bitMessageAddress': 'onBitMessageAddressChanged',
    'click @ui.copyPublicBTC': 'copy:btc:public',
    'click @ui.copyPrivateBTC': 'copy:btc:private',
    'click @ui.showPgpGeneration' : 'onShowPgpGeneration'
  },
  modelEvents: {
    'change:pgpPublicKeyArmored': function (model, value) {
      this.getUI('pgpPublicKeyArmored').val(value);
    },
  },
  onPgpCreate: function () {
    var createKeyButton  = this.getUI('createKey'),
        passPhrase = this.getUI('passphrase');
    // TODO: validate passphrase
    createKeyButton.addClass('disabled');
    createKeyButton.attr('disabled', 'disabled');
    // TODO: change to loading button
    signupChannel.trigger('pgp:create', passPhrase.val());
  },
  formSubmit: function () {
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
    createKeyButton.removeClass('disabled');
    createKeyButton.removeAttr('disabled');
  },
  clearPassPhrase: function () {
    var passPhrase = this.getUI('passphrase');

    passPhrase.val('');
  },
  onRender: function () {
    console.log ('[signup view] rendered]');
  },
  onUserCreateSuccess: function () {
  },
  onUserCreateFailure: function () {
  },
  onBtcCreateSuccess: function (btcAddress, qrPublic, qrPrivate) {
    var publicBTC = this.getUI('publicBTC'),
        qrPublicBTC = this.getUI('qrPublicBTC'),
        qrPrivateBTC = this.getUI('qrPrivateBTC'),
        rightRail = this.getUI('rightRail');

    publicBTC.html(btcAddress);
    qrPublicBTC.attr('src', qrPublic.toDataURL());
    qrPrivateBTC.attr('src', qrPrivate.toDataURL());
    rightRail.removeClass('hidden');
  },
  onNameChanged: function (event) {
    this.model.set('userName', event.target.value);
  },
  onNameChanging: function (event) {
    // TODO: verify that handle isn't taken yet
  },
  onPgpPublicKeyArmoredChanged: function (event) {
    if (_self.model.has('pgpPublicKeyArmored') &&
        _self.model.get('pgpPublicKeyArmored') === event.target.value) {
      return false;
    }

    _self.model.set('pgpPublicKeyArmored', event.target.value);
  },
  onEmailAddressChanged: function (event) {
    // TODO: validate email address
    if (signupChannel.request('validate:email', event.target.value)) {
      signupChannel.trigger('set:email', event.target.value);
    } else {
    }
  },
  onBitMessageAddressChanged: function (event) {
    // TODO: validate bitmessage address
    if (signupChannel.request('validate:bitmessage', event.target.value)) {
      _self.model.set('bitMessageAddress', event.target.value);
    } else {
    }
  },
  onCopyBtcPublic: function (event) {
    signupChannel.trigger('btc:copy:public');
  },
  onCopyBtcPrivate: function (event) {
    signupChannel.trigger('btc:copy:private');
  },
  onShowPgpGeneration: function (event) {
    var pgpGenerationInputs = _self.getUI('pgpGenerationInputs');

    pgpGenerationInputs.show();
  }
});
