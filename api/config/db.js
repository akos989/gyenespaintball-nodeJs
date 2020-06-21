const mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.DB_USER + ':'+ process.env.DB_PWT +
                  '@'+process.env.HOST+'/admin?authSource=admin&w=1', 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
mongoose.Promise = global.Promise;

module.exports = mongoose;
