var Marionette = require('backbone.marionette'),
    _self;

var component = Marionette.Object.extend({
  initialize: function (options) {
    this._components = {};
    
    _self = this;
  },
  addComponent: function(name, options) {
    var componentOptions = _.omit(options, 'componentClass'),
        component = new options.componentClass(componentOptions);

    if (component.hasOwnProperty('parentComponent')) {
      component.parentComponent = this;
    }

    this._components[name] = component;
  }
});
module.exports =  component;
