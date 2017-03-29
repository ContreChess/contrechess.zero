function ZeroNetError(message, response) {
  this.name = 'ZeroFrame Error';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
  this.response = response;
}

ZeroNetError.prototype = Object.create(Error.prototype);
ZeroNetError.prototype.constructor = ZeroNetError;

module.exports = ZeroNetError;
