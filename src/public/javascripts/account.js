Account = {

  contracts: {},
  account: null,
  address: globalAddress,

  /*
   * entry function: init Account.account, contract and event
   */
  init: function() {
    return Account.initWeb3();
  },

  initWeb3: function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't Accountear or you have 0 Account.contracts.TinyGame, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-gamemask")
      // Use Mist/MetaMask's provider
      web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-gamemask");
      // fallback - use your fallback strategy (local node / hosted node + in-dAccount id mgmt / fail)
      web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    }
    return Account.initContract();
  },
   
  initContract: function() { 
    
    // init contract
    $.getJSON('/jsons/TinyGame.json', function(data) {
      artifacts = data;
      Account.contracts.TinyGame = TruffleContract(artifacts);
      // Bootstrap the Account.contracts.TinyGame abstraction for Use.
      Account.contracts.TinyGame.setProvider(web3.currentProvider);
      
      if (typeof account !== 'undefined') {
        Account.account = account;
        return Account.loadPage();
      } else {
        console.log("不能获取当前用户");
      }
      
    });  
  },  
  loadPage: function() {
 
    return Account.refreshList();
  },
 
  /*
   * update account's doll possession list
   */
  refreshList: function() {

    var game;
    if (Account.contract === 'undefined') return false;
    Account.contracts.TinyGame.at(Account.address).then(function(instance) {
      game = instance;
      return game.getDollsByAddress.call(Account.account);
    }).then(function(value) {
      // load dolls number
      for (var i = 0; i < 5; i = i + 1) {
        dollList[i] = value[i].toNumber();
        $('.animals').eq(i).find('span').text(value[i].toNumber());
      }
      return true;
    }).catch(function(e) {
      console.log(e);
      return false;
    });
  }
};



$(function() {
  $(window).load(function() {
      
    Account.init();

  });
  $("#transfer").click(function(){ 
    if (typeof account !== 'undefined') {
      location.href = "/transfer/?recipient="+account;
    } else {
      return false;
    }
  });

  $("#submit").click(function(){ 

    var email = $("#email").val();
    var publickey = $("#publickey").val();
    if (typeof username === 'undefined') {return false;}
    var data = {"username": username, "email":email, "publickey":publickey};
    $.ajax({ 
      url: '/account/'+username,
      type: 'post',
      data: data,
      success: function(data,status){ 
          if(status == 'success'){ 
              window.location.reload();
          }
      },
      error: function(data,err){
          console.log(err);
      }
    });
  });

  $("#search").click(function() {
    var username = $("#searchName").val();
    if (username && username != "") {
      location.href="/account/"+username;
    } else {
      return false;
    }
  });
});
