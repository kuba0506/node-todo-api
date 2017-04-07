const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise; //set Mongoose to use Promise
Mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports.Mongoose = Mongoose;