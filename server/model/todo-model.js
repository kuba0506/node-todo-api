const Mongoose = require('mongoose');

//define Todo model
var TodoModel = Mongoose.model('TodoModel', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports.TodoModel = TodoModel;