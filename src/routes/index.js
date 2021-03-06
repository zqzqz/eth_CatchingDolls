var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Help page */
router.get('/help', function(req, res, next) {
  res.render('help');
});

/* page rendered when metamask is undetected */
router.get('/require', function(req, res, next) {
  res.render('require');
});

/* GET transfer page. */
router.get('/transfer', function(req, res, next) {
  res.render('transfer', {recipient: req.query.recipient});
});

/* login */
router.route('/login').get( function(req, res, next) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render('login');
  }
}).post( function(req, res, next) {
  var User = global.dbHandler.getModel('user');
  var _username = req.body.username;
  User.findOne({username:_username}, function(err,doc) {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    }
    else if (!doc) {
      req.session.error = '用户名不存在';
      res.sendStatus(404);
    }
    else {
      var md5 = crypto.createHash('md5');
      var _password = md5.update(req.body.password).digest('hex');
      if (_password != doc.password) {
        req.session.error = "密码错误";
        res.sendStatus(404);
      }
      else {
        req.session.user = doc;
        res.sendStatus(200);
      }
    }
  });
});


/* register */
router.route('/register').get( function(req, res, next) {
  res.render('register');
}).post( function(req, res, next) {
  var User = global.dbHandler.getModel('user');
  var _username = req.body.username;
  var _password = req.body.password;
  var _email = req.body.email;
  var _publickey = req.body.publickey.toLowerCase();
  var username_pattern = /^[a-zA-Z0-9_\-]{5,20}$/;
  var password_pattern = /^[a-zA-Z0-9_\-!@#$%^&*?]{6,20}$/;
  var email_pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  var publickey_pattern = /^0x[0-9a-f]{40}$/;
  if (! username_pattern.test(_username)) {
    req.session.error = "用户名错误（5-20位数字字母以及_-）";
    res.sendStatus(404);
  }
  else if (! password_pattern.test(_password)) {
    req.session.error = "密码格式错误（6-20位数字字母以及特殊符号）";
    res.sendStatus(404);
  }
  else if (! email_pattern.test(_email)) {
    req.session.error = "email格式错误";
    res.sendStatus(404);
  }
  else if (! publickey_pattern.test(_publickey)) {
    req.session.error = "公钥地址格式错误";
    res.sendStatus(404);
  }
  else {
    var md5 = crypto.createHash('md5');
    _password = md5.update(_password).digest("hex");
    User.findOne({username:_username}, function(err, doc) {
      if (err) {
        console.log(err);
        res.sendStatus(404);
        req.session.error = "未知错误！请稍后重试";
      }
      else if (doc) {
        req.session.error = "用户名已存在";
        res.sendStatus(404);
      }
      else {
        User.create({
          username:_username,
          password:_password,
          email:_email,
          publickey:_publickey,
          superuser: false,
          activate: false
        }, function (err, doc) {
          if (err) {
            console.log(err);
            res.sendStatus(404);
          }
          else {
            req.session.success = "用户创建成功";
            req.session.user = doc;
            res.sendStatus(200);
          }
        });
      }
    });
  }
});


/* logout */
router.get("/logout", function(req, res) {
  req.session.user = null;
  req.session.error = "";
  res.redirect("/login");
});


/* check whether the current account is included in user schema in database */
router.post("/checkAccount", function(req, res, next) {
  var User = global.dbHandler.getModel('user');
  var _username = req.body.username;
  var _publickey = req.body.publickey.toLowerCase();
  if (_username != "") {
    User.findOne({username:_username, publickey:_publickey}, function(err, doc) {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      }
      else if (! doc) {
        res.sendStatus(404);
      }
      else {
        res.sendStatus(200);
      }
    });
  }
  else {
    User.findOne({publickey:_publickey}, function(err, doc) {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      }
      else if (! doc) {
        res.sendStatus(404);
      }
      else {
        res.sendStatus(200);
      }
    });
  }
});

/* page for account info */
router.route("/account/:username").get(function(req, res, next) {
  var _username = req.params.username;
  var User = global.dbHandler.getModel('user');
  User.findOne({username:_username}, function(err, doc) {
    if(err) {
      console.log(err);
      res.sendStatus(404);
    }
    else if (!doc) {
      res.render("account", {notFound:1});
    }
    else {
      var localFlag = null;
      // employ localFlag when user visit his own account page
      if (req.session.user.username == _username) localFlag = 1;
      res.render("account", {local:localFlag, username:_username, email:doc.email, publickey:doc.publickey});
    }
  });
}).post(function(req, res, next) {
  var _username = req.body.username;
  if (req.session.user.username != _username) {
    res.sendStatus(404);
  }
  var _publickey = req.body.publickey.toLowerCase();
  var User = global.dbHandler.getModel('user');
  User.update({username:_username}, {publickey:_publickey}, function(err, doc) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else if (!doc) {
      res.sendStatus(404);
    } else {
      req.session.success = "修改成功";
      req.session.user = doc;
      res.sendStatus(200);
    }
  });
});


module.exports = router;
