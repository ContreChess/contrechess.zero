import Marionette from 'backbone.marionette';

const IndexRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'home': 'home'
  }
});

export default IndexRouter;
