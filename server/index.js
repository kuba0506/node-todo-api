const express = require('express');
const bodyParser = require('body-parser');

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
    todo.save()
        .then(doc => res.send(doc))
        .catch(e => res.status(400).send(e));
});


app.listen(port, () => console.log(`Server is running on port ${port}`));

//es6 syntax
module.exports = {app};

// module.exports.app = app;
// module.exports = {
//     app: app
// };

// module.exports = {
//     app
// };


