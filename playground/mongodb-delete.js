// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.error(`Unable to connect to MongoDB Server`);
    }
    console.log(`Connected to MongoDB Server`);

    //deleteMany
    // db.collection("Todos").deleteMany({text: 'eat lunch'})
    //     .then((result) => {
    //         console.log(result);
    //     });
    db.collection("Users").deleteMany({name: 'Asia'})
        .then((result) => {
            console.log(result);
        });

    //deleteOne
    // db.collection('Todos').deleteOne({ text: 'eat lunch' })
    //     .then((res) => console.log(res.result))

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false})
    //     .then((res) => console.log(res));

    // db.close();
});