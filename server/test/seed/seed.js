const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { TodoModel } = require('./../../model/todo-model');
const { UserModel } = require('./../../model/user-model');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    //user with valid token
    _id: userOneId,
    email: 'kuba@mail.com',
    password: 'password123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    //user without token
    _id: userTwoId,
    email: 'wrongUser@mail.com',
    password: 'password123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [
    { _id: new ObjectID(), 
        text: 'First test todo', 
        completed: false,
        _creator: userOneId
     },
    { _id: new ObjectID(), 
        text: 'Second test todo',
        completed: true,
        completedAt: 1231231,
        _creator: userTwoId
     }
];

const populateTodos = done => {
    TodoModel.remove({})  //wipe db
        .then(() => {
            return TodoModel.insertMany(todos);
        })
        .then(() => done());
};

const populateUsers = done => {
    UserModel.remove({})
        .then(() => {
            var userOne = new UserModel(users[0]).save();
            var userTwo = new UserModel(users[1]).save();

            return Promise.all([userOne, userTwo])
                .then(() => {
                    done();
                });
        })
};

module.exports = { todos, users, populateTodos, populateUsers };