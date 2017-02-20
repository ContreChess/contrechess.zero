  var Marionette  = require('backbone.marionette'),
      Player      = require('./models/player'),
      View        = require('./views/player_listing'),
      Router      = require('./router');

  module.exports = Marionette.Object.extend({
    initialize: function (options) {
      this.container = options.container;
      this.router = new Router({ controller: this });
    },
    render: function () {
      this.view = new View({ model: this.model });
      this.container.show(this.view);
    }
  });

