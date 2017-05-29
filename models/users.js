var mongoose = require('mongoose');

// user schema
var userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name:{
    type: String,
    required: true
  },
  user_name:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

var users = mongoose.model('users', userSchema);

// get users
module.exports.getUsers = function(callback){
  users.find(callback);
}

// get user by id
module.exports.getUserById = function(user_id, callback){
  users.findById(user_id, callback)
}

module.exports.validateUserLogin = function(username, password, callback){
  users.findOne({user_name: username, password: password}, callback);
}

module.exports.registerUser = function(firstname, lastname, username, password, callback){
  // search for existing user
  users.findOne({user_name: username}, function(error, user){
    if(error){
      throw error;
    }
    if(user == null){
      // user is not present
      // create new user
      var newUser = new users({
        first_name: firstname,
        last_name: lastname,
        user_name: username,
        password: password
      });
      // save the user
      newUser.save(callback(user));
    } else{
      // user is already present
      callback(user);
    }
  });
}
