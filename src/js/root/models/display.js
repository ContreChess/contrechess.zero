var Backbone  = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    text: "This will be the future home of contre.bit",
    user: null
  }
});
