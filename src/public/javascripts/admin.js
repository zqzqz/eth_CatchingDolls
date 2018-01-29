Admin = {
  
  contracts: {},
  accounts: null,
  account: null,
  address: "0x224F629A462ECDb4ECD35Fce983826a38695c64a",
  /*
   * entry function: init Admin.account, contract and event
   */
  init: function() {
    return Admin.initWeb3();
  },

  initWeb3: function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't Adminear or you have no message displayed, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-gamemask")
      // Use Mist/MetaMask's provider
      web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-gamemask");
      // fallback - use your fallback strategy (local node / hosted node + in-dAdmin id mgmt / fail)
      web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    }
    return Admin.initContract();
  },
   
  initContract: function() { 
    
    // init contract
    $.getJSON('/jsons/TinyGame.json', function(data) {
      artifacts = data;
      Admin.contracts.TinyGame = TruffleContract(artifacts);
      // Bootstrap the Admin.contracts.TinyGame abstraction for Use.
      Admin.contracts.TinyGame.setProvider(web3.currentProvider);

      web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          return;
        }

        if (accs.length == 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }
   
        Admin.accounts = accs;
        Admin.account = Admin.accounts[0];
        var user = $("#user").find(".username").text();
        console.log("user",user);
        $.ajax({
          url:'/checkAccount',
          type:'post',
          data:{"username":user, "publickey": Admin.account},
          success: function(data, status) {
            console.log("account correct");
          },
          error: function(data, status) {
            console.log("account wrong");
            alert("当前以太坊账户与您注册的公钥地址不符，强烈建议更换正确的公钥地址");
          }
        });
      }); 
      return Admin.loadPage();
    });  
  },  

  loadPage: function() {
    var game;
    Admin.contracts.TinyGame.at(Admin.address).then(function(instance) {
      game = instance;
      return game.showBalance.call();
    }).then(function(value) {
      $("#balance").text(value.toNumber());
      console.log("balance got");
    }).catch(function(e) {
      console.log(e);
    });
  },

  loadBalance: function() {
    var game;
    Admin.contracts.TinyGame.at(Admin.address).then(function(instance) {
      game = instance;
      var ammount = $("#loadBalance").val();
      console.log("load", ammount);
      game.loadBalance.sendTransaction({from: Admin.account, value: web3.toWei(ammount,"ether")});
    }).then(function() {
      console.log("load success");
    }).catch(function(e) {
      console.log(e);
    });
  },

  fetchBalance: function() {
    var game;
    Admin.contracts.TinyGame.at(Admin.address).then(function(instance) {
      game = instance;
      var ammount = $("#fetchBalance").val();
      console.log("fetch", ammount);
      game.fetchBalance.sendTransaction(web3.toWei(ammount, "ether"), {from: Admin.account});
    }).then(function() {
      console.log("fetch success");
    }).catch(function(e) {
      console.log(e);
    });
  }
};



$(function() {
  $(window).load(function() {
      
    Admin.init();

    });
});

