$(function(){
  // use jquery validator to check the form before submit
  $.validator.addMethod("regex", function(value, element, regexpr) {
    return regexpr.test(value);
  }, "格式错误");
  $('#registerForm').validate({
    errorPlacement: function(error, element) {
      // place error in new row
      $(element).closest(".form-group").append(error);
    },
    rules: {
      username: {
        required: true,
        minlength: 5,
        maxlength: 20,
        regex: /^[a-zA-Z0-9_\-]{5,20}$/
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 20,
        regex: /^[a-zA-Z0-9_\-!@#$%^&*?]{6,20}$/
      },
      password1: {
        required: true,
        equalTo: "#password"
      },
      email: {
        required: true,
        email: true
      },
      publickey: {
        required: true,
        regex: /^0x[0-9a-f]{40}$/
      }
    },
    
    messages: {
      username: {
        required: "请填写用户名",
        minlength: "用户名不能少于5个字符",
        maxlength: "用户名不能超过20个字符",
        regex: "用户名只能包含数字、字母以及‘-’‘_’"
      },
      password: {
        required: "请填写密码",
        minlength: "密码不能少于6位",
        maxlength: "密码不能多于20位",
        regex: "密码只能包含数字、字母及部分特殊字符(-_!@#$%^&*?)"
      },
      password1: {
        required: "请再次输入密码",
        equalTo: "两次输入密码不符"
      },
      email: {
        required: "请填写电子邮箱",
        email: "邮箱地址格式错误"
      },
      publickey: {
        required: "请填写以太坊(ethereum)公钥地址",
        regex: "公钥地址格式错误，请统一使用小写字母并检查位数"
      }
    }
  });
  $("#login1").click(function(){ 
      location.href = 'login';
  });
  $("#register1").click(function(){ 

    var username = $("#username").val();
    var password = $("#password").val();
    var email = $("#email").val();
    var publickey = $("#publickey").val();
    var data = {"username":username,"password":password, "email":email, "publickey":publickey};
    $.ajax({ 
      url: '/register',
      type: 'post',
      data: data,
      success: function(data,status){ 
          if(status == 'success'){ 
              location.href = 'login';
          }
      },
      error: function(data,err){
          console.log(err);
          location.href = 'register';
      }
    });
  });

  // fill the publickey form automatically if an account detected
  $(window).load(function() {
    var contracts = {};
    var account = null;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 App.contracts.TinyGame, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-gamemask")
      // Use Mist/MetaMask's provider
      web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-gamemask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    }
    
    // init contract
    $.getJSON('/jsons/TinyGame.json', function(data) {
      artifacts = data;
      contracts.TinyGame = TruffleContract(artifacts);
      // Bootstrap the App.contracts.TinyGame abstraction for Use.
      contracts.TinyGame.setProvider(web3.currentProvider);

      web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
          console.log("There was an error fetching your accounts.");
          return;
        }

        if (accs.length == 0) {
          console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }

        account = accs[0];
        $('#publickey').val(account);
      });
    });
  });

});
