var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/phm-test', { useUnifiedTopology: true, useNewUrlParser: true  });

module.exports = mongoose.connection
