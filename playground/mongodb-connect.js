// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.error(`Unable to connect to MongoDB Server`);
    }
    console.log(`Connected to MongoDB Server`);

    // db.collection('Todos').insertOne({
    //     text: 'Some text',
    //     completed: false
    // }, (err, data) => {
    //     if (err) {
    //         return console.error(`Unable to insert toto, ${err}`);
    //     }

    //     console.log(JSON.stringify(data.ops, null, 4));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Kuba',
    //     age: 123,
    //     location: 'Warsaw'
    // }, (err, data) => {
    //     if (err) {
    //         return console.error(`Unable to insert user ${err}`);
    //     }
    //     console.log(JSON.stringify(data.ops, null, 4));
    // });

    db.close();
});