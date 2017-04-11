var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({
  template: require('../templates/player_summary.chbs'),
  events: {
    'click #view-player-detail': 'viewPlayerDetail'
  },
  viewPlayerDetail: function() {
    this.trigger('view:player', this.model);
  }
});
