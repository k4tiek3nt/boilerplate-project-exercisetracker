'use strict'; // Avoids undefined variables

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// avoids choke on 204 (some legacy browsers)
app.use(cors({ optionsSuccessStatus: 200 })); 

// Info for static files, allows CSS to render
app.use(express.static('public'))

// Renders WebPage "index.html"
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Basic Configuration
const port = process.env.PORT || 3000;

// added server to allow http headers
const server = require("http").createServer(app);

//import moment.js library
var moment = require('moment');
//including format to check dates
moment().format();

// Allow parsing of app/json data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

// Setup of File System and Router
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Error handling for router file access 
router.get("/file/*?", function (req, res, next) {
  if (req.params[0] === ".env") {
    return next({ status: 401, message: "ACCESS DENIED" });
  }
  fs.readFile(path.join(__dirname, req.params[0]), function (err, data) {
    if (err) {
      return next(err);
    }
    res.type("txt").send(data.toString());
  });
});

// Install & Set up mongoose
const mongoose = require('mongoose');
// Database connect string
const mongoUri = process.env.MONGO_URI;
// Variable to advise successful connection
const mongoSuccess = "MongoDB connected successfully";

// Connect to Mongoose
mongoose.connect(
  mongoUri, 
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(mongoSuccess);
    }
  }
);

// import user model
const User = require("./myApp.js").UserModel;

// new API endpoint for creating new user
app.post('/api/users', function(req, res) {
const username = req.body.username;
let newUser = new User({username: username});
newUser.save(function(err, user) {
  if (err) res.send("New user not added, please try again. Be sure to include a username.");
  res.send({username: user.username, _id:        user._id});
  });
});

// new API endpoint to return all saved users
app.get('/api/users', function(req, res) {
User.find({})
  .select('username _id')
  .exec(function(err, users) {
    if (err) res.send("No users found");
    res.send(users);
  }); 
});    

// new API endpoint to Add Exercises to Log
app.post('/api/users/:_id/exercises', function(req, res) {
  const id = req.params._id;
  User.findById(id, function(err, user) {
    if (err) res.send("Invalid ID");
    const description = req.body.description;
    const duration = req.body.duration && 
      !Number.isNaN(Number(req.body.duration)) ? 
      Number(req.body.duration) : 
      res.send(`Enter valid input for 'duration'. 
      This should be a number. For example for a 30 minute 
      exercise, please input 30.`
    );
    
    // if no input for date, use today
    const date = !req.body.date ? new Date().toDateString() : req.body.date ? new Date(req.body.date).toDateString() : 
      res.send(`Enter a valid input for 'date'`);
      
    let newExercise = {
      description: description,
      duration: duration,
      date: date
    };
    
    user.log.push(newExercise);
    user.save((err, data) => {
    if (err) res.send("New exercise not added, please try again.");
    res.send({username: user.username, description: description, 
      duration: duration, date: date, _id: id});
    });
  });
});

// listener that alerts when app is connected
// updated from app.listen to server.listen
const listener = server.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})