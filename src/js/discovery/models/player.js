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
    bitmessageAddress: null,
    emailAddress:
  },
  initialize: function (options) {
    _self = this;
  }
});

