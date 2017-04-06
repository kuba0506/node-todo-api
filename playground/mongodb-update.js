// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.error(`Unable to connect to MongoDB Server`);
    }
    console.log(`Connected to MongoDB Server`);

    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({ completed: false }, {
    //     $set: {
    //         completed: true
    //     }

    // }, {
    //         returnOriginal: false
    //     })
    //     .then(res => console.log(res))

        db.collection('Users').findOneAndUpdate( { _id: new ObjectID("58e4f73783204a218c170f23") }, {
        $set: {
            name: 'Kuba'
        },
        $inc: { age: -100 }
    }, {
            returnOriginal: false
        })
        .then(res => console.log(res))

    // db.close();
});