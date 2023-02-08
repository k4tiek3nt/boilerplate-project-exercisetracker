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

// listener that alerts when app is connected
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})