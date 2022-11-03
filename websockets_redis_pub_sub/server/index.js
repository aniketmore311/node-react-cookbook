//@ts-check
require('dotenv').config()

const redis = require('redis')
const http = require('http')
const { WebSocketServer } = require('ws')

async function setupWebsocketsOverRedis(server, REDIS_URI) {
  const client = redis.createClient({
    url: REDIS_URI
  })
  const publisher = redis.createClient({
    url: REDIS_URI
  })
  await client.connect()
  await publisher.connect()
  const subscriber = client.duplicate()
  await subscriber.connect()

  console.info("connected to redis")

  const wss = new WebSocketServer({ server: server })

  // when a message is received from redis publish it to all connected clients
  subscriber.subscribe("new_message", (payloadStr) => {
    console.log("--- received ---")
    console.log("source: redis, type: new_message")
    console.log("payload: ")
    console.log(payloadStr)
    let wsEvent = {
      type: "new_message",
      payload: JSON.parse(payloadStr)
    }
    wss.clients.forEach(ws => {
      ws.send(JSON.stringify(wsEvent), (err) => {
        console.log("--- sent ---")
        console.log("destination: websocket, type: new_message")
        console.log("payload: ")
        console.log(wsEvent.payload)
      })
    })
  })

  // when message is received from websocket publish it to redis
  wss.addListener("connection", (ws) => {
    console.log('new connection added')
    ws.addEventListener('message', (event) => {
      let eventObj = JSON.parse(event.data.toString())
      //@ts-ignore
      switch (eventObj.type) {
        case "new_message":
          console.log("--- received ---")
          console.log("source: websocket, type: new_message")
          console.log("payload: ")
          //@ts-ignore
          console.log(eventObj.payload)
          //@ts-ignore
          let redisPayload = eventObj.payload
          publisher.publish("new_message", JSON.stringify(redisPayload)).then((res) => {
            console.log("--- sent ---")
            console.log("destination: redis, type: new_message")
            console.log("payload: ")
            console.log(redisPayload)
          })
          break;

        default:
          break;
      }
    })
  })

}

async function main() {

  const NODE_ENV = process.env.NODE_ENV || "development";
  const PORT = process.env.PORT || "8080";
  const REDIS_URI = process.env.REDIS_URI || "redis://localhost:6379"


  const server = http.createServer()

  await setupWebsocketsOverRedis(server, REDIS_URI)

  server.listen(PORT, () => {
    console.info(
      `server(mode: ${NODE_ENV}) started on: http://localhost:${PORT}`
    )
    console.debug(`pid: ${process.pid}`)
  })

}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
