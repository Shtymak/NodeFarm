const client = require('../db');
const redisCache = require('../redis');

class ArticleService {
    async getArticles() {
        const articles = [];
        const cache = await redisCache.get('articles');
        if (!cache) {
            const { rows } = await client.query('SELECT * FROM articles');
            rows.forEach((row) => {
                articles.push(row);
            });
            redisCache.set('articles', JSON.stringify(articles));
            return articles;
        }
        return JSON.parse(cache);
    }

    async getArticle(id) {
        const { rows } = await client.query(
            'SELECT * FROM articles WHERE id = $1',
            [id]
        );
        return rows[0];
    }

    async createArticle(title, content) {
        const { rows } = await client.query(
            'INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        await redisCache.del('articles');
        return rows[0];
    }
}

module.exports = new ArticleService();
