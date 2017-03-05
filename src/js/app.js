var Backbone    = require('backbone'),
    Marionette  = require('backbone.marionette'),
    _           = require('underscore');

var app = Marionette.Application.extend({
  region: '#app',
  initialize: function () {
    this.components = {};
  },
  onStart: function () {
    var rootComponent =
      _.find(Object.values(this.components),
      function (component) {
        return component.options.isRoot;
      });

    if (!rootComponent) {
      throw new Error('no root component found');
    }

    this.showView(rootComponent.getView());
    Backbone.history.start();
  },
  addComponent: function (name, options) {
    var componentOptions = _.omit(options, 'componentClass'),
        component = new options.componentClass(componentOptions);

    if (component.setParentComponent) {
      component.setParentComponent(this);
    }

    this.components[name] = component;
  }
});
module.exports = app;
