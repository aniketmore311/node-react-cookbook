const information = document.getElementById('info')
const ping = document.getElementById('ping')
const square = document.getElementById('square')

information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

versions.ping().then((resp) => {
    ping.innerText = "received resp: " + resp
})

versions.square(11).then(resp => {
    square.innerText = "received square of 11: " + resp
})
