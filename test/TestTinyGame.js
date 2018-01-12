var TinyGame = artifacts.require("./TinyGame.sol");

contract('TinyGame', function(accounts) {
	
	var user = accounts[0];
	var recipicent = accounts[1];
	var game;

	it("doll should be catched correctly", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
	    console.log("1");
            return game.payToCatch.sendTransaction({from:user, value:web3.toWei(1, "ether")});
	  }).then(function() {
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	  }).then(function() {
            game.payToCatch.sendTransaction({from:user, value:web3.toWei(1, "ether")});
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	  })
	});

	it("transfer dolls from user0 to user1", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
            return game.transferDoll.sendTransaction(recipicent, [1,0,0,0,0]);
	  }).then(function(b) {
	    console.log(b);
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	    return game.getDollsByAddress.call(recipicent);
	  }).then(function(c) {
	    console.log(c);
	  });
	});
	
});
