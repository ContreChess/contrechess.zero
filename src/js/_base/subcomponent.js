var Component = require('./component.js'),
    _self,
    _parentComponent;

module.exports = Component.extend({
  initialize: function (options) {
    if (options && options.parentComponent) {
      _parentComponent = options.parentComponent;
    }
    _self = this;
  },
  parentComponent: {
    get: function () {
      return _parentComponent;
    },
    set: function (value) {
    _parentComponent = value;
    }
  },
  getView: function() {
    return this.view;
  }
});
