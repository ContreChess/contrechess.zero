var SubComponent    = require('../_base/subcomponent'),
    Radio           = require('backbone.radio'),
    Player          = require('./models/player'),
    ZeroNetManager  = require('../utilities/zeronet'),
    View            = require('./views/discover'),
    appChannel      = Radio.channel('app'),
    Router          = require('./router'),
    zeronet,
    _self;

module.exports = SubComponent.extend({
  channelName: 'discovery',
  initialize: function (options) {
    _self = this;

    _self.router = new Router({ controller: _self });
    _self.view = new View();

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get', { name: 'zeronet', serviceClass: ZeroNetManager });
    }
  },
  discover: function () {
    console.log('who wants to play?!');

      // TODO: instead of calling the app to replace the entire view,
      // simply replace a container in the root view (index)
    _self
      .getParentComponent()
      .showView(_self.getView());

    zeronet
      .fileQuery('data/users/*/user.json')
      .then(function (userfiles) {
        var players = [];
        if (userfiles && Array.isArray(userfiles)) {
          userfiles.forEach(function(userfile, index){
            players.push(new Player(userfile));
          });
        }
      });

  }
});

