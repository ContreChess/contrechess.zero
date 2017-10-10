import Marionette from 'backbone.marionette';
import Backbone   from 'backbone';
let _self;


const SignupRouter = Marionette.AppRouter.extend({
  initialize: function (options) {
    _self = this;
  },
  appRoutes: {
    'signup': 'signup'
  },
  onRoute: function (name, path, args) {
    let model = _self.controller.model;

    if (model && model.user) {
      Backbone.history.navigate('play');
    }
  }
});

export default SignupRouter;
