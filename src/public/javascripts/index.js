// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import tinygame_artifacts from '../../../build/contracts/TinyGame.json'

// TinyGame is our usable abstraction, which we'll use through the code below.
var TinyGame = contract(tinygame_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the TinyGame abstraction for Use.
    TinyGame.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshList();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("hint");
    status.innerHTML = message;
  },

  refreshList: function() {
    var self = this;

    var game;
    TinyGame.deployed().then(function(instance) {
      game = instance;
      return game.getDollsByAddress.call(account);
    }).then(function(value) {
      var element = document.getElementById("dollList");
      element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error; see log.");
    });
  },


  catch: function() {
    var self = this;
    var game;
    TinyGame.deployed().then(function(instance) {
      game = instance;
      return game.payToCatch.sendTransaction({from: account, value: web3.toWei(1, "ether")});
    }).then(function(value) {
      self.refreshList();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Operation failed");
    });
  },

  transfer: function() {
    var self = this;
    var game;
    var items = document.getElementById("transferItems").value.split(' ');
    var recipient = document.getElementById("recipient").value;

    console.log(recipient);
    console.log(items);
    if (items.length!=5) {
      self.setStatus("wrong input");
      return;
    }

    TinyGame.deployed().then(function(instance) {
      game = instance;
      return game.transferDoll.sendTransaction(recipient, items, {from: account});
    }).then(function(value) {
      self.setStatus("transfer succeed");
      self.refreshList();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Operation failed");
    });
  },

  submit: function() {
    var self = this;
    var game;
    TinyGame.deployed().then(function(instance) {
      game = instance;
      return game.submit.sendTransaction({from: account});
    }).then(function(value) {
      console.log(value);
      self.setStatus("submit successfully");
      self.refreshList();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Operation failed");
    });
  },
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 TinyGame, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-gamemask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-gamemask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
