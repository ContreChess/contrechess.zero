import Marionette from 'backbone.marionette';

const DiscoveryRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'discover': 'discover'
  }
});

export default DiscoveryRouter;
