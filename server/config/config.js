var env = process.env.NODE_ENV || 'development';

console.log(`env: ---> ${env}`)

if (env === 'development' || env === 'test') {
    let config = require('./config.json'); //automatically parse json

    Object.keys(config[env]).forEach(key => {
        process.env[key] = config[env][key];
    });
}