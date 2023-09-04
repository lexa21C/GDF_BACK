const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const ProfileController = require('../controllers/ProfileController.js')

//* Perfil
router.get('/profile', /* checkAuth, */ ProfileController.allProfile);
router.post('/profile', ProfileController.createProfile);

module.exports = router;
