var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var admin = require('./routes/admin');
var hbs = require('hbs');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');

global.dbHandler = require('./database/dbHandler.js');
global.db = mongoose.connect("mongodb://localhost:27017/nodedb");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session config
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'noaencisuensjofwkfoskadwdsokveas',
  cookie:{
    maxAge: 1000*60*30
  }
}));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  var err = req.session.error;
  var suc = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = "";
  if (err) {
    res.locals.message = '<div class="alert alert-danger" style="margin-bottm;20px;color:red;">'+err+'</div>';
  }
  else if (suc) {
     res.locals.message = '<div class="alert alert-success" style="margin-bottm;20px;color:green;">'+suc+'</div>'; 
  }
  next();
});


// basic auth
var checkLogin = function(req, res, next) {
  var url = req.originalUrl;
  if (! req.session.user && url != "/login" && url != "/register" && url != "/require") {
    req.session.error = "请先登录";
    return res.redirect("/login");
  }
  else next();
}

var checkAdmin = function(req, res, next) {
  var url = req.originalUrl;
  if (url == "/help" || url == "/login" || url == "/register" || url == "/require") next();
  if (! req.session.user) {
    req.session.error = "请使用管理员账号登录";
    return res.redirect("/login");
  }
  else if (req.session.user.superuser === false) {
    req.session.error = "请使用管理员账号登录";
    return res.redirect("/login");
  }
  else next();
}

// route config

app.use('/', checkLogin);
app.use('/', index);
app.use('/admin-eth-game', checkAdmin);
app.use('/admin-eth-game', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
