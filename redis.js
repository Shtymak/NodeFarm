const redis = require('redis');
let redisUrl = 'redis://localhost';
if (process.env.REDIS_URL) {
    const urlContains = process.env.REDIS_URL.startsWith('redis://');
    redisUrl = urlContains
        ? process.env.REDIS_URL
        : 'redis://' + process.env.REDIS_URL;
}
let options = {
    url: redisUrl + ':' + (process.env.REDIS_PORT || 6379),
};
const client = redis.createClient(options);

async function run() {
    client.on('error', function (error) {
        console.log(`Connection failed: ${error}`);
    });
    await client.connect();
}

run().then();
module.exports = client;
