const Mongoose = require('mongoose');
const Validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//method to generate token for specific user
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.JWT_SECRET).toString();

    //add token to user tokens array
    user.tokens.push({
        access, token
    });

    //save db
    return user.save()
        .then(() => token);
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

//model methods are hold in 'statics'
UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject('Wrong token!');
    }

    //find user in db and return promise
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({ email })
        .then(user => {
            if (!user) {
                return Promise.reject('User not found!');
            }
            //wrap bcrypt in Promise (because it utilizes callback)
            return new Promise((resolve, reject) => {
                //compare plainPass with hashedPass
                return bcrypt.compare(password, user.password, (e, result) => {
                    if (e) {
                        return reject(e);
                    }
                    if (!result) {
                        return reject('Passwords do not match!');
                    }
                    return resolve(user);
                });
            });
        });
};

//moongose middleware - set event handler before saving user
UserSchema.pre('save', function (next) {
    var user = this;

    //check if password was modified
    if (user.isModified('password')) {
        // console.log(`Password before hashing: ${user.password}`);
        bcrypt.genSalt(10, (e, salt) => {
            bcrypt.hash(user.password, salt, (e, hash) => {
                user.password = hash;
                // console.log(`Password after hashing: ${user.password}`);
                next();
            });
        });
    } else {
        next();
    }
});

//User model
var UserModel = Mongoose.model('UserModel', UserSchema);

module.exports = { UserSchema, UserModel };