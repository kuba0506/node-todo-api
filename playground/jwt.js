const  { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};
var secret = 'secret123';

//create token = data + secret
var token  = jwt.sign(data, secret); //token is send back to user when signup or login
console.log(`Token: ${token}`);

//verify token means checking if token contains proper; token + secret -> data = { id:10 }
var decoded = jwt.verify(token, secret);
console.log(`Decoded: ${JSON.stringify(decoded, null, 4)}`);