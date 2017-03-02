var $     = require('jquery'),
Backbone  = require('backbone'),
_self;

module.exports = Backbone.Model.extend({
  defaults: {
  userName: null,
  pgpPublicKey: null,
  authAddress: null,
  bitMessageAddress: null,
  emailAddress: null
  }
});

