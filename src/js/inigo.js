/******************************************************************
 * My name is Inigo Montoya, you killed my father, prepare to die *
 ******************************************************************/

var pgp         = require('openpgp'),
    Marionette  = require('backbone.marionette'),
    _self;

module.exports = Marionette.Object.extend({
  channelName: 'pgp',
  initialize: function (options) {
    _self = this;
  },
});
