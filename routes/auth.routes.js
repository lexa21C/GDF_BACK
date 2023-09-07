const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const singUp = require('../controllers/AuthController.js')
const validateRequestBody = require('../middleware/validateRequestBody.middleware.js')

//*users/////
router.post('/login',validateRequestBody,singUp.signup);
router.post('/singDecode',singUp.singDecode);

module.exports = router;
