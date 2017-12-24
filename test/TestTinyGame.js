var TinyGame = artifacts.require("./TinyGame.sol");

contract('TinyGame', function(accounts) {
	
	var user = accounts[0];
	var game;
	
	it("chances should by added correctly", function() {
	  return TinyGame.deployed().then(function(instance) {
            game = instance;
	    return instance.payToCatch({from: user, value: web3.toWei(1,'ether')});
	  }).then(function() {
	    return game.getChancesByAddress.call(user);
	  }).then(function(c) {
            assert.equal(c.valueOf(), 1, "error: chances not added");
	  });
	});


	it("doll should be catched correctly", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
            return game.catchDoll(user, 0);
	  }).then(function() {
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
            assert.equal(c[0].valueOf(), 1, "error: dolls not catched");
	  });
	});
	
});
