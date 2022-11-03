let clientname = prompt("enter client name")
let wsURL = prompt("enter websocket url")

let messages = [
]
renderMessages()

let ws = new WebSocket(wsURL)

ws.addEventListener("open", () => {
    console.log(`connection established with: ${wsURL}`)
})

ws.addEventListener("message", (event) => {
    eventObj = JSON.parse(event.data.toString())
    switch (eventObj.type) {
        case "new_message":
            let payload = eventObj.payload
            console.log("new_message event sent with payload")
            console.log(payload)
            messages.push(payload)
            renderMessages()
            break;
        default:
            break;
    }
})



function renderMessages() {

    let listElement = document.querySelector(
        ".message_list"
    )
    let html = ""

    messages.forEach(message => {
        html += `
        <div>
            <p>${message.from}: ${message.message}</p>
            <p>------</p>
        </div>
        `
    })

    listElement.innerHTML = html
}

renderMessages()

function sendMessage() {
    let msgStr = document.getElementById("message").value
    let event = {
        type: "new_message",
        payload: {
            from: clientname,
            message: msgStr
        }
    }
    let eventStr = JSON.stringify(
        event
    )
    console.log("new_message event sent with payload")
    console.log(event.payload)
    ws.send(
        eventStr
    )
}