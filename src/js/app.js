  var Backbone    = require('backbone'),
      Marionette  = require('backbone.marionette'),
      _           = require('underscore');

  module.exports = Marionette.Application.extend({
    addComponent: function(name, options) {
      var componentOptions = _.omit(options, 'componentClass'),
          component = new options.componentClass(componentOptions);
      this._components[name] = component;
    },
    initialize: function () {
      this._components = {};
    },
    region: '#app',
    onStart: function () {
      var rootComponent =
        _.find(Object.values(this._components),
        function (component) {
          return component.options.isRoot
        });

      if (!rootComponent) {
        throw new Error('no root component found');
      }

      this.showView(rootComponent.getView());
      Backbone.history.start();
    }
  });

