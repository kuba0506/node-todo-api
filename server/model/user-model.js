const Mongoose = require('mongoose');
const Validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: Validator.isEmail //method
        },
        message: '{VALUE} is not a valid email'
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//overwrite toJSON to send only properties we want
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject(); //convert user to an object

    return _.pick(userObject, ['_id', 'email']); //not include password or token array
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
       _id: user._id.toHexString(),
       access 
    }, 'secert123').toString();

    //add token to user tokens array
    user.tokens.push({
        access, token
    });

    //save db
    return user.save()
        .then(() => token)
};

// console.log(UserSchema.methods)

//User model
var UserModel = Mongoose.model('UserModel', UserSchema);

module.exports.UserModel = UserModel;