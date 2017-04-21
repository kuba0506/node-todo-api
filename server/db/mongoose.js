const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise; //set Mongoose to use Promise
Mongoose.connect(process.env.MONGODB_URI);
// Mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

// module.exports.Mongoose = Mongoose;
module.exports = {Mongoose};