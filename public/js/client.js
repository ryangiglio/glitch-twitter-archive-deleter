const goButton = document.getElementById('go-button')

goButton.addEventListener('click', e => {
  fetch('/api/go').then(function(res) {
    console.log(res)
  })
})

fetch('/api/verifyArchive')
  .then(res => res.json())
  .then(resJson => {
    const verifyEl = document.getElementById('verify-archive')

    if (resJson.error) {
      verifyEl.innerHTML = `
      <i class="fas fa-times"></i> ${resJson.error}
    `
    } else {
      verifyEl.innerHTML = `
      <i class="fas fa-check"></i> ${resJson.message}
    `
    }
  })

fetch('/api/verifyCredentials')
  .then(res => res.json())
  .then(resJson => {
    const verifyEl = document.getElementById('verify-credentials')

    if (resJson.error) {
      verifyEl.innerHTML = `
      <i class="fas fa-times"></i> ${resJson.error}
    `
    } else {
      verifyEl.innerHTML = `
      <i class="fas fa-check"></i> ${resJson.message}
    `
    }
  })
