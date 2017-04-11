const express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
const { Mongoose } = require('./db/mongoose');
const { TodoModel } = require('./model/todo-model');
const { UserModel } = require('./model/user-model');

var app = express(),
    port = 3000;

//ENDPOINTS
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new TodoModel({
        text: req.body.text
    });
    //db save
    todo.save()
        .then(doc => res.send(doc))
        .catch(e => res.status(400).send(e));
});

app.get('/todos', (req, res) => {
    TodoModel.find()
        .then(docs => res.status(200).send({
            data: docs
        }))
        .catch(e => res.status(400).send({
            error: e
        }));
});

// ObjectId("58ec99b83f48890a683a50a6")
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    //check if ID is valid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: {
                id: id,
                msg: `Todo is not valid`
            }
        });
    }

    //query db
    TodoModel.findById(id)
        .then(doc => {
            //check if doc was found
            if (!doc) {
                return res.status(404).send({
                    error: {
                        msg: `Todo ID ${id} was not found`
                    }
                });
            }

            return res.status(200).send({
                data: doc
            });
        })
        .catch(e => res.status(400).send({
            error: {
                msg: `Error in db!`
            }
        }));
});


app.listen(port, () => console.log(`Server is running on port ${port}`));

//es6 syntax
module.exports = { app };

// module.exports.app = app;
// module.exports = {
//     app: app
// };

// module.exports = {
//     app
// };


