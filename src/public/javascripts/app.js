// Import the pagjquery 获取元素值e's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "./jquery.min.js"

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import tinygame_artifacts from '../../../build/contracts/TinyGame.json'

// global var
var TinyGame;
var accounts;
var account;
var gameInstance;
var delta_list = [0,0,0,0,0];
var doll_list = [0,0,0,0,0];
var catched;
// event instances
var PayOnceEvent;
var SubmitSuccessEvent;

window.App = {
  
  /*
   * entry function: init account, contract and event
   */
  start: function() {
    var self = this;
    TinyGame = contract(tinygame_artifacts);
    console.log(TinyGame);
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
    });   
    
    // assign and watch events
    TinyGame.deployed().then(function(instance) {
      //assign events
      PayOnceEvent = instance.PayOnce();
      SubmitSuccessEvent = instance.SubmitSuccess();
      return instance.getDollsByAddress.call(account);
    }).then(function(value) {
      for (var i=0; i<5; i++) doll_list[i] = value[i].toNumber();
    })   
    
    // load dolls
    $.getJSON('../jsons/doll.json', function(data) {
      var dollsRow = $('#dollsRow');
      var dollTemplate = $('#dollTemplate');
      for (var i = 0; i < data.length; i++) {
	  dollTemplate.find('.panel-title').text(data[i].name);
	  dollTemplate.find('img').attr('src', data[i].picture);
	  dollTemplate.find('.doll-num').text('0');
	  dollsRow.append(dollTemplate.html());
      }

      var dollTemplate = $('dollTemplate');
    });
     
    self.refreshList();
  },

  /*
   * print error or return message on the window
   */
  setStatus: function(message) {
    var status = document.getElementById("hint");
    status.innerHTML = message;
  },


  /*
   * update account's doll possession list
   */
  refreshList: function() {
    var self = this;

    var game;
    TinyGame.deployed().then(function(instance) {
      game = instance;
      return game.getDollsByAddress.call(account);
    }).then(function(value) {
      // load dolls number
      var dolsRow = $('#dollsRow');
      var dollTemplate = $('#dollTemplate');
console.log(doll_list, delta_list);
      for (var i = 0; i < 5; i++) {
        var item = $('.panel-doll').eq(i).find('.doll-num');
	delta_list[i] = value[i].toNumber() - doll_list[i];
	doll_list[i] = value[i].toNumber();
	item.text(value[i].toNumber());
      }

console.log(doll_list, delta_list);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error; see log.");
    });
  },

  /*
   * callee of catch button
   */
  catch: function() {
    var self = this;
    var game;
    console.log(account);
    // watch events
    PayOnceEvent.watch(function(error, result) {
        if (!error) {
          console.log("You have caught a doll successfully!");
        }
    }); 
    TinyGame.deployed().then(function(instance) {
      game = instance;
      return game.payToCatch.sendTransaction({from: account, value: web3.toWei(0.001, "ether")});
    }).then(function(value) {
        self.refreshList();
	console.log(delta_list);
        for (var i = 0; i < 5; i++) {
          if (delta_list[i] != 0) catched = i;
	  break;
        }
	console.log("catched: ", catched);
        $.getJSON('../jsons/doll.json').then(function(data) {
          $('.pic').find('img').attr('src', data[catched].picture);
	});
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Operation failed");
    });
  },

  /*
   * callee of submit button
   */
  submit: function() {
    var self = this;
    var game;
    // watch events 
    SubmitSuccessEvent.watch(function(error, result) {
        if (!error) {
          console.log("You will receive the prize later! This may takes seconds");
        }
    }); 

    TinyGame.deployed().then(function(instance) {
      game = instance;
      return game.submit.sendTransaction({from: account, value:0});
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
