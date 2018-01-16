var TinyGame = artifacts.require("./TinyGame.sol");
var Store = artifacts.require("./TinyGameStore.sol");

contract('TinyGame', function(accounts) {
	
	var user = accounts[0];
	var recipicent = accounts[1];
	var game;
	var supply = accounts[9];

	it("prepare", function() {
	  return Store.deployed().then(function(instance) {
	    game = instance;
	  }).then(function() {
            game.loadPrize.sendTransaction({from:supply, value:web3.toWei(50, "ether")});
	  });
	});

	    
 	it("catch game", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
	  }).then(function() {
            for(var i=0; i<20; i++) game.payToCatch.sendTransaction({from:user, value:web3.toWei(0.001, "ether")});
	  }).then(function() {
	    return game.getDollsByAddress(user);
	  }).then(function(b) {
	    console.log(b);
	  })
	});
	
	it("submit a full group of dolls", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
	    console.log(web3.eth.getBalance(user).toNumber());
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	    return game.submit.sendTransaction({from:user});
	  }).then(function(b) {
	    console.log(b);
	    console.log(web3.eth.getBalance(user).toNumber());
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	  });
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
