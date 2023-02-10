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

/* Global setting for timeouts, handles possible wrong callbacks */
const TIMEOUT = 10000;

// Install & Set up mongoose
const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI; //database connect string

// Connect to Mongoose
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

// Display connection errors
connection.on('error', console.error.bind(console, 'connection error:'));

// Only executes if successfully connected
connection.once('open', function() {
  console.log("MongoDB connected successfully");
  
  //import the User Model
  const User = require("./myApp.js").UserModel;

  //Confirm User Model properly imported
  router.use(function (req, res, next) {
    if (req.method !== "OPTIONS" && User.modelName !== "User") {
      return next({ message: "User Model is not correct" });
    }
    next();
  });

  // create new instance based on model
  router.post("/api/users", function (req, res, next) {
    let u;
    u = new User(req.body);
    res.json(u);
  });

  // create a User
  const createUser = require("./myApp.js").createAndSaveUser;
  router.get("/create-and-save-user", function (req, res, next) {
    // in case of incorrect function use wait timeout then respond
    let t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    createUser(function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      User.findById(data._id, function (err, user) {
        if (err) {
          return next(err);
        }
        res.json(user);
        user.remove();
      });
    });
  });
});

// listener that alerts when app is connected
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})