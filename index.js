'use strict'; // Avoids undefined variables

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// avoids choke on 204 (some legacy browsers)
app.use(cors({ optionsSuccessStatus: 200 })); 

// Info for static files, allows CSS to render
app.use(express.static('public'));

// Renders WebPage "index.html"
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

//middleware
app.use(express.json());

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
    useFindAndModify: false 
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

// Defines username based on user input
const username = req.body.username;

if (username === '') {
  console.log('No username entered.');
  return res.json({ error: 'You clicked submit without entering a username. Please enter a username and then click submit.' });
}

 User.findOne({ username: username }, function (err, user) {
  if (!err && user === null) {
   console.log('Good choice of username, it is unique! You entered: ' + username);
   let newUser = new User({
    username: username
   });

   newUser.save(function (err, user) {
    if (!err) {
     console.log('User added: ' + user);
     return res.json({
     username: user.username,
     _id: user._id,
     });
    }
   });
  } else {
   console.log('Duplicate username. User not added, please try again with unique username.');
   return res.json({ error: 'Username already exists, please try again.' });
  }
 });
});

// new API endpoint to return all saved users
app.get('/api/users', function (req, res) {
User.find({})
  .select('_id, username')
  .exec(function(err, users) {
  if (!err) {
   console.log('User List Found.');
   res.json(users);
  } else {
  console.log(err);
   return res.json(err);
  } 
});
});
  
console.debugger;
  
  
 /* 
  // Defines username based on user input
const username = req.body.username;
let newUser = new User({username: username});
newUser.save(function(err, user) {
  if (err){
    console.log("Error adding user: " + err);
    res.send("New user not added, please try again. Be sure to include a username.");
  } 
  else{
    //Print saved user to console
    console.log("User added: " + user);
    //Return json info
    res.json({ _id: user._id, username: user.username });
  }
},
)
});



 // new API endpoint to return added user
app.get('/api/users?', function(req, res) {
  const id = req.params._id;
  User.findById(id, function(err, user) {
    if (err) res.send("Invalid ID");
    res.send(user);
    res.json(user);
  }); 
});
*/
/* User.findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name); */
/*
// new API endpoint to return all saved users
app.get('/api/users', function(req, res) {
User.find({})
  .select('_id, username')
  .exec(function(err, users) {
    if (err) res.send("No users found");
    res.send(users);
  }); 
});    */

// new API endpoint to Add Exercises to Log

app.post('/api/users/:_id/exercises', function(req, res){
  const id = req.params._id;
  const request = req.body;
  const description = request.description;
    const duration = request.duration && !Number.isNaN(Number(request.duration)) ? Number(request.duration) : res.send(`Enter valid input for 'duration'. This should be a number. For example for a 30 minute exercise, please input 30.`);
    
    // if no input for date, use today
    const date = !request.date ? new Date() : request.date ? new Date(request.date) : 
      res.send(`Enter a valid input for 'date'.`);

    let dateString = date.toString();
      
    let newExercise = {
      description: description,
      duration: duration,
      date: dateString
    };
    

User.findByIdAndUpdate(id, {log:[ newExercise]}, {new: true}, (err, user) => {
    if (err) res.send("New exercise not added, please try again.");
    console.log(user) 
    res.json({username: user.username, description: user.description, duration: user.duration, date: user.date, _id: id});
    });
   
});

app.get('/api/users/:_id/exercises', function (req, res) {
const id = req.params._id;
 res.redirect('/api/users/' + id + '/logs');
});

