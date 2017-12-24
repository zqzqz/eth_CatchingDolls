var express = require('express');
var path = require('path');
var app = express();
var routes = require('./routes')(app);
var hbs = require('hbs');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.engine('html', hbs.__express);

app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.logger('dev'));
//app.use(bodyParser());
//app.use(express.methodOverride());

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("http://%s:%s", host, port)
})
