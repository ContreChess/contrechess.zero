  var Backbone    = require('backbone'),
      Marionette  = require('backbone.marionette'),
      RootView    = require('./root/views/index'),
      _           = require('underscore');

  module.exports = Marionette.Application.extend({
    addSubApp: function(name, options) {
      var subAppOptions = _.omit(options, 'subAppClass'),
          subApp = new options.subAppClass(subAppOptions);
      this._subApps[name] = subApp;
    },
    initialize: function () {
      this._subApps = {};
    },
    region: '#main',
    onStart: function () {
      this.showView(new RootView());
      Backbone.history.start();
    }
  });

