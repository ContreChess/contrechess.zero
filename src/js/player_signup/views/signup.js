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

  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  ui: {
    name: 'input[type=text][name=name]',
    publicKey: 'textarea[name=publickey]',
    createKey: 'button.create.key',
    bitMessageAddress: 'input[type=text][name=bitmessage-address]',
    emailAddress: 'input[type=text][name=email]',
    submit: 'button.submit.button',
    form: '#signupform'
  },
  triggers: {
    'click @ui.createKey': 'pgp:create',
    'submit @ui.form': 'formSubmit'
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
  }
});
