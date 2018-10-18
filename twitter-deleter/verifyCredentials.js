const twitterClient = require('./twitterClient')

module.exports = async function () {
  // Verify that the keys are valid
  console.log('Verifying Twitter credentials...')

  return twitterClient.get(`account/verify_credentials`, {})
    .then(account => {
      console.log(`Credentials verified for @${account.screen_name}`)

      return Promise.resolve()
    })
    .catch(err => {
      if (err[0].code === 32) {
        throw new Error('Could not authenticate you')
      } else if (err[0].code === 89) {
        throw new Error('Invalid or expired token.')
      } else if (err[0].code === 215) {
        throw new Error('Bad Authentication data.')
      } else {
        throw new Error('Unhandled error')
      }
    })
}
