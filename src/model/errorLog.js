const mongoose = require('mongoose')

const ErrorLog = mongoose.Schema({
  device_id: String,
  error: String,
  time: { type: Date, default: Date.now },
})

module.exports = mongoose.model('ErrorLog', ErrorLog, 'error_log')
