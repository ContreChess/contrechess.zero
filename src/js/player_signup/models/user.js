var $               = require('jquery'),
    Backbone        = require('backbone'),
    Radio           = require('backbone.radio'),
    appChannel      = Radio.channel('app'),
    pgp,
    _self;

module.exports = Backbone.Model.extend({
  defaults: {
  userName: null,
  pgpPublicKeyArmored: null,
  btcAddress: null,
  bitMessageAddress: null,
  emailAddress: null
  },
  initialize: function (options) {
    _self = this;
  }
});

