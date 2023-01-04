const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
console.log(`Evns:`, {
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    PORT: process.env.PORT,
});
const cacheClient = require('./redis');
const app = express();

app.get('/', async (req, res) => {
    const resp = (await cacheClient.get('redis')) || 'No value';
    res.send(resp);
});

app.get('/set', async (req, res) => {
    const resp = await cacheClient.setEx('redis', 60 * 10, 'Hello World');
    res.send(resp);
});
app.listen(process.env.PORT, () => {
    console.log('Example app listening on port ' + process.env.PORT);
});
