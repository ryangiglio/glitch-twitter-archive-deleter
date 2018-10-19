// Config
require('dotenv').config()

// Node
const fs = require('fs')
const { findIndex } = require('lodash')

// Functions
const reverseTweetStream = require('./reverseTweetStream')
const processTweets = require('./processTweets')
const verifyCredentials = require('./verifyCredentials')
const loadTweetArchive = require('./loadTweetArchive')

const localStorage = require('./localStorage')

module.exports = async function() {
  await verifyCredentials()
    .then(loadTweetArchive)
    .then(async tweetsArray => {
      // Get the last tweet deleted from localstorage
      // NOTE: This will be `undefined` if this is the first run
      const lastTweetDeleted = await localStorage.getItem('lastTweetDeleted')

      let startingIndex = 0

      if (lastTweetDeleted) {
        const lastDeletedIndex = findIndex(
          tweetsArray,
          ({ tweet_id }) => tweet_id === lastTweetDeleted
        )

        console.log('Previous session found – last tweet deleted')
        console.log(tweetsArray[lastDeletedIndex])

        startingIndex = lastDeletedIndex + 1
      }

      // Kick it off
      // processTweets(tweetsArray, startingIndex)
    })
    .catch(err => {
      console.log(err)
    })
}
