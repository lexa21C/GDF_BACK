const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const FormationPrograms = require('../controllers/FormationProgramController.js')


//* Programas de Formación 
router.get('/formation_programs/:user_id', FormationPrograms.allFormationProgramIdUser)
router.get('/formation_programs/show/:id_formation_programs', FormationPrograms.formation_programsbyid)
router.post('/formation_programs', FormationPrograms.createFormstionPrograms)
router.put('/formation_programs/:id_formation_programs', FormationPrograms.updateFormationPrograms)
router.delete('/formation_programs/:id_formation_programs', FormationPrograms.deleteFormationPrograms)
router.get('/formation_programs/:idformation_programs', FormationPrograms.myformationprograms)

module.exports = router;