// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const twitterDeleter = require('./twitter-deleter')

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// Serve the instructions page
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/verifyConfig', function(request, response) {
  // TODO: Check that everything is set up and ready to go
  // Twitter credentials are correct
  // tweets csv is readable
  response.send('hm')
})

app.get('/go', function(request, response) {
  // TODO: Start running the deleter!
  twitterDeleter()
  response.send()
})

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
