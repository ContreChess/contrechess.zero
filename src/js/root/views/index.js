var Marionette  = require('backbone.marionette'),
    template    = require('../templates/index')

module.exports = Marionette.View.extend({
  template: template(),
  regions: {
    main: 'main',
    header: '.header',
    footer: '.footer'
  }
});
