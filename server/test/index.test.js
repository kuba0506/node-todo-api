const expect = require('expect');
const test = require('supertest');

const { app } = require('../index');
const { TodoModel } = require('../model/todo-model');

//fixtures
const todos = [
    { text: 'First test todo' },
    { text: 'Second test todo' }
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

describe('GET /todos', done => {
    beforeEach(done => {
        TodoModel.insertMany(todos)
            .then(() => done());
    });

    afterEach(done => {
         TodoModel.remove({})  //wipe db
            .then(() => done());
    });

    it('should get all todos', done => {
        let  url = '/todos';

        test(app)
            .get(url)
            .expect(200)
            .expect(res => {
                expect(res.body.data.length).toBe(2);
            })
            .end(done);
    })
});