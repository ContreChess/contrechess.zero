  var Marionette  = require('backbone.marionette'),
      _           = require('underscoret ');

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

