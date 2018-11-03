const storage = require('node-persist')

// Set up node-persist storage
storage.init({
  dir: './.persist',
})

module.exports = storage
