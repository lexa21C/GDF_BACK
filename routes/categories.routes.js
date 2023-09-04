const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const CategorieController = require('../controllers/CategorieController.js')


//* Categorias
router.get('/categories', CategorieController.allCategories);
router.post('/category', CategorieController.createCategory);
router.put('/category/:id_category', CategorieController.updateCategory)
router.delete('/category/:id_category', CategorieController.deleteCategory)


module.exports = router;
