const Router = require('express');
const router = new Router();
const filmController = require('../controllers/articleController');
router.get('/all', filmController.getAll);
router.get('/:id', filmController.getOne);
router.post('/', filmController.create);
module.exports = router;
