const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')

const ProjectController = require('../controllers/ProjectController.js')



//* Proyectos
router.get('/projects', ProjectController.allProjects);
router.get('/project/:record_id', ProjectController.allProjectsByRecords);
router.post('/project', ProjectController.validate, ProjectController.createProject);
router.get('/project/show/:id_project', ProjectController.projectById);
router.put('/project/:id_project', ProjectController.updateProjects);
router.delete('/project/:id_project', ProjectController.deleteProject);
router.post('/projects_search', ProjectController.searchProject);

module.exports = router;
