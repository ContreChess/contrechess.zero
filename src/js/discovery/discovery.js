import Backbone       from 'backbone';
import Radio          from 'backbone.radio';
import Router         from './router';
import View           from './views/discover';
import ZeroNetManager from '../utilities/zeronet';
import ViewComponent  from '../_base/view-component.js';

let appChannel = Radio.channel('app'),
    zeronet,
    _self;

const Discovery = ViewComponent.extend({
  channelName: 'discovery',
  initialize: function (options) {
    _self = this;

    _self.router = new Router({ controller: _self });
    _self.view = new View();

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get',
        { name: 'zeronet', serviceClass: ZeroNetManager });
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
        let players = [];
        if (userfiles && Array.isArray(userfiles)) {
          userfiles.forEach(function(userfile, index){
            players.push(new Backbone.Model(userfile));
          });
        }
      });

  }
});

export default Discovery;
