pragma solidity ^0.4.17;

contract TinyGameStore {

	uint prize;
	address owner;

	function TinyGameStore() public {
		owner = msg.sender;
		prize = 3000;
	}

	function sendPrize(address winner) public returns (bool) {
		if(! winner.send(prize)) {
			return false;
		}
		return true;
	}

	function showBalance() public returns (uint) {
		//require(msg.sender == owner);
		return this.balance;
	}

	function loadPrize() public payable {
		//require(msg.sender == owner);
	}
}