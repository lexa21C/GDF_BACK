const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const Training_centersController = require('../controllers/TrainingCenterController.js')

//* centros de formacion
router.get('/training_center', Training_centersController.allCenters);

module.exports = router;