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



// listener that alerts when app is connected
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})