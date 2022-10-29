require('dotenv').config()
//setup
require('./setup/index')()

const config = require('config')
const redis = require('redis')
const http = require('http')
const { WebSocketServer } = require('ws')

const makeApp = require('./makeApp')
const healthController = require('./controllers/healthController')
const exampleController = require('./controllers/exampleController')
const logger = require('./setup/logger')

//@ts-ignore
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

  logger.info("connected to redis")

  const wss = new WebSocketServer({ server: server })

  // when a message is received from redis publish it to all connected clients
  subscriber.subscribe("new_message", (message) => {
    console.log("message received from redis")
    console.log(message)
    wss.clients.forEach(ws => {
      console.log('message sent to socket')
      console.log(message)
      ws.send(message)
    })
  })

  // when message is received from websocket publish it to redis
  wss.addListener("connection", (ws) => {
    console.log('new connection added')
    ws.addEventListener('message', (msg) => {
      console.log("message received from websocket")
      console.log(msg.data.toString())
      publisher.publish("new_message", msg.data.toString()).then((res) => {
        console.log("message sent to redis")
        console.log(msg.data.toString())
      })
    })
  })

}

async function main() {

  const NODE_ENV = config.get('env.NODE_ENV');
  const PORT = config.get('application.port')
  const REDIS_URI = config.get("redis.uri")


  const app = makeApp({
    controllers: [healthController, exampleController],
  })

  const server = http.createServer(app)

  await setupWebsocketsOverRedis(server, REDIS_URI)

  server.listen(PORT, () => {
    logger.info(
      `server(mode: ${NODE_ENV}) started on: http://localhost:${PORT}`
    )
    logger.debug(`pid: ${process.pid}`)
  })

  function onClose() {
    logger.debug('graceful shutdown started')
    server.close(() => {
      logger.debug('graceful shutdown complete')
      process.exit(1)
    })
  }

  process.on('SIGINT', onClose)
  process.on('SIGTERM', onClose)

  process.on("unhandledRejection", function (err) {
    console.error(err)
    process.exit(1)
  })
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
