// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.error(`Unable to connect to MongoDB Server`);
    }
    console.log(`Connected to MongoDB Server`);


    db.collection('Users').find({ name: 'Asia' }).count()
        .then((count) => {
            console.log(`Todos count: ${count}`);
            //  console.log(`Users \n ${JSON.stringify(count, null, 4)}`);
        })
        .catch((err) => {
            if (err) {
                return console.error(`Unable to count todos ${err}`);
            }
        });

    // db.collection('Todos').find().count()
    // // db.collection('Todos').find({ _id: new ObjectID("58e4f5bc7cbfeb39b8fe208e") }).count()
    //     .then((count) => {
    //         console.log(`Todos count: ${count}`);
    //     })
    //     .catch((err) => {
    //         if (err) {
    //             return console.error(`Unable to count todos ${err}`);
    //         }
    //     });

    // db.collection('Todos').find({ _id: new ObjectID("58e4f5bc7cbfeb39b8fe208e") }).toArray()
    //     .then((docs) => {
    //         console.log(`Todos \n ${JSON.stringify(docs, null, 4)}`);
    //     })
    //     .catch((err) => {
    //         if (err) {
    //             return console.error(`Unable to fetch todos ${err}`);
    //         }
    //     });

    db.close();
});


