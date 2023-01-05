const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const pg = require('./db');
const cacheClient = require('./redis');
const router = require('./routes/router');
const errorMiddleware = require('./middleware/ErrorHandlingMiddleware');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

console.log(`Evns:`, {
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    PORT: process.env.PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_NAME: process.env.POSTGRES_NAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
});
const boot = async () => {
    try {
        await pg.connect();
        const tableCreate = await pg.query(
            'CREATE TABLE IF NOT EXISTS articles (id SERIAL PRIMARY KEY, title VARCHAR(255), content TEXT)'
        );
        console.log(`Db connected`, tableCreate);
    } catch (e) {
        console.log(`Db connect Error: `, e);
    }
    app.listen(process.env.PORT, () => {
        console.log('Example app listening on port ' + process.env.PORT);
    });
};
boot();
