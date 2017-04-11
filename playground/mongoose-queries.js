const { ObjectID } = require('mongodb');
const { Mongoose } = require('../server/db/mongoose');

const { TodoModel } = require('../server/model/todo-model');
const { UserModel } = require('../server/model/user-model');

// let id = '58ec99b83f48890a683a50a5'; //Todo
let id = '58e75d8c8a700d21d40b5435'; //User

if (!ObjectID.isValid(id)) {
    return console.error('ID is not valid!');
}
// //find returns empty object
// TodoModel.find({
//     _id: id
// })
//     .then(docs => {
//         if (Object.keys(docs).length === 0) return console.error('Documents not found!');

//         console.log(`find: \n ${docs}`);
//     })
//     .catch(e => console.error(e));

// //findOne returns document
// TodoModel.findOne({
//     _id: id
// })
//     .then(doc => {
//         if (!doc) return console.error('Document not found!');

//         console.log(`findOne: \n ${doc}`);
//     })
//     .catch(e => console.error(e));

//findById 
// TodoModel.findById(id)
//     .then(doc => {
//         if (!doc) return console.error('Document not found!');

//         console.log(`findbyId: \n ${doc}`);
//     })
//     .catch(e => console.error(e));

//User
// findbyId - query  - user found, user not found
UserModel.findById(id)
    .then(doc => {
        if (!doc) return console.error('User not found');

        console.log(`User: \n ${doc}`)
    })
    .catch(e => console.error(e));