const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
console.log(`Evns:`, {
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    PORT: process.env.PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_NAME: process.env.POSTGRES_NAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
});
const pg = require('./db');
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

app.get('/db/save', async (req, res) => {
    try {
        const resp = await pg.query('INSERT INTO test (name) VALUES ($1)', [
            crypto.randomUUID(),
        ]);
        res.send(resp);
    } catch (e) {
        console.log(`Error: `, e);
    }
});

app.get('/db/get', async (req, res) => {
    const resp = await pg.query('SELECT * FROM test');
    if (!resp) return res.send('No data');
    res.send(resp);
});
const boot = async () => {
    try {
        await pg.connect();
        console.log(`Db connected`);
    } catch (e) {
        console.log(`Db connect Error: `, e);
    }
    app.listen(process.env.PORT, () => {
        console.log('Example app listening on port ' + process.env.PORT);
    });
};
boot();
