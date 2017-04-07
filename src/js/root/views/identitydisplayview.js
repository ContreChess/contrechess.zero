var Marionette          = require('backbone.marionette'),
    Model               = require('../models/display'),
    tmpl        = require('../templates/identitydisplaypanel.chbs.js'),
    _self;

module.exports = Marionette.View.extend({
  initialize: function () {
    _self = this;
    if (!this.model) {
      console.log('no model passed in to the identity display view');
      this.model = new Model();
    }
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  modelEvents: {
    'change:user': 'onUserChanged'
  },
  onUserChanged: function (model, value) {
    if (value && value !== '') {
      _self.render();
    }
  }
});
