const client = require('../db');
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
                    const { rows } = await client.query(
                        'SELECT * FROM articles'
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
                    const { rows } = await client.query(
                        'SELECT * FROM articles WHERE id = $1',
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
            const { rows } = await client.query(
                'INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *',
                [title, content]
            );
            redisCache.del('articles');
            resolve(rows[0]);
        });
    }
}

module.exports = new ArticleService();
