var Marionette = require('backbone.marionette'),
    _          = require('underscore');

var component = Marionette.Object.extend({
  initialize: function (options) {
    this.components = {}
  },
  addComponent: function (name, options) {
    if (!name || typeof name !== 'string') {
      throw new Error('"name" is missing or is not a valid string');
    }

    if (!options || typeof options !== 'object') {
      throw new Error('"options is missing or is not an object');
    }

    if (!_.has(options, 'componentClass')) {
      throw new Error('missing "componentClass" option');
    }

    if (typeof options.componentClass !== 'function') {
      throw new Error('"componentClass" option is not a valid function');
    }

    var componentOptions = _.omit(options, 'componentClass'),
        component = new options.componentClass(componentOptions);

    if (component.setParentComponent) {
      component.setParentComponent(this);
    }

    this.components[name] = component;

    return component;
  }
});
module.exports =  component;

