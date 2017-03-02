var Marionette          = require('backbone.marionette'),
    Model               = require('../models/display'),
    IdentityDisplayView = require('./identitydisplayview.js'),
    tmpl        = require('../templates/navigation.chbs'),
    _self;

module.exports = Marionette.View.extend({
  initialize: function () {
    if (!this.model) {
      console.log('no model passed in to root view');
      this.model = new Model();
    }

    this.identityDisplayView = new IdentityDisplayView({model: this.model});

    _self = this;
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  regions: {
    identityDisplay: '.identity.display',
  },
  onRender: function () {
    this.showChildView('identityDisplay', this.identityDisplayView);
  }
});
