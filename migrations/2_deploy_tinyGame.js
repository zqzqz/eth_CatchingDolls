var TinyGame = artifacts.require("./TinyGame.sol");

module.exports = function(deployer) {
	deployer.deploy(TinyGame);
};
