var TinyGame = artifacts.require("./TinyGame.sol");
var Random = artifacts.require("eth-random/contracts/Random.sol");
var Store = artifacts.require("./TinyGameStore.sol");

module.exports = function(deployer) {
	deployer.deploy(Random).then(function(){
		return deployer.deploy(Store).then(function(){
			return deployer.deploy(TinyGame, Random.address, Store.address);
		});
	});
};
