var Marionette = require('backbone.marionette');

var component = Marionette.Object.extend({
  initialize: function (options) {
    this.components = {}
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
module.exports =  component;