app.get('/api/users/:_id/logs/:from?/:to?/:limit?', function (req, res) {
 let id = req.params._id;
  console.log(id);
 let dateFrom = req.query.from;
 let dateTo = req.query.to;
 let limit = (req.query.limit !== undefined ? parseInt(req.query.limit) : 0);
 let query;

 if (typeof dateFrom != 'undefined' && typeof dateTo != 'undefined' && typeof id != 'undefined' && typeof limit != 'undefined') query = { date: { $gte: dateFrom, $lte: dateTo }, _id: id, limit: limit };
 if (typeof dateFrom != 'undefined' && typeof dateTo == 'undefined' && typeof id != 'undefined' && limit != 'undefined') query = { date: { $gte: dateFrom }, _id: id, limit: limit };
 if (typeof dateFrom == 'undefined' && typeof dateTo != 'undefined' && typeof id != 'undefined' && limit != 'undefined') query = { date: { $lte: dateTo },  _id: id, limit: limit };
 if (typeof dateFrom != 'undefined' && typeof dateTo == 'undefined' && typeof id != 'undefined' && limit == 'undefined') query = { date: { $gte: dateFrom }, _id: id };
 if (typeof dateFrom == 'undefined' && typeof dateTo != 'undefined' && typeof id != 'undefined' && limit == 'undefined') query = { date: { $lte: dateTo }, _id: id };
 if (typeof dateFrom == 'undefined' && typeof dateTo == 'undefined' && typeof id != 'undefined' && limit != 'undefined') query = { _id: id, limit: limit };
 if (typeof dateFrom == 'undefined' && typeof dateTo == 'undefined' && typeof id != 'undefined' && limit == 'undefined') query = { _id: id };

 if ((dateFrom !== undefined && dateFrom !== '') &&
  (dateTo !== undefined && dateTo !== '')
 ) {
 let fromDateString = query.date.$gte = new Date(dateFrom).toDateString();
 /* checkDate with moment */
  if (fromDateString == 'Invalid Date') {
   return res.json({ error: 'From date was not entered in YYYY-MM-DD format, please try again.' });
  }

 let toDateString = query.date.$lte = new Date(dateTo).toDateString();

/* checkDate with moment */
  if (toDateString == 'Invalid Date') {
   return res.json({ error: 'To date was not entered in YYYY-MM-DD format, please try again.' });
  }
 }

 /*if (isNaN(limit)) {
  return res.json({ error: 'limit is not a number' });
 }*/

const exerciseLog = 
   User.find(query).exec(function (err, user) {
    if (!err && user !== null) {
     return res.json({
      _id: user._id,
      username: user.username,
      log: {
    description: user.description,
        duration: user.duration,
        date: user.date
       },
      count: user.length
     });
    }

 
 if (!exerciseLog) return res.status(404).send('The exercise log with the given ID was not found.');

 res.send(exerciseLog);
});
});
      

/* app.get('/api/users/:_id/logs', function (req, res) {
 let id = req.params._id;
 console.log(id);
 let queryParameters = { _id: id };
 let fromDate = req.query.from;
 let toDate = req.query.to;

 if ((fromDate !== undefined && fromDate !== '') &&
  (toDate !== undefined && toDate !== '')
 ) {
  queryParameters.date = {};

 let fromDateString = queryParameters.date.$gte;
   fromDateString = new Date(fromDate).toDateString();
  
 /* checkDate with moment */

/*  if (fromDateString == 'Invalid Date') {
   return res.json({ error: 'From date was not entered in  YYYY-MM-DD format, please try again.' });
  }

 let toDateString = queryParameters.date.$lte;
   toDateString = new Date(toDate).toDateString();

/* checkDate with moment */
 

/*  if (toDateString == 'Invalid Date') {
   return res.json({ error: 'To date was not entered in YYYY-MM-DD format, please try again.' });
  }
 }

 let limit = (req.query.limit !== undefined ? parseInt(req.query.limit) : 0);

 if (isNaN(limit)) {
  return res.json({ error: 'limit is not a number' });
 }

 User.findById(id, function (err, user) {
  if (!err && user !== null) {
   User.find(queryParameters).sort({ date: 'asc' }).limit(limit).exec(function (newErr, foundUser) {
    if (!newErr && foundUser !== null) {
     return res.json({
      _id: user['_id'],
      username: user['username'],
      log: foundUser.map(function (e) {
       return {
        description: e.description,
        duration: e.duration,
        date: e.date
       };
      }),
      count: foundUser.length
     });
    }
   });
  } else {
   return res.json({ error: err });
  }
 });
}); */


// listener that alerts when app is connected
// updated from app.listen to server.listen
const listener = server.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});