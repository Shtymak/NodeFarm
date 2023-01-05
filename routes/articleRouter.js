const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');
router.get('/list/all', articleController.getAll);
router.get('/:id', articleController.getOne);
router.post('/', articleController.create);
module.exports = router;
