var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useUnifiedTopology: true, useNewUrlParser: true  });

module.exports = mongoose.connection
