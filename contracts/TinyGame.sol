pragma solidity ^0.4.17;
import "eth-random/contracts/Random.sol";

contract TinyGame {
	mapping(address => uint[]) ownership;
	address owner;
	Random random;


	event PayOnce(address payer);
	event SubmitSuccess(address winner);
	event Transfer(address sender, address recipient);

	function TinyGame(address randomAddress) public {
		owner = msg.sender;
		random = Random(randomAddress);
	}

	function payToCatch() public payable returns (uint) {
		//require(msg.value==1);
		PayOnce(msg.sender); //event
		return catchDoll(msg.sender);
	}

	function catchDoll(address _user) internal returns (uint) {
		uint dollID = 0;
		//generate a random number in scale 100
		uint randint = random.random(100);
		//get doll ID according to randint
		//uint randint=1;
<<<<<<< HEAD
		if (randint < 20) dollID = 0;
		else if (randint < 40) dollID = 1;
		else if (randint < 60) dollID = 2;
		else if (randint < 80) dollID = 3;
=======
		if (randint < 30) dollID = 0;
		else if (randint < 60) dollID = 1;
		else if (randint < 85) dollID = 2;
		else if (randint < 95) dollID = 3;
>>>>>>> c9d6552f3720d359e868523706eb6c94e0b94ef4
		else dollID = 4;
		//write changes to map ownership
		require(dollID>=0 && dollID<=4);
		initAddress(_user);
		ownership[_user][dollID]++;
		return dollID;
	}

	function initAddress(address _user) internal {
		if (ownership[_user].length != 5) {
			ownership[_user] = new uint[](5);
			for (uint index=0; index<5; index++) {
				ownership[_user][index] = 0;
			}
		}
	}

	function submit() public returns (bool) {
		initAddress(msg.sender);
		for (uint dollID=0; dollID<5; dollID++) {
			if (ownership[msg.sender][dollID]<=0) return false;
		}
<<<<<<< HEAD
		if(!sendPrize(msg.sender)) return false;
=======
>>>>>>> c9d6552f3720d359e868523706eb6c94e0b94ef4
		for (dollID=0; dollID<5; dollID++) {
			ownership[msg.sender][dollID]--;
		}
		SubmitSuccess(msg.sender); //event
	}

<<<<<<< HEAD
	function sendPrize(address winner) internal returns (bool) {
		if(! winner.send(5)) {
			return false;
		}
		return true;
	}

=======
>>>>>>> c9d6552f3720d359e868523706eb6c94e0b94ef4
	function transferDoll(address _recipient, uint[] dollList) public returns (bool) {
		if (dollList.length != 5) return false; //dollList must have 5 items
		initAddress(msg.sender);
		initAddress(_recipient);
		// check sender has enough dolls
		for (uint dollID=0; dollID<5; dollID++) {
			if(ownership[msg.sender][dollID]<dollList[dollID]) return false;
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


}




