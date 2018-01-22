
module.exports = {
  user: {
    username:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true},
    publickey:{type:String, required:true},
    superuser:{type:Boolean, required:true}
  }
};
