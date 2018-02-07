var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var session = require('express-session');
var nodemailer = require('nodemailer');
var token = require('./token');

// mail config
var mailTransport = nodemailer.createTransport({
  host: 'smtp.qq.com',
  secureConnection: false,
  auth: {
    user: '443291890@qq.com',
    pass: 'rukvgwdfvtnfbibc'
  },
});


router.get("/done", function(req, res, next) {
  res.render("passDone", {success:true});
});

/* confirm new password */
router.route("/confirm").get(function(req, res, next) {
  res.render('passConfirm', {success:true, mes:""});
}).post(function(req, res, next) {
  var User = global.dbHandler.getModel('user');
  var _password = req.body.password;
  var _username = req.query.username;
  var _token = req.query.token;

  // check password format for granted
  var password_pattern = /^[a-zA-Z0-9_\-!@#$%^&*?]{6,20}$/;
  if (! password_pattern.test(_password)) {
    return res.send({success:false, message:"密码格式错误"});
  }

  // hash the password
  var md5 = crypto.createHash('md5');
  _password = md5.update(_password).digest("hex");
  // verify token
  token.verifyToken(_token, function(err, data) {
    if (err) {
      return res.send({success:false, message:err});
    } else if (data.data != _username) {
      return res.send({success:false, message:"用户名出错"});
    } else {
      User.update({username:_username}, {password:_password}, function(err, doc) {
        if (err) {
          console.log(err);
          return res.send({success:false, message:"数据库错误，请联系管理员"});
        } else {
          // success: redirect
          return res.send({success:true, message:""});
        }
      });
    }
  });
});


/* change password page: verify the email address and send confirm mail */
router.route("/forget").get(function(req, res, next) {
  res.render('passForget', {success:true, mes:"请填写您的账号和密保邮箱"});
}).post(function(req, res, next) {
  // get post atttributes
  var _username = req.body.username;
  var _email = req.body.email;
  // edit hostname when a public domain name is ready
  var hostname = "47.97.11.87"

  var options = {
    from: '有来有趣<443291890@qq.com>',
    to: _username+'<'+_email+'>',
    subject: "来自幸运狗小游戏的邮件",
    text: "来自幸运狗小游戏的邮件",
    html: "<h1>您好，"+_username+'!</h2><a href="http://'+hostname+'/password/confirm?username='+_username+'&token='+token.createToken(_username, 600000)+'">点击进入密码修改界面</a>'
  };
  
  // check user's info
  var User = global.dbHandler.getModel('user');
  User.findOne({username:_username, email:_email}, function(err, doc) {
    if (err) {
      console.log(err);
      res.send({success:false, message:"数据库查询出错，请联系管理员"});
    } else if (!doc) {
      res.send({success:false, message:"该用户不存在"});
    } else {
      mailTransport.sendMail(options, function(err, msg) {
        if (err) {
          console.log(err);
          return res.send({success:false, message:"邮件发送失败，请检查您的邮箱"});
        } else {
          return res.send({success:true, message:"邮件已发送到"+_email+"，请在10分钟内点击邮件中的修改密码链接"});
        }
      });
    }
  });
});

module.exports = router;
