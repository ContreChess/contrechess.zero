var $               = require('jquery'),
    Backbone        = require('backbone'),
    Radio           = require('backbone.radio'),
    PrivacyManager  = require('../../utilities/pgp'),
    appChannel      = Radio.channel('app'),
    _clearTextEmail,
    _clearTextBitMessageAddress,
    pgp,
    pgpPublicKeyArmored,
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

    if (options && options.pgpManager) {
      pgp = options.pgpManager;
    } else {
      pgp = appChannel.request('service:get', { name: 'pgp', serviceClass: PrivacyManager });
    }
  },
  setBitMessageAddress: function (address) {
    // when coming from the view, 'address' has a value
    // when coming from an update to 'pgpPublicKeyArmored', address will be undefined
    // but _clearTextBitMessageAddress should have a value
    _clearTextBitMessageAddress = address || _clearTextBitMessageAddress;

    if (_clearTextBitMessageAddress) {
      if (pgp && _self.has('pgpPublicKeyArmored')) {
        
      } else {
        _self.listenToOnce(_self, 'change:pgpPublicKeyArmored', _self.setBitMessageAddress);
      }
    }
  },
  setEmailAddress: function (address) {
    _clearTextEmail = address || _clearTextEmail;

    if (_clearTextEmail) {
      if (pgp) {
      } else {
        _self.listenToOnce(_self, 'change:pgpPublicKeyArmored', _self.setEmailAddress);
      }
    }
  }
});

