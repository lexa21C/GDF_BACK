const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const UserController = require('../controllers/UserController.js');
const {validateEmailMiddleware, validate} = require('../middleware/validatorRegistrar.middleware.js')



//*users/////

router.get('/user', UserController.allUser);
router.get('/user/show/:id_user', UserController.myUser);

router.post('/user', validate,validateEmailMiddleware ,UserController.createUser);
router.put('/user/:id_user', UserController.UpdateUser);
router.delete('/user/:id_user', UserController.deleteUser);
router.get('/profileuser/:id_user', UserController.ProfileUser);
router.get('/user/program_formation/:id_user',UserController.progrmsFormationUsers)
router.get('/user/filter/:buscar/:buscarId',UserController.filterUser)
router.get('/users/:thematic_linesId', UserController.filterFormationPrograms);

module.exports = router;