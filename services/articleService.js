const { Client } = require('pg');
const redisCache = require('../redis');

class ArticleService {
    getArticles() {
        return new Promise((resolve, reject) => {
            redisCache.get('articles', async (err, articles) => {
                if (err) {
                    reject(err);
                }
                if (articles) {
                    resolve(JSON.parse(articles));
                } else {
                    const client = new Client();
                    await client.connect();
                    const { rows } = await client.query(
                        'SELECT * FROM article'
                    );
                    redisCache.set('articles', JSON.stringify(rows));
                    resolve(rows);
                }
            });
        });
    }

    getArticle(id) {
        return new Promise((resolve, reject) => {
            redisCache.get(`article:${id}`, async (err, article) => {
                if (err) {
                    reject(err);
                }
                if (article) {
                    resolve(JSON.parse(article));
                } else {
                    const client = new Client();
                    await client.connect();
                    const { rows } = await client.query(
                        'SELECT * FROM article WHERE id = $1',
                        [id]
                    );
                    redisCache.set(`article:${id}`, JSON.stringify(rows[0]));
                    resolve(rows[0]);
                }
            });
        });
    }

    createArticle(title, content) {
        return new Promise(async (resolve, reject) => {
            const client = new Client();
            await client.connect();
            const { rows } = await client.query(
                'INSERT INTO article (title, content) VALUES ($1, $2) RETURNING *',
                [title, content]
            );
            redisCache.del('articles');
            resolve(rows[0]);
        });
    }
}

module.exports = new ArticleService();
