const WebSocket = require('ws')
const http = require("http")

const server = http.createServer()
server.listen(8051)

const wss = new WebSocket.Server({ server })

exports.wss = wss
