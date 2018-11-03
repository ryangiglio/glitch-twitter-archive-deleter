const goContainerEl = document.getElementById('go-container')
const goButtonEl = document.getElementById('go-button')
const timeEstimateEl = document.getElementById('time-estimate')

let archiveValid = false
let credentialsValid = false

goButtonEl.addEventListener('click', e => {
  fetch('/api/go').then(function(res) {
    // TODO hide the button

    goButtonEl.blur()
  })
})

fetch('/api/verifyArchive')
  .then(res => res.json())
  .then(resJson => {
    const verifyEl = document.getElementById('verify-archive')

    if (resJson.error) {
      verifyEl.innerHTML = `<i class="fas fa-times"></i> ${resJson.error}`
    } else {
      verifyEl.innerHTML = `<i class="fas fa-check"></i> ${resJson.message}.`
      timeEstimateEl.innerHTML = `It will take approximately ${
        resJson.timeEstimate
      } to finish deleting your tweets.`

      archiveValid = true

      showGoIfValid()
    }
  })

fetch('/api/verifyCredentials')
  .then(res => res.json())
  .then(resJson => {
    const verifyEl = document.getElementById('verify-credentials')

    if (resJson.error) {
      verifyEl.innerHTML = `<i class="fas fa-times"></i> ${resJson.error}`
    } else {
      verifyEl.innerHTML = `<i class="fas fa-check"></i> ${resJson.message}`

      credentialsValid = true

      showGoIfValid()
    }
  })

function showGoIfValid() {
  if (archiveValid && credentialsValid) {
    goContainerEl.classList.remove('dn')
  }
}
