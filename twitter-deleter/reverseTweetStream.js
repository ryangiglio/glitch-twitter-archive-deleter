const csv = require('fast-csv')

module.exports = function(stream) {
  return new Promise((resolve, reject) => {
    const tweetsArray = []

    const parser = csv
      .fromStream(stream, { headers: true })
      .on('data', data => {
        tweetsArray.unshift(data)
      })
      .on('end', data => {
        resolve(tweetsArray)
      })
  })
}
