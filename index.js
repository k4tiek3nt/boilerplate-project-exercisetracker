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
/* (placeholder) update here with api code.  
Researching how to add additional files to handle mongo schema and model and different api calls */
  });

// listener that alerts when app is connected
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})