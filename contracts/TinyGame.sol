pragma solidity ^0.4.17;

contract TinyGame {
	mapping(address => uint[]) ownership;
	mapping(address => uint) chances;
	address owner;

	event getPayed(address _user);

	function TinyGame() public {
		owner = msg.sender;
	}

	function payToCatch() public payable {
		chances[msg.sender]++;
		getPayed(msg.sender);
	}

	function catchDoll(address _user, uint _dollID) public {
		require(chances[_user] > 0);
		if (ownership[_user].length != 5) {
			ownership[_user] = new uint[](5);
			for (uint index=0; index<5; index++) {
				ownership[_user][index] = 0;
			}
		}
		ownership[_user][_dollID]++;
		chances[_user]--;
	}

	function getDollsByAddress(address _user) public returns (uint[]) {
		return ownership[_user];
	}

	function getChancesByAddress(address _user) public returns (uint) {
		return chances[_user];
	}
}



