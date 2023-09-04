const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const CompetenceController = require('../controllers/CompetenceController.js')

//* Competencias
router.get('/competences', CompetenceController.allCompentences)
router.post('/competences', CompetenceController.createCompetences)
router.get('/competences/show/:id_competence', CompetenceController.competenceId)
router.get('/competences/:formation_program_id', CompetenceController.compoetenceByFormation)

module.exports = router;