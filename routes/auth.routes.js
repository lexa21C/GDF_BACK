const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const singUp = require('../controllers/AuthController.js')


//*users/////
router.post('/login',singUp.signup);
router.post('/singDecode',singUp.singDecode);

module.exports = router;
