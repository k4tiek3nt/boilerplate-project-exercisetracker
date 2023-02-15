require('dotenv').config();

const { ObjectId } = require('mongodb');
// redefining mongoose for use in myApp
const mongoose = require('mongoose');

//Assign Mongoose Schema to a variable
const Schema = mongoose.Schema;

// Create User Schema 
const userSchema = new Schema({
  username: {type: String, required: true},
  _id: {type: ObjectId, required: false},
  log: [{    
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: String, required: false}
  }]
});

// Create User model from the schema
const User = mongoose.model("User", userSchema);

// Export User Model
exports.UserModel = User;