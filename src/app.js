const http = require("http")
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const app = new Koa()
const router = require("./router")

app.use(bodyParser())

app.use(router.routes())

app.use(ctx => {
  ctx.body = "hlo"
})

const server = http.createServer(app.callback())

exports.server = server
