var event_web3 = null;
if (web3 !== undefined) event_web3 = new Web3(web3.currentProvider);
else event_web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
var event_block = 0;

/*
 * I only want to listen to later block from now on 
 * (from event_block) but current block number must be fetched asynchronously.
 * So when I use event.watch() I got event_block = 0 
 * rather than current block number.
 */
event_web3.eth.getBlock('latest', function(error, result) {
	if (!error) {
		event_block = result.number;
	}
	else event_block = 0;
});

// abi and address must change when contract changes.
var abi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getDollsByAddress",
      "outputs": [
        {
          "name": "",
          "type": "uint256[5]"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "ammount",
          "type": "uint256"
        }
      ],
      "name": "fetchBalance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "kill",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "submit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "showBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "payToCatch",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_recipient",
          "type": "address"
        },
        {
          "name": "dollList",
          "type": "uint256[]"
        }
      ],
      "name": "transferDoll",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "loadBalance",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "randomAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "payer",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "dollID",
          "type": "uint256"
        }
      ],
      "name": "PayOnce",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "winner",
          "type": "address"
        }
      ],
      "name": "SubmitSuccess",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ];

var TinyGame = event_web3.eth.contract(abi);
var TinyGame = TinyGame.at("0xCbF43D8b7fC38FEbe469EeA5A463322a3711320e");
/*
 * bug: event_block = 0 rather than current top block.
 * Parse through all blockchain is too costly.
 */
TinyGame.PayOnce({'payer': App.account})
	.watch(function(error, result) {
		if (!error && result.blockNumber > event_block) {
			console.log('payer:', result['args']['payer']);
			console.log('dollID:', result['args']['dollID']);
			App.refreshList();
			$.getJSON('/jsons/doll.json', function(data) {
				var _id = result['args']['dollID'].toNumber();
				$('.pic').find('img').attr('src', data[_id].picture);
			});
			alert("Congratulations! You have caught a lovely dog!");
		}
	});

TinyGame.SubmitSuccess({'winner':App.account}, {fromBlock: event_block+1, toBlock: 'latest'})
	.watch(function(error, result) {
		if (!error && result.blockNumber > event_block) {
			App.refreshList();
			console.log('winner: ', result['args']['winner']);
			alert("Your prize request has been sent successfully. Your Prize will arrive in time.");
		}
	});

TinyGame.Transfer({'sender': App.account}, {fromBlock: event_block+1, toBlock: 'latest'})
	.watch(function(error, result) {
		if (!error && result.blockNumber > event_block) {
			App.refreshList();
			console.log("sender:", result['args']['sender']);
			console.log("recipient:", result['args']['sender']);
			alert("Your dogs have been sent to your friend! Tell him!");
		}
	});
