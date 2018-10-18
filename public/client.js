const goButton = document.getElementById('js-go-button')

goButton.addEventListener('click', (e) => {
  fetch('/go')
    .then(res => {
      console.log(res)
    })
})
