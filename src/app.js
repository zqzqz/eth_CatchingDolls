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
//app.use(multer());
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
  delete req.session.error;
  res.locals.message = "";
  if (err) {
    res.locals.message = '<div class="alert alert-danger" style="margin-bottm;20px;color:red;">'+err+'</div>';
  }
  next();
});

// route config
app.use('/', index);
app.use('/transfer', index);
app.use('/login', index);
app.use('/admin-eth-game', admin);
app.use('/users', admin);
app.use('/register', index);
app.use('/checkAccount', index);

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
