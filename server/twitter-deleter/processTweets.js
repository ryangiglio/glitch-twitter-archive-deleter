const config = require('config')

const twitterClient = require('./twitterClient')
const localStorage = require('../localStorage')

const THROTTLE_INTERVAL_SPEED = 1000

let queuedAction = null
let processInterval

async function processTweet(tweet) {
  if (config.savedTweets.includes(tweet.tweet_id)) {
    console.log(`!!!! Tweet SAVED ${tweet.tweet_id}\n${tweet.text}`)

    await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

    return Promise.resolve(tweet)
  }

  return new Promise((resolve, reject) => {
    console.log(`Deleting tweet ${tweet.tweet_id}\n${tweet.text}`)

    /*
     * DEBUG TWEETS - gets them instead of deletes them
    return twitterClient.get(
      `statuses/show/${tweet.tweet_id}`,
      async (err, returnedTweet, response) => {
        if (err) {
          throw new Error(err)
        } else {
          console.log('tweet processed but not deleted phew')
          await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

          return resolve(returnedTweet)
        }
      }
    )
    */

    return twitterClient.post(
      `statuses/destroy/${tweet.tweet_id}`,
      async (err, returnedTweet, response) => {
        if (err) {
          const errCode = err[0].code

          switch (errCode) {
            case 34:
              // No status found with that ID
              // Corresponds with HTTP 404. The requested Tweet ID is not found (if it existed, it was probably deleted)
              console.log(`Tweet not found`)
              console.log(`You may have already deleted it`)

              await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

              break

            case 88:
              // Rate limit exceeded
              // The request limit for this resource has been reached for the current rate limit window.
              // TODO: Throttle requests so it automatically resumes
              console.log(`Twitter API rate limit exceeded`)
              console.log(
                `Unsurprisingly, because they don't want you to do it, the rate limit for deleting tweets isn't very well documented.`
              )
              console.log(
                `As far as I understand it doesn't work the same way as the other endpoints, and might be daily instead of hourly.`
              )
              console.log(
                `Your best bet is to wait until tomorrow and try again. The script will pick up where you left off.`
              )
              console.log(`Sorry!`)

              throw new Error('Twitter API rate limit exceeded')

              break

            case 144:
              // No status found with that ID
              // Corresponds with HTTP 404. The requested Tweet ID is not found (if it existed, it was probably deleted)
              console.log(`Tweet not found`)
              console.log(`You may have already deleted it`)

              await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

              break

            case 179:
              // Sorry, you are not authorized to see this status
              // Corresponds with HTTP 403. Thrown when a Tweet cannot be viewed by the authenticating user, usually due to the Tweet’s author having protected their Tweets.
              console.log(`You are not authorized to see this status`)
              console.log(
                `You may have retweeted a user who is now protected or who has blocked you.`
              )

              // We can't do anything with this one, so it may as well be "deleted"
              await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

              break

            default:
              throw new Error(
                `Unhandled Twitter API error response code ${errCode}`
              )

              break
          }

          // If it didn't throw an error, it's okay to keep going
          return resolve(returnedTweet)
        } else {
          if (response.statusCode === 200) {
            console.log('Tweet deleted')

            await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

            // Let's do the next one
            return resolve(returnedTweet)
          } else {
            throw new Error(
              `Unhandled Twitter API response status code ${
                response.statusCode
              }`
            )
          }
        }
      }
    )
  })
}

async function recursivelyProcessTweets(tweetsArray, index) {
  console.log(
    `================================================================================`
  )
  console.log(
    `Processing tweet ${index + 1}/${tweetsArray.length} in your archive`
  )

  processTweet(tweetsArray[index])
    .then(deletedTweet => {
      localStorage.setItem('lastTweetDeletedIndex', index)

      if (index + 1 < tweetsArray.length) {
        queuedAction = () => recursivelyProcessTweets(tweetsArray, index + 1)
      } else {
        console.log(
          `================================================================================`
        )
        console.log(`DONE!!`)

        localStorage.setItem('deleteFinished', true)
      }
    })
    .catch(err => {
      // If there's an error, clear the running flag
      localStorage.setItem('deleteRunning', false)
      localStorage.setItem('lastTweetDeletedIndex', index)

      throw new Error(err)
    })
}

module.exports = async function(tweetsArray, startingIndex = 0) {
  console.log(
    `================================================================================`
  )
  console.log(`HERE WE GO`)
  console.log(
    `================================================================================`
  )

  // Use a 1s interval to throttle calls to 1 per second
  processInterval = setInterval(() => {
    if (queuedAction) {
      queuedAction.call()
      queuedAction = null
    }
  }, THROTTLE_INTERVAL_SPEED)

  queuedAction = () => recursivelyProcessTweets(tweetsArray, startingIndex)

  localStorage.setItem('deleteStarted', true)
  localStorage.setItem('deleteRunning', true)
}
