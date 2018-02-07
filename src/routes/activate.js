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


/* email validation confirmed */
router.route("/confirm").get(function(req, res, next) {
  var User = global.dbHandler.getModel('user');
  _username = req.query.username;
  _token = req.query.token;
  console.log(_username, _token);
  token.verifyToken(_token, function(err, data) {
    if (err) {
      res.render('activateConfirm', {success:false, mes:err});
    } else if (data.data != _username) {
      res.render('activateConfirm', {success:false, mes:"username not matched"});
    } else {
      User.update({username:_username}, {activate:true}, function(err, doc) {
        if (err) {
          console.log(err);
          res.render('activateConfirm', {success:false, mes:"database update failure"});
        } else {
          req.session.user = doc;
          res.render('activateConfirm', {success:true, mes:""});
        }
      });
    }
  });
});


/* email validation info */
router.route("/").get(function(req, res, next) {
  res.render('activate', {success:true, mes:"正在发送邮件"});
}).post(function(req, res, next) {
  // the user has validate the email. No use to send email
  if (req.session.user.activate == true) res.redirect('/');
  // send email
  var _username = req.session.user.username;
  var _email = req.body.email;
  var message = null;
  // edit hostname when a public domain name is ready
  var hostname = "47.97.11.87"

  var options = {
    from: '有来有趣<443291890@qq.com>',
    to: _username+'<'+_email+'>',
    subject: "来自幸运狗小游戏的邮件",
    text: "来自幸运狗小游戏的邮件",
    html: "<h1>您好，"+_username+'!</h2><a href="http://'+hostname+'/activate/confirm?username='+_username+'&token='+token.createToken(_username, 600000)+'">点击激活账号</a>'
  };
  if (req.session.user.activate == true) res.redirect('/');

  if (_email && _email != req.session.user.email) {
    var User = global.dbHandler.getModel('user');
    User.update({username:req.session.user.username}, {email:_email}, function(err, doc) {
      if (err) {
        console.log(err);
        res.send({success:false, message:"更改邮箱失败，请确认邮箱格式再重试"});
      } else if (!doc) {
        res.send({success:false, message:"更改邮箱失败，请确认邮箱格式再重试"});
      } else {
        console.log("die");
        req.session.success = "修改邮箱成功";
        req.session.user = doc;
        mailTransport.sendMail(options, function(err, msg) {
          if (err) {
            console.log(err);
            return res.send({success:false, message:"邮件发送失败，重新发送或更换邮箱试试"});
          } else {
            return res.send({success:true, message:"邮件已发送到"+_email+"，请在10分钟内点击邮件中的激活链接"});
          }
        });
      }
    });
  } else {
    mailTransport.sendMail(options, function(err, msg) {
      if (err) {
        console.log(err);
        return res.send({success:false, message:"邮件发送失败，重新发送或更换邮箱试试"});
      } else {
        return res.send({success:true, message:"邮件已发送到"+_email+"，请在10分钟内点击邮件中的激活链接"});
      }
    });
  }
});

module.exports = router;
