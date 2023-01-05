const ApiError = require('../error/ApiError');
const articleService = require('../services/articleService');
class ArticleController {
    async getAll(req, res, next) {
        try {
            const articles = await articleService.getArticles();
            res.status(200).send(articles);
        } catch (error) {
            return next(ApiError.BadRequest(error.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const article = await articleService.getArticle(id);
            res.json(article);
        } catch (error) {
            return next(ApiError.BadRequest(error.message));
        }
    }

    async create(req, res, next) {
        try {
            const { title, content } = req.body;
            const article = await articleService.createArticle(title, content);
            res.json(article);
        } catch (error) {
            return next(ApiError.BadRequest(error.message));
        }
    }
}

module.exports = new ArticleController();
