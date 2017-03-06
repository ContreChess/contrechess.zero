var Backbone    = require('backbone'),
    Marionette  = require('backbone.marionette'),
    _           = require('underscore');

var app = Marionette.Application.extend({
  channelName: 'app',
  radioRequests: {
    'service:get': 'getService'
  },
  region: '#app',
  addService: function (options) {
    var serviceOptions = _.omit(options, 'serviceClass'),
        service = new options.serviceClass(serviceOptions);

    return this.services[options.name] = service;
  },
  getService: function (options) {
    
    if (this.services[options.name]) {
      return this.services[options.name];
    } else {
      return this.addService(options);
    }
  },
  initialize: function () {
    this.components = {};
    this.services = {};
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
