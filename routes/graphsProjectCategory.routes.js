const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const ProjectFormationProgramController = require('../controllers/Graphs/ProjectFormationProgramController.js')

//* Graficas 
router.get('/graphsProjectFp', ProjectFormationProgramController.allProjectFormationProgram );
router.get('/graphsProjectCategory', ProjectFormationProgramController.categoryProject );

module.exports = router;