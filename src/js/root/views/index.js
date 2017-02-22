var Marionette  = require('backbone.marionette'),
    template    = require('../templates/index.chbs');

module.exports = Marionette.View.extend({
  template: template(),
  regions: {
    main: 'main',
    header: '.header',
    footer: '.footer'
  }
});
