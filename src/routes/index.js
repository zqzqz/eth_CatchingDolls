// routes/index.js
//

module.exports = function (app) {
	
	app.get('/', function(req, res) {
		res.render('index', {title:"Catch Your Dolls!", chances:"0", dolls:"0 0 0 0 0"});
	});

	app.get('/purchase', function(req, res) {
		console.log("purchase");
		res.send("1");
	});

	app.get('/catch', function(req, res) {
		console.log("catch");
		res.send("1 0 0 0 0");
	});
};
