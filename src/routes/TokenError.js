var util = require('util');

var TokenError = function (msg, error) {
  Error.call(this.message);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = 'TokenError';
  this.message = message;
  if (error) this.inner = error;
};

TokenError.prototype = Object.create(Error.prototype);
TokenError.prototype.constructor = TokenError;

module.exports = TokenError;
