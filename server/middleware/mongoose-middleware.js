const { UserSchema }  = require('../model/user-model');

//moongose middleware - set event handler before saving user
UserSchema.pre('save', function (next) {
    var user = this;

    //check if password was modified
    if (user.isModified('password')) {
        console.log(user);
        //user.password

        //user.passwored = hash;
        next();
    } else {
        next();
    }
});