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

module.exports = router;
