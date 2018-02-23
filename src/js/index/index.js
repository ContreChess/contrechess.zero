import Backbone       from 'backbone';
import Radio          from 'backbone.radio';
import Router         from './router';
import View           from './views/index';
import ViewComponent  from '../_base/view-component';
import ZeroNetManager from '../utilities/zeronet';

let appChannel = Radio.channel('app'),
    zeronet,
    _self;

const Index = ViewComponent.extend({
  appChannel: 'index',
  initialize: function (options) {
    _self = this;
    this.router = new Router({ controller: this });
    this.model = new Backbone.Model();
    this.view = new View({ model: this.model });

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get',
        { name: 'zeronet', serviceClass: ZeroNetManager });
    }

    zeronet
      .getSiteInfo()
      .then(function (siteInfo) {
        _self.model.set(siteInfo);

        if (siteInfo && siteInfo.cert_user_id) {
        } else {
        }
      });
  },
  home: function () {
    console.log('we called home');
  }
});

export default Index;
