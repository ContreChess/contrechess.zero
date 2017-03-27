/******************************************************************
 * My name is Inigo Montoya, you killed my father, prepare to die *
 ******************************************************************/

var pgp                             = require('openpgp'),
    Marionette                      = require('backbone.marionette'),
    // TODO: create a bot and site (in ZeroNet) to perform content certificate signing
    // also use proof-of-work for anti-spam (client-side)
    _userContentBitcoinSignatureWIF = 'L4qT6HSCfwun9MKcuWbxMiRoy9QwumptiT65Vn9VXzftunKvL2RJ',
    currency,
    _self;

module.exports = Marionette.Object.extend({
  channelName: 'pgp',
  initialize: function (options) {
    _self = this;
    this.pubKey = [
      '-----BEGIN PGP PUBLIC KEY BLOCK-----',
      'Version: GnuPG v2',
      'mQINBFjCxcUBEADcXveplZXWhYxSICowjurgnRcf3UI1AQ5HyZPXK/ozgBDOu2Ta',
      'ZBMc6CzNHhv5YGWvG1kKuZZIYEbKwVJK7IX2upCwaOaw6uQAQ8QE0g2g+TsaTClr',
      'rWZ8dcTOo7NPaMimMD0iKN7t8fiKHIFjdOdHActD49lNVHjuVZlLkTSlaKL+fv52',
      'rf2XY8NT+5+ktv6XpzxPDjrBVZfyVOBuEs83R2WXekT37m8huiwHdkcGTBJBwAid',
      'e2g6TjlMpp5wOKwWG7snMpNv3HYr5/2PbpHRorBe9RBba6YrE7VvkRR94vIoOMul',
      'MlywIlTmwDGz3N/dBDX+HeLw2oTNkjx3MKGFogDs7GFiYI7XajN0ILS+w5kTbWfV',
      '3FDCNTIf8fLR4xY6Wu6pNZmgKk9C5eMFPaAzWdPTu+jzox5tfaOxUw/Zgmf0SNtt',
      'OLiX7HNrenaqpFQ7X14sTa407Q/IsWvouGZ3Y7lVkTELbXNFSjmMA91i6FXScl6C',
      'WYYkmvGPI4uOeppgyWI72L8KNzh88jBSDzqWyjBkmqIhwaPqL9DZmjx5tZifUzRl',
      'TGbIwoXFe0dmzPa5vFrR6+dyqGCgc6yTYV6sqqaegD8tPrHPw1ZuOSZHgMyHi6PQ',
      '5LrYFbQNzPpq42p1nMQwi5XsZZMZebTypGeiAhocDOdeJacsb2kXsKp/OwARAQAB',
      'tCRJbmlnbyBNb250b3lhIDxpbmlnb0Bjb250cmVjaGVzcy5pbz6JAjkEEwEIACMF',
      'AljCxcUCGwMHCwkIBwMCAQYVCAIJCgsEFgIDAQIeAQIXgAAKCRC5zGxjJbZPDHe4',
      'EADWWUk9DHJLVrI7HzuoqUSszQOzzvxagctaphKeFlYnmiifMPdoxJMPH1IqChaA',
      'pMsFyTDfgGzwFuAeLIJg8Sf3VwG7iHUl7zYQQStSfS5gCv25E2SssXpiRdhqhlYn',
      'iRUdKJvkymwdvlGboYwnM5QOtsBo3otIVka56aFnLyyPTFV00SK6k4nZWHK51mEz',
      'uScLOA/oD+/MXujaDQnQkPNzMJMODCFVhzaPf0WuL53ZI17zN9ANpaJ6NwGQXj++',
      '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',
      '0sqS6g==',
      '=LJZ9',
      '-----END PGP PUBLIC KEY BLOCK-----'].join('\n');
      console.log('[inigo] My name is Inigo Montoya, you killed my father, prepare to die.');
  },
  getPublickKey: function () {
    return _self.pubKey;
  },
  getNextAddressBTC: function () {
  },
  getNextAddressLTC: function () {
  },
  getUserContentBitcoinSignatureWIF: function () {
    return _userContentBitcoinSignatureWIF;
  },
});
