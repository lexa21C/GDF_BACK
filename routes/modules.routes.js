const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const ModulesController = require('../controllers/ModulesController.js')


//* Modulos

router.get('/modules', ModulesController.allModules)
router.post('/modules', ModulesController.createModules);
router.put('/modules/:id_module', ModulesController.updatesModules);

module.exports = router;