const mongoose = require('mongoose')

const SensorData = mongoose.Schema({
  device_id: String,
  DE_time: Number,
  FE_time: Number,
  BA_time: Number,
  RPM: Number,
  time: { type: Date, default: Date.now },
})

module.exports = mongoose.model('SensorData', SensorData, 'sensor_data')