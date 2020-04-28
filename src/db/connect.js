var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useUnifiedTopology: true, useNewUrlParser: true  });

module.exports = mongoose.connection

// const SensorDataModel = require("../model/sensorData")

// const a = new SensorDataModel({
//   device_id: "128",
//   DE_time: 0,
//   FE_time: 0.2,
//   BA_time: -0.4,
//   RPM: 2700
// })
// a.save().then(console.log, console.log)


// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function(e) {
//   // we're connected!
//   console.log("db started")
// });

// var kittySchema = mongoose.Schema({
//   name: String
// });
// kittySchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

// var Kitten = mongoose.model('Kitten', kittySchema, "hihihi");
// var felyne = new Kitten({
//   name: "mxj"
// });
// Kitten.find({name: "mxj"}).then(console.log);