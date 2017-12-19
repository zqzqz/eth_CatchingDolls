pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TinyGame.sol";

contract TestTinyGame {
	TinyGame tinyGame = TinyGame(DeployedAddresses.TinyGame());

	function testAddDoll() public {
		uint returnID = tinyGame.addDoll('cat', 10);
		uint expected = 0;
		Assert.equal(returnID, expected, "fail to new a doll");
		uint returnID2 = tinyGame.addDoll('dog', 11);
		uint expected2 = 1;
		Assert.equal(returnID2, expected2, "fail to new a doll");
	}

	function testCatch() public {
		uint dollID = 0;
		uint returnID3 = tinyGame.catchDoll(1);
		uint expected3 = 1;
		Assert.equal(returnID3, expected3, "fail to catch no.1 doll");
		TinyGame.Doll[] storage returnList = tinyGame.getDollsByAddress();
		string memory name = returnList[0].name;
		string storage expectedName = "dog";
		Assert.equal(name, expectedName, "catch wrong doll");
	}
}
