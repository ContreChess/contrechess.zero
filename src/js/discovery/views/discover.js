import Marionette from 'backbone.marionette';
import tmpl       from '../templates/discover.chbs';
let _self;

const DiscoveryView = Marionette.View.extend({
  initialize: function (options) {
    _self = this;
  },
  template: function () {
      return _self.model ?
        tmpl(_self.model.toJSON()):
        tmpl();
  },
  events: {
    'click #view-player-detail': 'viewPlayerDetail'
  },
  viewPlayerDetail: function() {
    this.trigger('view:player', this.model);
  }
});

export default DiscoveryView;
