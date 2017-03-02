var Marionette          = require('backbone.marionette'),
    NavigationView      = require('./navigation.js'),
    FooterView      = require('./footer.js'),
    Model               = require('../models/display'),
    tmpl                = require('../templates/index.chbs'),
    _self;

module.exports = Marionette.View.extend({
  initialize: function () {
    if (!this.model) {
      console.log('no model passed in to root view');
      this.model = new Model();
    }

    this.navigationView = new NavigationView({ model: this.model });
    this.footerView = new FooterView({ model: this.model });
    _self = this;
  },
  template: function () {
    return tmpl(_self.model.toJSON());
  },
  regions: {
    navigation: '.navigation',
    main: 'main',
    footer: '.footer',
  },
  onRender: function () {
    this.showChildView('navigation', this.navigationView);
    this.showChildView('footer', this.footerView);
  }
});
