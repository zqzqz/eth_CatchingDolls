App = {
  
  contracts: {},
  accounts: null,
  account: null,
  address: globalAddress,
  user: globalUser,

  /*
   * entry function: init App.account, contract and event
   */
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 App.contracts.TinyGame, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-gamemask")
      // Use Mist/MetaMask's provider
      web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-gamemask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
      location.href="/require";
    }
    return App.initContract();
  },
   
  initContract: function() { 
    
    // init contract
    $.getJSON('/jsons/TinyGame.json', function(data) {
      artifacts = data;
      App.contracts.TinyGame = TruffleContract(artifacts);
      // Bootstrap the App.contracts.TinyGame abstraction for Use.
      App.contracts.TinyGame.setProvider(web3.currentProvider);
      web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          return;
        }

        if (accs.length == 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }
   
        App.accounts = accs;
        App.account = App.accounts[0];
        if (typeof globalUser === 'undefined') globalUser = "";
        console.log("user",globalUser);
        $.ajax({
          url:'/checkAccount',
          type:'post',
          data:{"username":globalUser, "publickey": App.account},
          success: function(data, status) {
            console.log("account correct");
          },
          error: function(data, status) {
            console.log("account wrong");
            alert("当前以太坊账户与您注册的公钥地址不符，强烈建议更换正确的公钥地址");
          }
        });
      }); 
      return App.loadPage();
    });  
  },  
   
  loadPage: function() {
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

    });
     
    return App.refreshList();
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

    var game;
    if (App.contract === 'undefined') return false;
    App.contracts.TinyGame.at(App.address).then(function(instance) {
      game = instance;
      return game.getDollsByAddress.call(App.account);
    }).then(function(value) {
      // load dolls number
      for (var i = 0; i < 5; i = i + 1) {
        $('.panel-doll').eq(i).find('.doll-num').text(value[i].toNumber());
      }
      return true;
    }).catch(function(e) {
      console.log(e);
      App.setStatus("Error; see log.");
      return false;
    });
  },

  /*
   * callee of catch button
   */
  catch: function() {
    var game;
    App.contracts.TinyGame.at(App.address).then(function(instance) {
      game = instance;
      game.payToCatch.sendTransaction({from: App.account, value: web3.toWei(0.003, "ether")});
    }).then(function(value) {
      console.log("catch transaction sent");
    }).catch(function(e) {
      console.log(e);
      App.setStatus("Operation failed");
    });
  },

  /*
   * callee of submit button
   */
  submit: function() {

    var game;
    // watch events 
    App.contracts.TinyGame.at(App.address).then(function(instance) {
      game = instance;
      return game.submit.sendTransaction({from: App.account});
    }).then(function(value) {
      console.log(value);
      App.setStatus("submit successfully");
    }).catch(function(e) {
      console.log(e);
      App.setStatus("Operation failed");
    });
  },

  /*
   * callee of tranfer button in transfer page
   */
  transfer: function() {
    var recipient = document.getElementById("recipient").value;
    $.ajax({
      url:'/checkAccount',
      type:'post',
      data:{"username":"", "publickey": recipient},
      success: function(data, status) {
        console.log("account correct");
        App.doTransfer();
      },
      error: function(data, status) {
        console.log("account wrong");
        alert("该公钥地址未注册，请检查");
      }
    });
  },

  doTransfer: function() {
    var game;
    var items = document.getElementById("transferItems").value.split(' ');
    var recipient = document.getElementById("recipient").value;
    App.contracts.TinyGame.at(App.address).then(function(instance) {
      game = instance;
      return game.transferDoll.sendTransaction(recipient, items, {from: App.account});
    }).then(function(value) {
      App.refreshList();
    }).catch(function(e) {
      console.log(e);
    });
  }
};



$(function() {
  $(window).load(function() {
      
    App.init();

    });
});

