  var SubComponent  = require('../_base/subcomponent'),
      View          = require('./views/index'),
      Router        = require('./router'),
      Model         = require('./models/display'),
      _self;

  module.exports = SubComponent.extend({
    initialize: function (options) {
      this.router = new Router({ controller: this });
      this.view = new View({model: new Model()});
    },
    home: function () {
      console.log('we called home');
    },
    getView: function () {
      return this.view;
    }
  });

