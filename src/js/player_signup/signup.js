var SubComponent  = require('../_base/subcomponent'),
    View          = require('./views/signup'),
    Router        = require('./router'),
    Model         = require('./models/user'),
    _self;

module.exports = SubComponent.extend({
  initialize: function (options) {
    this.router = new Router({ controller: this });
    this.view = new View({model: new Model()});
    _self = this;
  },
  signup: function () {
    console.log('we called signup');
    _self.parentComponent.show(this.getView());
  }
});

