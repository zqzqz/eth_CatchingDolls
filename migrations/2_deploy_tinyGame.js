var TinyGame = artifacts.require("./TinyGame.sol");
var Random = artifacts.require("eth-random/contracts/Random.sol");

module.exports = function(deployer) {
	deployer.deploy(Random).then(function() {
		return deployer.deploy(TinyGame, Random.address);
	});
};
