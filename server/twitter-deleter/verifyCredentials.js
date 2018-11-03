const twitterClient = require('./twitterClient')

module.exports = async function() {
  // Verify that the keys are valid
  console.log('Verifying Twitter credentials...')

  return twitterClient
    .get(`account/verify_credentials`, {})
    .then(account => {
      console.log(`Credentials verified for @${account.screen_name}`)

      return Promise.resolve(account)
    })
    .catch(err => {
      if (Array.isArray(err)) {
        if (err[0].code === 32) {
          throw new Error('Could not authenticate you')
        } else if (err[0].code === 89) {
          throw new Error(
            'The Twitter credentials provided in your .env are either invalid or expired'
          )
        } else if (err[0].code === 215) {
          throw new Error('Bad Authentication data')
        }
      }

      throw new Error(
        `${err.syscall} ${err.code} ${err.host} ${err.hostname}:${err.port}`
      )

      throw new Error('Unhandled error')
    })
}
