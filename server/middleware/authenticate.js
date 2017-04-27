const { UserModel } = require('../model/user-model');

//custom middleware
const authenticate = (req, res, next) => {
    const token = req.header('x-auth'); //grabing a token

    //find in db and check if token is valid
    UserModel.findByToken(token)
        .then(user => {
            if (!user) {
                return Promise.reject('User not found');
            }
            //add props to req object to use them later
            req.user = user;
            req.token = token;
            next();
        })
        .catch(e => res.status(401).send(e));
};

module.exports = {authenticate};