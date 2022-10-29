let clientname = prompt("enter client name")
let wsURL = prompt("enter websocket url")

let ws = new WebSocket(wsURL)

ws.addEventListener("open", () => {
    console.log("connection established")
})

ws.addEventListener("message", (event) => {
    console.log("message received")
    console.log(event.data)
    let msg = JSON.parse(event.data)
    messages.push(msg.payload)
    renderMessages()
})


let messages = [
]

function renderMessages() {

    let listElement = document.querySelector(
        ".message_list"
    )
    let html = ""

    messages.forEach(message => {
        html += `
        <div>
            <p>${message.sender}: ${message.message}</p>
            <p>------</p>
        </div>
        `
    })

    listElement.innerHTML = html
}

renderMessages()

function sendMessage() {
    let msgStr = document.getElementById("message").value
    let msg = JSON.stringify(
        {
            event: "new_message", payload: {
                sender: clientname,
                message: msgStr
            }
        }
    )
    console.log("message sent")
    console.log(msgStr)
    ws.send(
        msg
    )
}