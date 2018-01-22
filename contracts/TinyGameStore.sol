pragma solidity ^0.4.17;

contract TinyGameStore {

	uint prize;
	address owner;

	function TinyGameStore() public {
		owner = msg.sender;
		prize = 1000000000000000000;
	}

	function sendPrize(address winner) public returns (bool) {
		require(msg.sender == owner);
		if(! winner.send(prize) ) {
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
