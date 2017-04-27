const  { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); //hashing algorithm

var password = 'password123';

//salting means adding random value to hashed password
bcrypt.genSalt(10, (e, salt) => {
    //hashing
    bcrypt.hash(password, salt, (e, hash) => {
        //we wanna store hash in db not plain poassword
        console.log(`Hash: ${hash}`);
    });
});

const hashedPassword = '$2a$10$rrQg8wK7vIsevUHwqcdHqONCnxL78f.qIqe6uv/eVUb5n5.m38aPC';

//compare password with hash password
bcrypt.compare(password, hashedPassword, (e, result) => {
    console.log(`Password comparing: ${result}`);
});


// console.log(`Message: ${message}, \n Hash: ${hash}`);

// var data = {
//     id: 4
// };

// //send back to user
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };

// //manipulate user data
// token.data.id = 100;

// //validate if data wasn't manipulated
// var returnHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

// if (returnHash === token.hash) {
//     console.log('Data was not changed!');
// } else {
//     console.log('Data was changed. Do not trust!');
// }