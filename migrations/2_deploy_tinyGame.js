var TinyGame = artifacts.require("./TinyGame.sol");

module.exports = function(deployer) {
	return deployer.deploy(TinyGame);
};
