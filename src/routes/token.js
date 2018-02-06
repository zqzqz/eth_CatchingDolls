var TokenError = require("./TokenError.js")
var crypto=require("crypto");

// token class, containing create, decode and verify functions
//
var token={
  createToken: function(obj, timeout) {
    var newObj = {
      data: obj,
      created: parseInt(Date.now()/1000),
      exp: parseInt(timeout)||0
    };
    // payload
    var base64Str = Buffer.from(JSON.stringify(newObj), "utf8").toString("base64");
    // signature
    var secret = "youlaiyouqueth";
    var hash = crypto.createHmac('sha256', secret);
    hash.update(base64Str);
    var signature = hash.digest('base64');

    return base64Str+'.'+signature;
  },

  decodeToken: function(token) {
    var decArr = token.split('.');
    if (decArr.length < 2) {
      // decArr should contain base64Str and the signature. If not, quit.
      return false;
    }

    var payload = {};
    try {
      payload = JSON.parse(Buffer.from(decArr[0], "base64").toString("utf8"));
    } catch (e) {
      return false;
    }

    // verify the signature
    var secret = "youlaiyouqueth";
    var hash = crypto.createHmac('sha256', secret);
    hash.update(decArr[0]);
    var verifySignature = hash.digest('base64');

    // complete. return attributes
    return {
      payload: payload,
      signature: decArr[1],
      verifySignature: verifySignature
    }
  },

  verifyToken: function(token, callback) {
    // configure callback
    if (callback) {
      var done = callback;
    } else {
      var done = function(err, data) {
        if (err) console.log(err);
        return data;
      }
    }

    var resDecode = this.decodeToken(token);
    if (!resDecode) {
      // fail to decode. quit
      return done(new TokenError('fail to decode token'), null);
    }
    // check timestamp
    var expState = (parseInt(Date.now()/1000) - parseInt(resDecode.payload.created)) > parseInt(resDecode.payload.exp) ? true:false;
    if (resDecode.signature !== resDecode.verifySignature) {
      return done(new TokenError('signature verification failure'), null);
    }
    if (expState) {
      return done(new TokenError('timestamp expired'), null);
    }
    return done(null, resDecode.payload);
  }

}

module.exports=exports=token;
