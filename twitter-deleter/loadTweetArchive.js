const fs = require('fs')
const csv = require('fast-csv')

module.exports = async function () {
  const stream = fs.createReadStream('./data/tweets.csv')

  stream.on('error', err => {
    throw new Error('Could not load data/tweets.csv')
  })

  const tweetsArray = await new Promise((resolve, reject) => {
    const tweetsArray = []

    const parser = csv.fromStream(stream, {headers: true})
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
   .then(tweetsArray => {
     console.log(`${tweetsArray.length} Tweets loaded`)

     return Promise.resolve(tweetsArray)
   })
   .catch(err => {
     throw new Error(err)
   })

 return tweetsArray
}
