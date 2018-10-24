const twitterClient = require('./twitterClient')
const localStorage = require('./localStorage')

const THROTTLE_INTERVAL_SPEED = 1000

let queuedAction = null
let processInterval

async function processTweet(tweet) {
  console.log('processing tweet')
  return new Promise((resolve, reject) => {
    console.log(`Deleting tweet ${tweet.tweet_id}\n${tweet.text}`)

    return twitterClient.get(
      `statuses/show/${tweet.tweet_id}`,
      (err, returnedTweet, response) => {
        if (err) {
          throw new Error(err)
        } else {
          console.log('tweet processed but not deleted phew')

          return resolve(returnedTweet)
        }
      }
    )

    /*
    return twitterClient.post(
      `statuses/destroy/${tweet.tweet_id}`,
      async (err, returnedTweet, response) => {
        if (err) {
          const errCode = err[0].code

          switch (errCode) {
            case 34:
              // No status found with that ID
              // Corresponds with HTTP 404. The requested Tweet ID is not found (if it existed, it was probably deleted)
              console.log(`
                Tweet not found
                You may have already deleted it
              `)

              await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

              break

            case 88:
              // Rate limit exceeded
              // The request limit for this resource has been reached for the current rate limit window.
              // TODO: Throttle requests so it automatically resumes
              throw new Error('Twitter API rate limit exceeded')

              break

            case 144:
              // No status found with that ID
              // Corresponds with HTTP 404. The requested Tweet ID is not found (if it existed, it was probably deleted)
              console.log(`
                Tweet not found
                You may have already deleted it
              `)

              await localStorage.setItem('lastTweetDeleted', tweet.tweet_id)

              break

            case 179:
              // Sorry, you are not authorized to see this status
              // Corresponds with HTTP 403. Thrown when a Tweet cannot be viewed by the authenticating user, usually due to the Tweet’s author having protected their Tweets.
              console.log(`
                You are not authorized to see this status
                You may have retweeted a user who is now protected or who has blocked you.
              `)

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
    */
  })
}

async function recursivelyProcessTweets(tweetsArray, index) {
  processTweet(tweetsArray[index])
    .then(deletedTweet => {
      if (index + 1 < tweetsArray.length) {
        console.log(`
          ================================================================================
          Processing tweet ${index}/${tweetsArray.length} in your archive
        `)

        queuedAction = () => recursivelyProcessTweets(tweetsArray, index + 1)
      } else {
        console.log(`
          ================================================================================
          DONE!!
        `)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}

module.exports = async function(tweetsArray, startingIndex = 0) {
  console.log(`
    ================================================================================
    HERE WE GO
    ================================================================================
  `)

  // Use a 1s interval to throttle calls to 1 per second
  processInterval = setInterval(() => {
    console.log('interval running')

    if (queuedAction) {
      queuedAction.call()
      queuedAction = null
    }
  }, THROTTLE_INTERVAL_SPEED)

  queuedAction = () => recursivelyProcessTweets(tweetsArray, startingIndex)
}
