import $            from 'jquery';
import Backbone     from 'backbone';
import Radio        from 'backbone.radio';
import _            from 'underscore';
import popup        from '../../../../semantic/dist/components/popup';
import semanticForm from '../../../../semantic/dist/components/form';
import tmpl         from '../templates/signup.chbs';
import transition   from '../../../../semantic/dist/components/transition';
import Marionette   from 'backbone.marionette';

let signupChannel = Radio.channel('signup'),
    _self;

const SignupView = Marionette.View.extend({
  initialize: function (options) {
    _self = this;

    _.extend(this, options);

    if (!this.model) {
      console.log('no model passed in to the signup view');
      this.model = new Backbone.Model();
    }

    this.listenTo(signupChannel, 'success:pgp:create', this.onPgpCreateSuccess);
    this.listenTo(signupChannel, 'fail:pgp:create', this.onPgpCreateFailure);

    this.listenTo(signupChannel, 'success:user:create', this.onUserCreateSuccess);
    this.listenTo(signupChannel, 'fail:user:create', this.onUserCreateFailure);

    this.listenTo(signupChannel, 'success:btc:get', this.onBtcGetSuccess);
    this.listenTo(signupChannel, 'success:avatar:load', this.onAvatarLoadSuccess);
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  ui: {
    avatar: 'img.signup.image',
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
  events: {
    'dragenter img.signup.image': 'onDragEnterAvatar',
    'dragover img.signup.image':  'onDragOverAvatar',
    'dragleave img.signup.image': 'onDragLeaveAvatar',
    'drop img.signup.image':      'onDropAvatar'
  },
  triggers: {
    'change @ui.bitmessageAddress': 'bitmessage:address:changed',
    'change @ui.emailAddress': 'email:address:changed',
    'change @ui.name': 'name:changed',
    'change @ui.passphrase': 'passphrase:changed',
    'change @ui.pgpPublicKeyArmored': 'pgp:publicKey:armored:changed', 
    'click @ui.copyPublicBTC': 'copy:btc:public',
    'click @ui.createKey': 'pgp:create',
    'click @ui.showPgpGeneration' : 'show:pgp:generation',
    'input @ui.name': 'name:changing',
    'submit @ui.form': 'form:submit'
  },
  modelEvents: {
    'change:pgpPublicKeyArmored': function (model, value) {
      this.getUI('pgpPublicKeyArmored').val(value);
    },
  },
  onPgpCreate: function () {
    let createKeyButton  = this.getUI('createKey'),
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
    let createKeyButton  = this.getUI('createKey');
    createKeyButton.removeClass('disabled loading');
    createKeyButton.removeAttr('disabled');
  },
  clearPassPhrase: function () {
    let passPhrase = this.getUI('passphrase');

    passPhrase.val('');
  },
  onRender: function (view) {
    let copyPublicBTC = this.getUI('copyPublicBTC'),
        buttons = copyPublicBTC,
        form = this.getUI('form'),
        avatar = this.getUI('avatar');

    if (jQuery.fn.popup) {
      let popups =
      buttons.popup({
        on: 'click',
        content: 'Copied!',
        onVisible: function () {
          let _selector  = this;
          setTimeout(function () {
            _selector.popup('hide all');
          }, 2000);
        }
      });
    }

    if (jQuery.fn.form) {
      let forms =
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
    let publicBTC = this.getUI('publicBTC'),
        qrPublicBTC = this.getUI('qrPublicBTC'),
        rightRail = this.getUI('rightRail');

    publicBTC.html(btcAddress);
    qrPublicBTC.attr('src', qrPublic.toDataURL());
    rightRail.removeClass('hidden');
  },
  onAvatarLoadSuccess: function (dataURL) {
    console.log('avatar loaded in signup view');
    _self
      .getUI('avatar')
      .attr('src', dataURL);
  },
  onNameChanged: function () {
    this.model.set('userName', _self.getUI('name').val());
  },
  onNameChanging: function () {
    // TODO: verify that handle isn't taken yet
  },
  onPgpPublicKeyArmoredChanged: function () {
    let pgpPublicKeyArmored = _self.getUI('pgpPublicKeyArmored');

    if (_self.model.has('pgpPublicKeyArmored') &&
        _self.model.get('pgpPublicKeyArmored') === pgpPublicKeyArmored.val()) {
      return false;
    }

    _self.model.set('pgpPublicKeyArmored', pgpPublicKeyArmored.val());
  },
  onEmailAddressChanged: function () {
    let emailAddress = _self.getUI('emailAddress');

    // validate email address
    if (signupChannel.request('validate:email', emailAddress.val())) {
      signupChannel.trigger('set:email', emailAddress);
    } else {
      // TODO: add validation error messaging
    }
  },
  onBitmessageAddressChanged: function () {
    let bitmessageAddress = _self.getUI('bitmessageAddress');
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
    let pgpGenerationInputs = _self.getUI('pgpGenerationInputs');

    pgpGenerationInputs.show();
  },
  onPassphraseChanged: function () {
    let passphrase = _self.getUI('passphrase'),
        passphraseRequiredMessage = _self.getUI('passphraseRequiredMessage');
    if (passphrase.val()) {
      passphraseRequiredMessage.removeClass('error');
    }
  },
  onDragEnterAvatar: function (e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('drag enterred');
    return false;
  },
  onDragOverAvatar: function (e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('drag over');
    _self
      .getUI('avatar')
      .addClass('droppable');
    return false;
  },
  onDragLeaveAvatar: function (e) {
    e.stopPropagation();
    e.preventDefault();
    let avatar = _self.getUI('avatar');
    console.log('drag left');

    _.debounce(function() {
      avatar.removeClass('droppable');
    }, 200);
  },
  onDropAvatar: function (e) {
    e.stopPropagation();
    e.preventDefault();

    console.log('dropping');

    let avatar = _self.getUI('avatar'),
        file = _.first(event.dataTransfer.files);
    avatar.removeClass('droppable');
    console.log(file.name);
    console.log(file.size);

   if (file && file.type && file.type.match('image.*')) {
     signupChannel.trigger('add:avatar', file);
    }
    return false;
  }
});

export default SignupView;
