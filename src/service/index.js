const axios = require('axios').default
const debug = require('debug')
const { wss } = require('../wss')
const SensorData = require('../model/sensorData')
const ErrorLog = require('../model/errorLog')

const SKIP_SIZE = 100
const WINDOW_SIZE = 1000
const PREDICT_URL = 'http://buptyl.xyz'
const ERROR_TYPE = {
  NORMAL: 'normal',
  BALL: 'ball',
  OUTER_RACE: 'outer race',
  INNER_RACE: 'inner race'
}

/** @typedef {{device_id: string, RPM: number, time?: any, DE_time: strnumbering, FE_time: number, BA_time: number}} SensorData */
class Service {
  windowPointer = {}
  /**
   * 根据一个数据序列预测故障情况
   * @param {string} device_id 设备id
   */
  async predict(device_id) {
    /** @type {SensorData[]} */
    const dataset = await this.getDataset(device_id, WINDOW_SIZE)
    const format = {
      DE_time: [],
      FE_time: [],
      BA_time: [],
    }
    dataset.forEach((i) => {
      format.DE_time.push(i.DE_time)
      format.FE_time.push(i.FE_time)
      format.BA_time.push(i.BA_time)
    })
    const predictResult = await axios
      .post(
        PREDICT_URL,
        {
          id: device_id,
          data: format,
        },
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      .then((res) => res.data)
      debug("predict")(`${device_id} predict result`, predictResult)
    predictResult.type === ERROR_TYPE.NORMAL &&
      this.send({
        errorStatus: {
          device_id,
          error: predictResult.type,
        },
      })
    await this.storeErrorLog(device_id, predictResult.type)
    this.windowPointer[device_id] = 0
    return predictResult.type
  }
  /**
   * 将单条设备存入数据库
   * @param {SensorData} result
   */
  async store(result) {
    const data = new SensorData(result)
    const device_id = result.device_id
    debug("report")(`${device_id} receive data`, data)
    this.send({
      dataPoint: data,
    })
    await data.save()
    if (this.windowPointer[device_id] === undefined) {
      const currentDeviceCount = await this.getCount(device_id)
      this.windowPointer[device_id] =
        currentDeviceCount >= WINDOW_SIZE
          ? SKIP_SIZE
          : currentDeviceCount - WINDOW_SIZE + SKIP_SIZE - 1
    }
    this.windowPointer[device_id]++
    if (this.windowPointer[device_id] >= SKIP_SIZE) {
      debug("predict")(`${device_id} start predict`)
      this.predict(device_id)
    }
    return
  }

  /**
   * 获取设备数据点
   * @param {string} device_id 设备id
   * @param {number} count limit
   */
  async getDataset(device_id, count) {
    return await SensorData.find({ device_id })
      .sort({ time: 'desc' })
      .limit(count)
  }

  async getCount(device_id) {
    return await SensorData.find({ device_id }).countDocuments()
  }

  /**
   * 将单条数据发送到客户端
   * @param {SensorData} data 数据
   */
  send(data) {
    wss.clients.forEach((i) => i.send(JSON.stringify(data)))
  }

  async getErrorLog(device_id) {
    return await ErrorLog.find({ device_id })
  }

  async storeErrorLog(device_id, error) {
    const log = new ErrorLog({
      device_id,
      error,
    })
    return await log.save()
  }
}

module.exports = new Service()
