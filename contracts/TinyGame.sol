pragma solidity ^0.4.17;

contract TinyGame {
	struct Doll {
		uint id;
		string name;
		uint features;
		uint time;
		address owner;
	}
	mapping(uint => Doll) dolls;
	mapping(address => uint[]) ownership; 
	uint dollNum;
	address owner;

	event getPayed(address sender, bool flag);

	function TinyGame() public {
		dollNum = 0;
		owner = msg.sender;
	}

	function payToCatch() public payable returns (bool) {
		require(msg.value == 1 finney);
		getPayed(msg.sender, true);
		return true;
	}

	function catchDoll(uint dollID) public returns (uint) {
		require(dolls[dollID].time > 0);
		dolls[dollID].owner = msg.sender;
		ownership[msg.sender].push(dollID);
		return dollID;
	}

	function addDoll(string name, uint feature) public returns (uint dollID) {
		require(msg.sender == owner);
		dollID = dollNum++;
		dolls[dollID] = Doll(dollID, name, feature, 1000, msg.sender);
	}

	function getDollsByAddress() public returns (Doll[]) {
		uint[] memory list = ownership[msg.sender];
		Doll[] storage result;
		for (uint index=0; index<list.length; index++) {
			result.push(dolls[list[index]]);
		}
		return result;
	}

	function getDollByIndex(uint dollID) public returns (Doll) {
		return dolls[dollID];
	}
	
	function getAllDolls() public returns (Doll[]) {
		Doll[] storage result;
		for (uint index=0; index<dollNum; index++) {
			result.push(dolls[index]);
		}
		return result;
	}
}



