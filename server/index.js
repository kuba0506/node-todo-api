require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { ObjectID } = require('mongodb');
const { Mongoose } = require('./db/mongoose');
const { TodoModel } = require('./model/todo-model');
const { UserModel } = require('./model/user-model');
const { authenticate } = require('./middleware/authenticate');

var app = express(),
    port = process.env.PORT;

//ENDPOINTS
app.use(bodyParser.json());

//todos
app.post('/todos', authenticate, async (req, res) => {
    try {
        const todo = new TodoModel({
            text: req.body.text,
            _creator: req.user._id
        });
        const doc = await todo.save();

        if (doc) {
            return res.send(doc);
        }
    } catch (e) {
        return res.status(400).send(e);
    }
});

app.get('/todos', authenticate, async (req, res) => {
    try {
        const docs = await TodoModel.find({
            _creator: req.user._id
        });
        if (docs) {
            return res.status(200).send({
                data: docs
            })
        }
    } catch (e) {
        return res.status(400).send({
            error: e
        })
    }
});

// ObjectId("58ec99b83f48890a683a50a6")
app.get('/todos/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;

        //check if ID is valid
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({
                error: {
                    id: id,
                    msg: `Todo is not valid`
                }
            });
        }

        //findOne - prevent to see data by unauthorised user
        const doc = await TodoModel.findOne({
            _id: id,
            _creator: req.user._id
        });

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
    } catch (e) {
        return res.status(400).send({
            error: {
                msg: `Error in db!`
            }
        })
    }
});

//async await
//remove
app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;

        //validate id -> send 404
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({
                error: `Todo ${id} is not valid`
            });
        }

        const todo = await TodoModel.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        //check if todo was found
        if (!todo) {
            // if noc doc -> 404
            return res.status(404).send({
                error: `Todo was not found!`
            });
        }

        return res.status(200).send({
            data: todo
        });
    } catch (e) {
        return res.status(400).send({
            error: `Db error!`
        });
    }
});

//update 
app.patch('/todos/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        let body = _.pick(req.body, ['text', 'completed']); // pick extract only valid props

        //validate id -> send 404
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({
                error: `Todo ${id} is not valid`
            });
        }

        //check if completed
        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = +new Date(); //timestamps
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        const todo = await TodoModel.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, { $set: body }, { new: true });

        if (!todo) {
            return res.status(404).send({ error: `Todo ${id} was not found` });
        }

        return res.status(200).send({ data: todo })
    } catch (e) {
        return res.status(400).send();
    }
});

// POST /users
app.post('/users', async (req, res) => {
    try {
        const userCredentials = _.pick(req.body, ['email', 'password']);
        const user = new UserModel(userCredentials);

        const userData = await user.save();
        const token = await userData.generateAuthToken();

        return res.status(200).header('x-auth', token).send(userData)
    } catch (e) {
        return res.status(400).send(e);
    }
});

// POST /users/login {email, password} - find user in db,compare plain pass with hashed one
app.post('/users/login', async (req, res) => {
    try {
        const userCredentials = _.pick(req.body, ['email', 'password']);
        const user = new UserModel(userCredentials);

        const userData = await UserModel.findByCredentials(userCredentials.email, userCredentials.password);
        const token = await userData.generateAuthToken();

        return res.status(200).header('x-auth', token).send(userData);
    } catch (e) {
        return res.status(400).send(e);
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.send(200).send();
    } catch (e) {
        res.send(400).send();
    }
});

app.get('/users/me', authenticate, (req, res) => {
    return res.status(200).send(req.user);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

//es6 syntax
module.exports = { app };
