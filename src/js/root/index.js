  var SubComponent    = require('../_base/subcomponent'),
      Radio           = require('backbone.radio'),
      View            = require('./views/index'),
      Router          = require('./router'),
      Model           = require('./models/display'),
      ZeroNetManager  = require('../utilities/zeronet'),
      appChannel      = Radio.channel('app'),
      zeronet,
      _self;

  module.exports = SubComponent.extend({
    appChannel: 'root',
    initialize: function (options) {
      _self = this;
      this.router = new Router({ controller: this });
      this.model = new Model();
      this.view = new View({model: this.model });

      if (options && options.zeroNetManager) {
        zeronet = options.zeroNetManager;
      } else {
        zeronet = appChannel.request('service:get', { name: 'zeronet', serviceClass: ZeroNetManager });
      }

      zeronet
        .getSiteInfo()
        .then(function (siteInfo) {
          _self.siteInfo = siteInfo;

          if (siteInfo.cert_user_id) {
            _self.model.user = siteInfo.cert_user_id;
          }
        });
    },
    home: function () {
      console.log('we called home');
    },
    getView: function () {
      return this.view;
    }
  });

