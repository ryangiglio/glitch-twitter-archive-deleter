var readyContainerEl = document.getElementById('ready-container')
var goContainerEl = document.getElementById('go-container')
var goButtonEl = document.getElementById('go-button')
var timeEstimateEl = document.getElementById('time-estimate')
var postGoContainerEl = document.getElementById('post-go-container')

var archiveValid = false
var credentialsValid = false

goButtonEl.addEventListener('click', e => {
  fetch('/api/go').then(function(res) {
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

    goContainerEl.remove()
    postGoContainerEl.classList.remove('dn')
  })
})

fetch('/api/verifyArchive')
  .then(res => res.json())
  .then(resJson => {
    var verifyEl = document.getElementById('verify-archive')

    if (resJson.error) {
      verifyEl.innerHTML = `<i class="fas fa-times failure"></i> ${
        resJson.error
      }`
    } else {
      verifyEl.innerHTML = `<i class="fas fa-check success"></i> ${
        resJson.message
      }.`
      timeEstimateEl.innerHTML = `It will take approximately ${
        resJson.timeEstimate
      } to delete your ${resJson.tweetCount} tweets.`

      archiveValid = true

      showGoIfValid()
    }
  })

fetch('/api/verifyCredentials')
  .then(res => res.json())
  .then(resJson => {
    var verifyEl = document.getElementById('verify-credentials')

    if (resJson.error) {
      verifyEl.innerHTML = `<i class="fas fa-times failure""></i> ${
        resJson.error
      }.`
    } else {
      verifyEl.innerHTML = `<i class="fas fa-check success"></i> ${
        resJson.message
      }.`

      credentialsValid = true

      showGoIfValid()
    }
  })

function showGoIfValid() {
  if (archiveValid && credentialsValid) {
    readyContainerEl.classList.remove('dn')
  }
}
