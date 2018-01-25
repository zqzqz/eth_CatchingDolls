var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
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
});

router.route('/users/:page').get( function(req, res, next) {
  var currentPage = parseInt(req.params.page);
  var pageSize = 10;
  var User = global.dbHandler.getModel('user');
  if(currentPage<=0 || !currentPage) currentPage = 1;
  var start = (currentPage - 1) * pageSize;
  User.find({}).skip(start).limit(pageSize).sort({'_id':-1}).exec(function(err, doc) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    }
    else if (!doc) {
      res.sendStatus(404);
    }
    else {
      var data = doc;
      User.count(function(err, count) {
        if (err || !count) {
          res.sendStatus(404);
          res.redirect("/admin-eth-game/users/1")
        }
        else {
          var pagenum = parseInt(count/pageSize) + 1;
          console.log(data);
          console.log(pagenum);
          res.render("users", {"data":data, "pagenum":pagenum, "page":currentPage});
        }
      });
    }
  });
}).post( function(req, res, next) {
  var User = global.dbHandler.getModel('user');
  var query = req.body.query;
  if (query.length<=20) {
    var _username = query;
    User.find({username:_username}).exec(function(err, doc) {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(doc);
      }
    });
  }
  else {
    var _publickey = query;
    User.find({publickey:_publickey}).exec(function(err, doc) {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        res.send(doc);
      }
    });
  }
});

module.exports = router;
