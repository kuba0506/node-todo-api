const expect = require('expect');
const test = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../index');
const { TodoModel } = require('../model/todo-model');
const { UserModel } = require('../model/user-model');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

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
                        expect(todos.length).toBe(3);
                        expect(todos[2].text).toBe(text);
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
                        expect(docs.length).toBe(2);
                        done();
                    })
                    .catch(e => done(e))
            });
    });
});

describe('GET /todos', () => {
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
        id = todos[0]._id.toString().replace(id.substring(0, 1), 'x');

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
                    .then(todo => {
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
        id = todos[0]._id.toString().replace(id.substring(0, 1), 'x');

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

describe('PATCH /todos/id', () => {
    it('should update the todo', done => {
        //Assemble
        url = '/todos';
        id = todos[0]._id.toString();
        let payload = {
            text: "Change first",
            completed: true
        };
        //Act
        test(app)
            .patch(`${url}/${id}`)
            .send(payload)
            //Assert
            .expect(200)
            .expect(todo => {
                expect(todo.body.data.completedAt).toExist();
                expect(todo.body.data.completedAt).toBeA('number');
                expect(todo.body.data.text).toEqual(payload.text);
                expect(todo.body.data.text).toEqual(payload.text);
            })
            .end(done);
    });
    it('should clear completedAt when completed is set to false', done => {
        //Assemble
        url = '/todos';
        id = todos[1]._id.toString();
        let payload = {
            text: "Change second",
            completed: false
        };
        //Act
        test(app)
            .patch(`${url}/${id}`)
            .send(payload)
            //Assert
            .expect(200)
            .expect(todo => {
                expect(todo.body.data.completedAt).toBeFalsy();
                expect(todo.body.data.completed).toEqual(payload.completed);
                expect(todo.body.data.text).toEqual(payload.text);
            })
            .end(done);
    });

    it('should send 404 when id is not valid', done => {
        //Assemble
        url = '/todos';
        id = 123123123;
        let payload = {
            text: "Change first",
            completed: true
        };
        //Act
        test(app)
            .patch(`${url}/${id}`)
            .send(payload)
            //Assert
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    //valid authentication
    it('should return user if authenticated', done => {
        //Assemble
        let url = '/users/me';
        let user = users[0];
        let token = users[0].tokens[0].token;
        //Act
        test(app)
            .get(url)
            .set('x-auth', token)
            //Assert
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(user._id.toHexString());
            })
            .expect(res => {
                expect(res.body.email).toBe(user.email);

            })
            .end(done);
    });

    //invalid authentication
    it('should return 401 if not authenticated', done => {
        //Assemble
        let url = '/users/me';
        //Act
        test(app)
            .get(url)
            // .set('x-auth', token)
            //Assert
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', done => {
        //assemble
        let email = 'email@mail.com';
        let password = '123456';
        let url = '/users';
        //act
        test(app)
            .post(url)
            .send({ email, password })
            //assert
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
            })
            .expect(res => {
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if (err) {
                    return done(err);
                }

                //query db
                UserModel.findOne({ email })
                    .then(user => {
                        expect(user.email).toBe(email);
                        return user;
                    })
                    .then(user => {
                        expect(user.password).toNotBe(password);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
    //wrong email or password 
    it('should return validation error if request is invalid', done => {
        //assemble
        let email = '';
        let password = '1';
        let url = '/users';
        //act
        test(app)
            .post(url)
            .send({ email, password })
            //assert
            .expect(400)
            .end(done);
    });
    it('should not create user if email in use', done => {
        //assemble
        let email = users[0].email;
        let password = '123456';
        let url = '/users';
        //act
        test(app)
            .post(url)
            .send({ email, password })
            //assert
            .expect(400)
            .expect(res => {
                expect(res.body.errmsg).toExist();
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    var url = '/users/login',
        email = users[1].email,
        password;

    it('should login user and return token', done => {
        //Assemble
        password = users[1].password;
        //Act
        test(app)
            .post(url)
            .send({ email, password })
            //Assert
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((e, res) => {
                if (e) {
                    return done(e);
                }
                UserModel.findById(users[1]._id)
                    .then(user => {
                        expect(user.tokens[0]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('should reject invalid login', done => {
        //Assemble
        password = 'wrongPassword';

        //Act
        test(app)
            .post(url)
            .send({ email, password })
            //Assert
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((e, res) => {
                if (e) {
                    return done(e);
                }
                UserModel.findById(users[1]._id)
                    .then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe.only('DELETE /users/me/token', () => {
    let url;
    let token;

    it('should remove auth token on logout', done => {
        //Delete /users/me/token
        //Set x-auth equal to users[0].tokens[0].token
        //Find user, verify that tokens array is empty

        //Assemble
        token = users[0].tokens[0].token;
        url = '/users/me/token';

        //Act
        test(app)
            .delete(url)
            .set('x-auth', token)
            //Assert
            .expect(200)
            .end((e, res) => {
                if (e) {
                    return done(e);
                }
                UserModel.findById(users[0]._id)
                    .then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});