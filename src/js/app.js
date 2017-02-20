  var Marionette  = require('Backbone.Marionette'),
      _           = require('underscore');

  module.exports = Marionette.Application.extend({
    initialize: function () {
      this._subApps = {};
    },

    addSubApp: function(name, options) {
      var subAppOptions = _.omit(options, 'subAppClass'),
          subApp = new options.subAppClass(subAppOptions);
      this._subApps[name] = subApp;
    }
  });

