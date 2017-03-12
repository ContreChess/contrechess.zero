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
    qrPublicBTC: '.signup.public.btc.key',
    qrPrivateBTC: '.signup.private.btc.key',
    name: 'input[type=text][name=name]',
    pgpPublicKeyArmored: 'textarea[name=pgppublickeyarmored]',
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
    'change @ui.pgpPublicKeyArmored': 'onPgpPublicKeyArmoredChanged', 
    'change @ui.emailAddress': 'onEmailAddressChanged',
    'change @ui.bitMessageAddress': 'onBitMessageAddressChanged'
  },
  modelEvents: {
    'change:pgpPublicKeyArmored': function (model, value) {
      this.getUI('pgpPublicKeyArmored').val(value);
    },
  },
  onPgpCreate: function () {
    var createKeyButton  = this.getUI('createKey');
    createKeyButton.addClass('disabled');
    createKeyButton.attr('disabled', 'disabled');
    signupChannel.trigger('pgp:create');
  },
  formSubmit: function () {
    signupChannel.trigger('user:create');
    return false;
  },
  onPgpCreateSuccess: function () {
    console.log('[signup view] pgp create succeeded');
    this.enableCreateKeyButton();
  },
  onPgpCreateFailure: function () {
    console.error('[signup view] pgp create failed');
    // TODO: add failure messaging
    this.enableCreateKeyButton();
  },
  enableCreateKeyButton: function () {
    var createKeyButton  = this.getUI('createKey');
    createKeyButton.removeClass('disabled');
    createKeyButton.removeAttr('disabled');
  },
  onRender: function () {
    console.log ('[signup view] rendered]');
  },
  onUserCreateSuccess: function () {
  },
  onUserCreateFailure: function () {
  },
  onBtcCreateSuccess: function (qrPublic, qrPrivate) {
    var qrPublicBTC = this.getUI('qrPublicBTC'),
        qrPrivateBTC = this.getUI('qrPrivateBTC');

    qrPublicBTC.attr('src', qrPublic.toDataURL());
    qrPrivateBTC.attr('src', qrPrivate.toDataURL());
  },
  onNameChanged: function (event) {
    this.model.set('userName', event.target.value);
  },
  onPgpPublicKeyArmoredChanged: function (event) {
    this.model.set('pgpPublicKeyArmored', event.target.value);
  },
  onEmailAddressChanged: function (event) {
    this.model.setEmailAddress(event.target.value);
  },
  onBitMessageAddressChanged: function (event) {
    this.model.setBitMessageAddress(event.target.value);
  }
});
