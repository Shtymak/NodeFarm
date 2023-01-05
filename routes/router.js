const Router = require('express');
const router = new Router();
const articleRouter = require('./articleRouter');
router.use('/article', articleRouter);
module.exports = router;
