var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (! req.session.user) {
    req.session.error = "请使用管理员账号登录";
    res.redirect("/login");
  }
  else if (req.session.user.superuser === false) {
    req.session.error = "请使用管理员账号登录";
    res.redirect("/login");
  }
  else {
    var usernum = 0;
    var User = global.dbHandler.getModel('user');
    User.count(function(err, count) {
      if (err) {
        console.log(err);
      }
      else if (! count) {
        console.log("fail to fetch user list");
      }
      else {
        usernum = count;
      }
      res.render("admin", {"usernum":usernum});
    });
  }
});

router.get('/users/:page', function(req, res, next) {
  console.log(req.query);
  res.render("users", {"page": req.query.page});
});

module.exports = router;
