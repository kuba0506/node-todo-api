const { ObjectID } = require('mongodb');
const { Mongoose } = require('../server/db/mongoose');

const { TodoModel } = require('../server/model/todo-model');
const { UserModel } = require('../server/model/user-model');

// let id = '58ec99b83f48890a683a50a5'; //Todo
// let id = '58e75d8c8a700d21d40b5435'; //User

// if (!ObjectID.isValid(id)) {
//     return console.error('ID is not valid!');
// }

let id =  '58f749b6c5d5c6e8a22f698a';
//Todo.remove({}) - remove all
TodoModel.remove({})
    .then(res => console.log(res.result))
    .catch(e => console.error(e));

//TodoModel.findOneAndRemove - find first doc and remove, returns doc
TodoModel.findOneAndRemove({_id: id})
    .then(todo => console.log(todo));

//TodoModel.findByIdAndRemove - return doc
TodoModel.findByIdAndRemove(id)
    .then(todo => console.log(todo));