// routes/index.js
//

module.exports = function (app) {
	
	app.get('/', function(req, res) {
		res.render('index', {title:"Catch Your Dolls!"});
	});
};
