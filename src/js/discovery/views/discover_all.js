var Marionette = require('backbone.marionette'),
    tmpl       = require('../templates/all.chbs'),
    _self;

module.exports = Marionette.View.extend({
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
