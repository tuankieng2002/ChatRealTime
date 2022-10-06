const redis = require('redis');
const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
});

client.ping((err, pong) => {
    if (err) {
        console.log(err);
    } else {
        console.log(pong);
    }
})

client.on('error', (err) => console.error(err));

client.on('connect', (err) => console.log('Connected to Redis'));

client.on('ready', (err) => console.log('Redis to ready'));

module.exports = client;