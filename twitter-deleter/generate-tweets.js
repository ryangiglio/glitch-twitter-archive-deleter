const randomstring = require('randomstring')

const Twitter = require('twitter')
const twitterClient = new Twitter({
  // TODO: Load these in a configurable and secret way
  consumer_key: '3YE0Idbb1RsI1GlVqbZb9LCdd',
  consumer_secret: 'cLO0e5iFRRStq71QZ1alRtuTIdvXQ3m2KWCA0MAQzxKXMxqbwT',
  access_token_key: '932024611948126208-4HrrxwE3Uh2FPi0tYFE6MGqMnTQi9ox',
  access_token_secret: '3Bjr4ygB5uEQyxnkg8QofcLy2G8wddZkTtCRKijtUIp39',
})

const generateTweet = () => {
  twitterClient
    .post(`statuses/update`, {
      status: randomstring.generate(Math.ceil(Math.random() * 100)),
    })
    .then(tweet => {
      console.log(tweet)

      setTimeout(() => {
        generateTweet()
      }, Math.ceil(Math.random() * 10000))
    })
    .catch(err => {
      console.log(err)
    })
}

generateTweet()
