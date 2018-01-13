// routes/index.js
// import modules
var Web3=require('web3');
var TruffleContract=require('truffle-contract');
var jQuery=require('jquery');
var TinyGame=require('../../build/contracts/TinyGame.json')

// global
var web3Provider = null;
var contract = {};

module.exports = function (app) {
	
	app.get('/', function(req, res) {
		init();
		var chances = 0;
		var dolls = [0, 0, 0, 0, 0];
		var account = getAccount();
		contract.TinyGame.deployed().then(function(instance) {
			chances = instance.getChancesByAddress.call(account);
			dolls = instance.getDollsByAddress(account);
		});
		res.render('index', {title:"Catch Your Dolls!", chances:chances.valueOf(), dolls:dolls.valueOf()});
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

function init() {
	return initWeb3();
}

function initWeb3() {
	//init web3
	if (typeof web3 !== 'undefined') {
		//web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		web3Provider = web3.currentProvider;
		console.log("injected");
	} else {
		web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		console.log("no injection");
	}
	web3 = new Web3(web3Provider);
	return initContract();
}

function initContract() {
	contract.TinyGame = TruffleContract(TinyGame);
	contract.TinyGame.setProvider(web3Provider);
	return 1;
}

function getAccount() {
	return web3.eth.getAccounts()[0];
}
