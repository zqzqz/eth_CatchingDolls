var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET transfer page. */
router.get('/transfer', function(req, res, next) {
  res.render('transfer');
});


router.route('/login').get( function(req, res, next) {
  res.render('login');
}).post( function(req, res, next) {
  //pass
});

router.route('/register').get( function(req, res, next) {
  res.render('register');
}).post( function(req, res, next) {
  //pass
});


module.exports = router;
