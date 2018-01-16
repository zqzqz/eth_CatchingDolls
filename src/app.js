var express = require('express');
var path = require('path');
var app = express();
var routes = require('./routes')(app);
var hbs = require('hbs');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const config = require('../webpack.config.js');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// use .html format views
app.engine('html', hbs.__express);
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('connect-history-api-fallback')())

// compile webpack: same function as "npm run build"
/*
var compiler = webpack(config);
app.use(webpackMiddleware(compiler, {
    // public path should be the same with webpack config
    publicPath: config.output.path,
    noInfo: false,
    stats: {
      colors: true
    }
}));
*/

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("http://%s:%s", host, port)
})
