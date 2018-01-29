var TinyGame = artifacts.require("./TinyGame.sol");

contract('TinyGame', function(accounts) {
	
	var user = accounts[2];
	var recipicent = accounts[1];
	var game;
	var supply = accounts[0];

	it("prepare", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
	  }).then(function() {
      game.loadBalance.sendTransaction({from:supply, value:web3.toWei(5, "ether")});
	    return game.showBalance.call();
	  }).then(function(b) {
	    console.log("balance of contract: ", b.toNumber());
	  });
	});

	    
 	it("catch game", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
      return game.getDollsByAddress.call(user);
	  }).then(function(b) {
      console.log(b);
      for(var i=0; i<100; i++) game.payToCatch.sendTransaction({from:user, value:web3.toWei(0.003, "ether")});
	  }).then(function() {
	    return game.getDollsByAddress.call(user);
	  }).then(function(b) {
	    console.log(b);
	    return game.showBalance.call();
	  }).then(function(b) {
	    console.log("balance of contract: ", b.toNumber());
	  })
	});
	
	it("submit a full group of dolls", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
	    console.log("balance of user: ", web3.eth.getBalance(user).toNumber());
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	    return game.submit.sendTransaction({from:user});
	  }).then(function(b) {
	    console.log("balance of user: ", web3.eth.getBalance(user).toNumber());
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	    return game.showBalance.call();
	  }).then(function(b) {
	    console.log("balance of contract: ", b.toNumber());
	    console.log("balance of user: ", web3.eth.getBalance(user).toNumber());
	  });
	});

	it("transfer dolls from user0 to user1", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
      return game.transferDoll.sendTransaction(recipicent, [1,0,0,0,0], {from:user});
	  }).then(function(b) {
	    //console.log(b);
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	    return game.getDollsByAddress.call(recipicent);
	  }).then(function(c) {
	    console.log(c);
	    console.log("balance of user: ", web3.eth.getBalance(user).toNumber());
	  });
	});	
});
