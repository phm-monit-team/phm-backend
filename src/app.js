const http = require("http")
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const app = new Koa()
const router = require("./router")

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.status} ${ctx.url} - ${ms}ms`)
})

app.use(bodyParser())

app.use(router.routes())


const server = http.createServer(app.callback())

exports.server = server
