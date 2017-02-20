  require('./bootstrap');

  var App = require('./app'),
      AppLayout = require('./views/app_layout'),
      PlayerListing = require('./player_listing');

  var app = new App(),
      layout = new AppLayout();

  app.addSubApp('playerListing', {
    subAppClass: PlayerListing,
    container: layout.getRegion('main') // TODO: find a region for this
  });

  Backbone.history.start();

