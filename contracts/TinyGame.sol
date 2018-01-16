pragma solidity ^0.4.17;
import "eth-random/contracts/Random.sol";
import "./TinyGameStore.sol";

contract TinyGame {
	mapping(address => uint[]) ownership;
	address owner;
	Random random;
	TinyGameStore store;


	event PayOnce(address payer);
	event SubmitSuccess(address winner);
	event Transfer(address sender, address recipient);

	function TinyGame(address randomAddress, address storeAddress) public {
		owner = msg.sender;
		random = Random(randomAddress);
		store = TinyGameStore(storeAddress);
	}

	function payToCatch() public payable {
		require(msg.value==1 ether);
		PayOnce(msg.sender); //event
		bool re = catchDoll(msg.sender);
		require(re);
	}

	function catchDoll(address _user) internal returns (bool) {
		uint dollID = 0;
		//generate a random number in scale 100
		uint randint = random.random(100);
		//get doll ID according to randint
		//uint randint=1;
		if (randint < 20) dollID = 0;
		else if (randint < 40) dollID = 1;
		else if (randint < 60) dollID = 2;
		else if (randint < 80) dollID = 3;
		else dollID = 4;
		//write changes to map ownership
		if (dollID<0 || dollID>4) return false;
		initAddress(_user);
		ownership[_user][dollID]++;
		return true;
	}

	function initAddress(address _user) internal {
		if (ownership[_user].length != 5) {
			ownership[_user] = new uint[](5);
			for (uint index=0; index<5; index++) {
				ownership[_user][index] = 0;
			}
		}
	}

	function submit() public {
		initAddress(msg.sender);
		for (uint dollID=0; dollID<5; dollID++) {
			require(ownership[msg.sender][dollID]>0);
		}
		bool prize = sendPrize(msg.sender);
		require(prize);
		for (dollID=0; dollID<5; dollID++) {
			ownership[msg.sender][dollID]--;
		}
		SubmitSuccess(msg.sender); //event
	}


	function sendPrize(address winner) internal returns (bool) {
		bool retprize = store.sendPrize(winner);
		return retprize;
	}


	function transferDoll(address _recipient, uint[] dollList) public returns (bool) {
		require(dollList.length == 5); //dollList must have 5 items
		initAddress(msg.sender);
		initAddress(_recipient);
		// check sender has enough dolls
		for (uint dollID=0; dollID<5; dollID++) {
			require(ownership[msg.sender][dollID]>=dollList[dollID]);
		}
		// transfer
		for (dollID=0; dollID<5; dollID++) {
			ownership[msg.sender][dollID] = ownership[msg.sender][dollID] - dollList[dollID];
			ownership[_recipient][dollID] = ownership[_recipient][dollID] + dollList[dollID];
		}
		Transfer(msg.sender, _recipient); //event
	}

	function getDollsByAddress(address _user) public returns (uint[]) {
		initAddress(_user);
		return ownership[_user];
	}
	
	function withdraw(uint ammount) public {
		//require(msg.sender == owner);
		msg.sender.send(ammount);
	}

	function showBalance() public returns (uint) {
		//require(msg.sender == owner);
		return this.balance;
	}
}




