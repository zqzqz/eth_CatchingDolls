var TinyGame = artifacts.require("./TinyGame.sol");

contract('TinyGame', function(accounts) {
	
	var user = accounts[0];
<<<<<<< HEAD
	console.log(user);
=======
>>>>>>> c9d6552f3720d359e868523706eb6c94e0b94ef4
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
<<<<<<< HEAD
            for(var i=0; i<40; i++) game.payToCatch.sendTransaction({from:user, value:web3.toWei(1, "ether")});
=======
            game.payToCatch.sendTransaction({from:user, value:web3.toWei(1, "ether")});
>>>>>>> c9d6552f3720d359e868523706eb6c94e0b94ef4
	    return game.getDollsByAddress.call(user);
	  }).then(function(c) {
	    console.log(c);
	  })
	});

<<<<<<< HEAD
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
	  })
	})

	it("transfer dolls from user0 to user1", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
            return game.transferDoll.sendTransaction(recipicent, [1,0,1,0,0]);
=======
	it("transfer dolls from user0 to user1", function() {
	  return TinyGame.deployed().then(function(instance) {
	    game = instance;
            return game.transferDoll.sendTransaction(recipicent, [1,0,0,0,0]);
>>>>>>> c9d6552f3720d359e868523706eb6c94e0b94ef4
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
