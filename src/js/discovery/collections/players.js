var Marionette = require('backbone.marionette'),
    Player     = require('../models/player');

module.exports = Backbone.Collection.extend({
  model: Player
});
