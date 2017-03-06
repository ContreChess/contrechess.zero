var Marionette  = require('backbone.marionette'),
    Radio       = require('backbone.radio'),
    Model       = require('../models/user'),
    tmpl        = require('../templates/signup.chbs'),
    _self,
    pgpChannel  = Radio.channel('pgp');

module.exports = Marionette.View.extend({
  initialize: function () {
    if (!this.model) {
      console.log('no model passed in to the signup view');
      this.model = new Model();
    }

    _self = this;
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
    submit: 'button.submit.button'
  },
  triggers: {
    'click @ui.createKey': 'pgp:create'
  },
  onPgpCreate: function () {
    // send "loading" signal to button view
    var options = {};
    
        key = pgpChannel.request(options);
});
