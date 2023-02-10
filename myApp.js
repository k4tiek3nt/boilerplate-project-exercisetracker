require('dotenv').config();

// redefining mongoose for use in myApp
const mongoose = require('mongoose');

//Assign Mongoose Schema to a variable
const Schema = mongoose.Schema;

// Create User Schema 
var userSchema = new Schema({
  username: String,
  _id: String
});

// Create User model from the schema
const User = mongoose.model("User", userSchema);

// Create and Save a User

//Creation of User
const createAndSaveUser = function(done) {
  const newUser = new User({
    username: 'Rachel Greene',
    _id: '12char12char'
  });
  //Saving User
  newUser.save(function(err, data) {
    console.log(data);
    if(err){
      return console.error(err);
    }else{
      done(null,data);
    };
  });
};

exports.UserModel = User;
exports.createAndSaveUser = createAndSaveUser;