// phase constants
var NOT_STARTED = 0
var RUNNING = 1
var PAUSED = 2
var FINISHED = 3

// Elements for showing/hiding
var loadingContainerEl = document.getElementById('loading-container')

var configContainerEl = document.getElementById('config-container')
var verifyArchiveEl = document.getElementById('verify-archive')
var verifyCredentialsEl = document.getElementById('verify-credentials')

var readyContainerEl = document.getElementById('ready-container')
var firstRunContainerEl = document.getElementById('first-run-instructions')
var firstRunEstimateEl = document.getElementById('first-run-estimate')
var resumeContainerEl = document.getElementById('resume-instructions')
var resumeEstimateEl = document.getElementById('resume-estimate')

var goContainerEl = document.getElementById('go-container')
var goButtonEl = document.getElementById('go-button')

var runningContainerEl = document.getElementById('running-container')
var finishedContainerEl = document.getElementById('finished-container')

// Init some global state
var archiveValid = false
var credentialsValid = false
var appState = NOT_STARTED
var appStatus = null

fetch('/api/getStatus')
  .then(res => res.json())
  .then(resJson => {
    appStatus = resJson

    // Hide the status loading
    loadingContainerEl.classList.add('dn')

    // If it's finished we don't need to validate the config
    if (resJson.deleteFinished) {
      return Promise.resolve()
    } else {
      // Show the config loading
      configContainerEl.classList.remove('dn')

      // Verify the credentials and archive
      return Promise.all([verifyArchive(), verifyCredentials()])
    }
  })
  .then(() => {
    // If it's finished
    if (appStatus.deleteFinished) {
      appState = FINISHED

      dropConfetti()
      finishedContainerEl.classList.remove('dn')
    } else {
      // If it's actively running right now
      if (appStatus.deleteRunning) {
        appState = RUNNING
        dropConfetti()
        runningContainerEl.classList.remove('dn')
      } else {
        // If the credentials are valid
        if (archiveValid && credentialsValid) {
          readyContainerEl.classList.remove('dn')

          // If a delete has been started previously
          if (appStatus.deleteStarted && !appStatus.deleteFinished) {
            appState = PAUSED

            resumeEstimateEl.innerHTML = `${appStatus.lastTweetDeletedIndex +
              1} tweets were successfully deleted. It'll take approximately ${moment
              .duration(
                appStatus.tweetCount - (appStatus.lastTweetDeletedIndex + 1),
                'seconds'
              )
              .humanize()} to delete your ${appStatus.tweetCount -
              (appStatus.lastTweetDeletedIndex + 1)} remaining tweets.`

            resumeContainerEl.classList.remove('dn')
          } else {
            appState = NOT_STARTED

            firstRunEstimateEl.innerHTML = `It will take approximately ${moment
              .duration(appStatus.tweetCount, 'seconds')
              .humanize()} to delete your ${appStatus.tweetCount} tweets.`

            firstRunContainerEl.classList.remove('dn')
          }

          goButtonEl.addEventListener('click', e => {
            fetch('/api/go').then(function(res) {
              dropConfetti()
              goContainerEl.remove()
              runningContainerEl.classList.remove('dn')
            })
          })
        }
      }
    }
  })

function verifyArchive() {
  return fetch('/api/verifyArchive')
    .then(res => res.json())
    .then(resJson => {
      if (resJson.error) {
        verifyArchiveEl.innerHTML = `<i class="fas fa-times failure"></i> ${
          resJson.error
        }`
      } else {
        verifyArchiveEl.innerHTML = `<i class="fas fa-check success"></i> ${
          resJson.message
        }.`

        archiveValid = true
      }

      return Promise.resolve()
    })
}

function verifyCredentials() {
  return fetch('/api/verifyCredentials')
    .then(res => res.json())
    .then(resJson => {
      if (resJson.error) {
        verifyCredentialsEl.innerHTML = `<i class="fas fa-times failure""></i> ${
          resJson.error
        }.`
      } else {
        verifyCredentialsEl.innerHTML = `<i class="fas fa-check success"></i> ${
          resJson.message
        }.`

        credentialsValid = true
      }

      return Promise.resolve()
    })
}

function dropConfetti() {
  var confetti = new ConfettiGenerator({
    target: 'confetti-container',
    max: '250',
    size: '1',
    animate: true,
    props: ['circle', 'square', 'triangle', 'line'],
    colors: [
      [131, 205, 247],
      [150, 163, 248],
      [188, 152, 249],
      [236, 153, 249],
      [249, 154, 214],
      [249, 155, 168],
      [248, 176, 135],
      [247, 230, 119],
      [202, 247, 125],
      [155, 248, 140],
      [142, 248, 181],
      [141, 248, 234],
    ],
    clock: '25',
    rotate: true,
  })

  confetti.render()
}
