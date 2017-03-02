var Backbone    = require('backbone'),
    Marionette  = require('backbone.marionette'),
    Component   = require('./_base/component'),
    _           = require('underscore');

var app = Marionette.Application.extend({
  region: '#app',
  onStart: function () {
    var rootComponent =
      _.find(Object.values(this._components),
      function (component) {
        return component.options.isRoot;
      });

    if (!rootComponent) {
      throw new Error('no root component found');
    }

    this.showView(rootComponent.getView());
    Backbone.history.start();
  }
}, Component);
module.exports = app;
