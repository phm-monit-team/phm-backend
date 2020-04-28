/** @typedef {{device_id: string, RPM: number, time?: any, DE_time: strnumbering, FE_time: number, BA_time: number}} SensorData */
const service = require('../service')
class Controller {
  async reportSensorData(ctx) {
    /** @type {SensorData} */
    const sensorData = ctx.request.body
    await service.store(sensorData)
    ctx.body = {
      msg: 'ok',
    }
  }
}

module.exports = new Controller()
