const expect = require('expect');
const test = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../index');
const { TodoModel } = require('../model/todo-model');

//fixtures
const todos = [
    { _id: new ObjectID(), text: 'First test todo' },
    { _id: new ObjectID(), text: 'Second test todo' }
];

describe('POST /todos', () => {
    beforeEach(done => {
        TodoModel.remove({})  //wipe db
            .then(() => done());
    });

    it('should create a new todo', (done) => {
        let text = 'Todo test text',
            url = '/todos';

        test(app)
            .post(url)
            .send({ text })
            .expect(200)
            .expect((res) => {
                //server assertion
                expect(res.body.text).toBe(text);
            })
            .end((e, res) => {
                if (e) {
                    return done(e);
                }
                //db assertion
                TodoModel.find()
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(e => done(e))
            });
    });

    it('should not create todo with invalid body data', done => {
        let text = '',
            url = '/todos';

        test(app)
            .post(url)
            .send({ text })
            .expect(400)
            .expect(res => {
                //server assertion
                expect(res.body.text).toBeAn('undefined');
                expect(res.body.text).toNotExist();
            })
            .end((e, res) => {
                if (e) return done(e);

                //db asserion
                TodoModel.find()
                    .then(docs => {
                        expect(docs.length).toBe(0);
                        done();
                    })
                    .catch(e => done(e))
            });
    });
});

describe('GET /todos', () => {
    beforeEach(done => {
        TodoModel.insertMany(todos)
            .then(() => done());
    });

    afterEach(done => {
        TodoModel.remove({})  //wipe db
            .then(() => done());
    });

    it('should get all todos', done => {
        let url = '/todos';

        test(app)
            .get(url)
            .expect(200)
            .expect(res => {
                expect(res.body.data.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /todos/:id', () => {
    var url, id;

    beforeEach(done => {
        TodoModel.insertMany(todos)
            .then(() => done());
    });

    afterEach(done => {
        TodoModel.remove({})  //wipe db
            .then(() => done());
    });

    it('should return valid todo', done => {
        //Assemble
        url = '/todos';
        id = todos[0]._id.toString();

        //Act
        test(app)
            .get(`${url}/${id}`)
            .expect(200)
            .expect(res => {
                //Assert
                expect(res.body.data.text).toBe(todos[0].text);
                expect(res.body.data._id).toBe(id);
            })
            .end(done);
    });

    it('should return 404 when todo not found', done => {
        //Assemble
        url = '/todos';
        //fake invalid ID
        id = todos[0]._id.toString().replace(id.substring(0,1), 'x');
        
        //Act
        test(app)
            .get(`${url}/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if ID is not valid', done => {
        //Assemble
        let msg = `Todo is not valid`;
        url = '/todos';
        id = 123;

        //Act
        test(app)
            .get(`${url}/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    var url, id;

    beforeEach(done => {
        TodoModel.insertMany(todos)
            .then(() => done());
    });

    afterEach(done => {
        TodoModel.remove({})  //wipe db
            .then(() => done());
    });

    it('should remove valid todo', done => {
        //Assemble
        url = '/todos';
        id = todos[1]._id.toString();

        //Act
        test(app)
            .delete(`${url}/${id}`)
            .expect(200)
            .expect(res => {
                //Assert
                expect(res.body.data.text).toBe(todos[1].text);
                expect(res.body.data._id).toBe(id);
            })
            .end((e, res) => {
                if (e) {
                    return done(e);
                }
                TodoModel.findById(id)
                    .then(todo =>{
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch(done);
            });
    });

    it('should return 404 when todo not found', done => {
        //Assemble
        url = '/todos';
        //fake invalid ID
        id = todos[0]._id.toString().replace(id.substring(0,1), 'x');
        
        //Act
        test(app)
            .delete(`${url}/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if ID is not valid', done => {
        //Assemble
        let msg = `Todo is not valid`;
        url = '/todos';
        id = 123;

        //Act
        test(app)
            .delete(`${url}/${id}`)
            .expect(404)
            .end(done);
    });
});