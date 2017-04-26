const  { SHA256 } = require('crypto-js');
var message = 'I am user number 3';
var hash = SHA256(message).toString();

// console.log(`Message: ${message}, \n Hash: ${hash}`);

var data = {
    id: 4
};

//send back to user
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'secret').toString()
};

//manipulate user data
token.data.id = 100;

//validate if data wasn't manipulated
var returnHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

if (returnHash === token.hash) {
    console.log('Data was not changed!');
} else {
    console.log('Data was changed. Do not trust!');
}