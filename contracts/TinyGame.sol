pragma solidity ^0.4.17;

contract TinyGame {
	mapping(address => uint[5]) ownership;
	address owner;
  uint seed = 0;
  //Random random = Random(0x345ca3e014aaf5dca488057592ee47305d9b3e10);
	event PayOnce(address payer, uint dollID);
	event SubmitSuccess(address winner);
	event Transfer(address sender, address recipient);

	function TinyGame() public {
		owner = msg.sender;
	}

	function payToCatch() public payable {
		require(msg.value==0.003 ether);
		uint re = catchDoll(msg.sender);
		require(re != 5);
		PayOnce(msg.sender, re); //event
	}

	function catchDoll(address _user) internal returns (uint) {
		uint dollID = 5;
		//generate a random number in scale 100
		seed = uint(sha256(sha256(block.blockhash(block.number), seed), now));
		uint randint = seed % 100;
		//get doll ID according to randint
		if (randint < 30) dollID = 0;
		else if (randint < 60) dollID = 1;
		else if (randint < 79) dollID = 2;
		else if (randint < 98) dollID = 3;
		else dollID = 4;
		//write changes to map ownership
		ownership[_user][dollID]++;
		return dollID;
	}

	function submit() public {
		uint _id = 0;
		
		for (_id=0; _id<5; _id++) {
			require(ownership[msg.sender][_id]>0);
		}
		msg.sender.transfer(100000000000000000);
		for (_id=0; _id<5; _id++) {
			ownership[msg.sender][_id]--;
		}
		SubmitSuccess(msg.sender); //event
	}


	function transferDoll(address _recipient, uint[] dollList) public {
		require(dollList.length == 5); //dollList must have 5 items
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

	function getDollsByAddress(address _user) public view returns (uint[5]) {
		return ownership[_user];
	}
	
	function fetchBalance(uint ammount) public {
		require(msg.sender == owner);
		msg.sender.transfer(ammount);
	}

	function showBalance() public view returns (uint) {
		return this.balance;
	}

	function loadBalance() public payable {
		require(msg.sender == owner);
	}

}



