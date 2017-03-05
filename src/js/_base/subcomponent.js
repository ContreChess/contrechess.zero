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
  getParentComponent: function () {
      return _parentComponent;
  },
  setParentComponent: function (parentComponent) {
    _parentComponent = parentComponent;
  },
  getView: function() {
    return this.view;
  }
});
