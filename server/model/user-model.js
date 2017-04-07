const Mongoose = require('mongoose');

//User model
var UserModel = Mongoose.model('UserModel', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        default: null
    }
});

module.exports.UserModel = UserModel;