const fs = require('fs')
const csv = require('fast-csv')
const localStorage = require('../localStorage')

module.exports = async () => {
  // Return a promise for when the whole processing is finished
  return new Promise(async (funcResolve, funcReject) => {
    const stream = fs.createReadStream('./tweets.csv')

    stream.on('error', err => {
      funcReject(new Error('Could not load file `./tweets.csv`'))
    })

    // Use a promise to wait for processing of the CSV to complete
    await new Promise((resolve, reject) => {
      const tweetsArray = []

      const parser = csv
        .fromStream(stream, { headers: true })
        .on('data', data => {
          tweetsArray.unshift(data)
        })
        .on('end', data => {
          resolve(tweetsArray)
        })
        .on('error', err => {
          throw new Error(err)
        })
    })
      .then(async tweetsArray => {
        console.log(`${tweetsArray.length} Tweets loaded`)
        await localStorage.setItem('tweetCount', tweetsArray.length)

        return funcResolve(tweetsArray)
      })
      .catch(err => {
        funcReject(new Error(err))
      })
  })
}
