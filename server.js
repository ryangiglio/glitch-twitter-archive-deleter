// Config
require('dotenv').config()

// init project
const express = require('express')
const app = express()
const moment = require('moment')

const verifyCredentials = require('./twitter-deleter/verifyCredentials')
const loadTweetArchive = require('./twitter-deleter/loadTweetArchive')

const startDeleter = require('./twitter-deleter')

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// Serve the instructions page
app.get('/', (req, res) => {
  if (process.env.INTRO_MODE) {
    res.sendFile(__dirname + '/views/intro.html')
  } else {
    res.sendFile(__dirname + '/views/app.html')
  }
})

app.get('/intro', (req, res) => {
  res.sendFile(__dirname + '/views/intro.html')
})

app.get('/app', (req, res) => {
  res.sendFile(__dirname + '/views/app.html')
})

app.get('/api/verifyCredentials', async (req, res) => {
  await verifyCredentials()
    .then(account => {
      res.status(200).json({
        message: `Credentials verified for @${account.screen_name}`,
      })
    })
    .catch(err => {
      res.status(400).json({
        error: err.message,
      })
    })
})

app.get('/api/verifyArchive', async (req, res) => {
  await loadTweetArchive()
    .then(tweetsArray => {
      res.status(200).json({
        message: `${tweetsArray.length} Tweets loaded`,
        timeEstimate: moment.duration(tweetsArray.length, 'seconds').humanize(),
      })
    })
    .catch(err => {
      res.status(400).json({
        error: err.message,
      })
    })
})

app.get('/api/go', async (req, res) => {
  startDeleter()

  res.status(200).json({
    message:
      'Deleter started! Check the app console for progress. This could take a while...',
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
