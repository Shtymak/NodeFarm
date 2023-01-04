const redis = require('redis');
let options = {
    url:
        (process.env.REDIS_URL || 'redis://localhost') +
        ':' +
        (process.env.REDIS_PORT || 6379),
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
