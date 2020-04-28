const Router = require("koa-router")
const controller = require("../web")
const router = new Router()

router.post("/api/reportSensorData", controller.reportSensorData)

module.exports = router