// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');

const goButton = document.getElementById('js-go-button')

goButton.addEventListener('click', (e) => {
  fetch('/go')
    .then(res => {
      console.log(res)
    })
})