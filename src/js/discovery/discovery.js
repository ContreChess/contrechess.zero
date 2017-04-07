var SubComponent  = require('../_base/subcomponent'),
    Player        = require('./models/player'),
    View        = require('./views/player_listing'),
    Router      = require('./router'),
    _self;

module.exports = SubComponent.extend({
  channelName: 'discovery',
  initialize: function (options) {
    _self = this;

    this.router = new Router({ controller: this });
    this.view = new View();

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get', { name: 'zeronet', serviceClass: ZeroNetManager });
    }
  },
  render: function () {
    this.view = new View({ model: this.model });
    this.container.show(this.view);
  },
  play: function () {
    console.log('let\'s play!');

      // instead of calling the app to replace the entire view,
      // simply replace a container in the root view (index)
    /*
    _self
      .getParentComponent()
      .showView(_self.getView());
    */
    _self.getChannel().trigger('navigate');
  }
});

