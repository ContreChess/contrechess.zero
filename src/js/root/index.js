  var Marionette  = require('backbone.marionette'),
      View        = require('./views/index'),
      Router      = require('./router');

  module.exports = Marionette.Object.extend({
    initialize: function (options) {
      this.container = options.container;
      this.router = new Router({ controller: this });
    },
    render: function () {
      this.view = new View();
      this.container.show(this.view);
    },
    home: function () {
      console.log('we called home');
    }
  });

