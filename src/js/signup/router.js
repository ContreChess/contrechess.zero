  var Marionette = require('backbone.marionette'),
      Backbone   = require('backbone'),
      _self;


  module.exports = Marionette.AppRouter.extend({
    initialize: function (options) {
      _self = this;
    },
    appRoutes: {
      'signup': 'signup'
    },
    onRoute: function (name, path, args) {
      var model = _self.controller.model;

      if (model && model.user) {
        Backbone.history.navigate('play');
      }
    }
  });

