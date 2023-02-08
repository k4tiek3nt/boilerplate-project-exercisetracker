'use strict'; // Avoids undefined variables

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// avoids choke on 204 (some legacy browsers)
app.use(cors({ optionsSuccessStatus: 200 })); 

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})