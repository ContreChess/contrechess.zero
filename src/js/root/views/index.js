var Marionette  = require('backbone.marionette'),
    Model       = require('../models/display'),
    tmpl        = require('../templates/index.chbs'),
    _self;

module.exports = Marionette.View.extend({
  initialize: function () {
    if (!this.model) {
      console.log('no model passed in to root view');
      this.model = new Model();
    }

    _self = this;
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  regions: {
    main: 'main',
    header: '.header',
    footer: '.footer'
  }
});
