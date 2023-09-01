const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const UserController = require('../controllers/UserController.js');
const ProfileController = require('../controllers/ProfileController.js')
const ProjectController = require('../controllers/ProjectController.js')
const FormationPrograms = require('../controllers/FormationProgramController.js')
const CompetenceController = require('../controllers/CompetenceController.js')
const singUp = require('../controllers/AuthController.js')
const CategorieController = require('../controllers/CategorieController.js')
const LearningResultsController=require('../controllers/LearningResultsController.js')
const ArtiffactController=require('../controllers/ArtiffactController.js')
const RecordsController=require('../controllers/RecordsController.js')
const ModulesController = require('../controllers/ModulesController.js')
const Thematic_lines = require('../controllers/Thematic_LinesController.js')
const QuartersController=require('../controllers/QuarterController.js')
const DocumentController = require('../controllers/DocumentController.js')
const { multerDoc } = require('../config/multer.js');
const ProjectFormationProgramController = require('../controllers/Graphs/ProjectFormationProgramController.js')
const Training_centersController = require('../controllers/TrainingCenterController.js')

//*users/////
router.post('/login',singUp.signup);
router.post('/singDecode',singUp.singDecode);
router.get('/user', UserController.allUser);
router.get('/user/show/:id_user', UserController.myUser);
router.post('/user',UserController.validate, UserController.createUser);
router.put('/user/:id_user', UserController.UpdateUser);
router.delete('/user/:id_user', UserController.deleteUser);
router.get('/profileuser/:id_user', UserController.ProfileUser);
router.get('/user/program_formation/:id_user',UserController.progrmsFormationUsers)
router.get('/user/filter/:buscar/:buscarId',UserController.filterUser)
router.get('/users/:thematic_linesId', UserController.filterFormationPrograms);

//* Perfil
router.get('/profile', /* checkAuth, */ ProfileController.allProfile);
router.post('/profile', ProfileController.createProfile);

//* Proyectos
router.get('/projects', ProjectController.allProjects);
router.get('/project/:record_id', ProjectController.allProjectsByRecords);
router.post('/project', ProjectController.validate, ProjectController.createProject);
router.get('/project/show/:id_project', ProjectController.projectById);
router.put('/project/:id_project', ProjectController.updateProjects);
router.delete('/project/:id_project', ProjectController.deleteProject);
router.post('/projects_search', ProjectController.searchProject);

//* Programas de Formación 
router.get('/formation_programs/:user_id', FormationPrograms.allFormationProgramIdUser)
router.get('/formation_programs/show/:id_formation_programs', FormationPrograms.formation_programsbyid)
router.post('/formation_programs', FormationPrograms.createFormstionPrograms)
router.put('/formation_programs/:id_formation_programs', FormationPrograms.updateFormationPrograms)
router.delete('/formation_programs/:id_formation_programs', FormationPrograms.deleteFormationPrograms)
router.get('/formation_programs/:idformation_programs', FormationPrograms.myformationprograms)

//* Competencias
router.get('/competences', CompetenceController.allCompentences)
router.post('/competences', CompetenceController.createCompetences)
router.get('/competences/show/:id_competence', CompetenceController.competenceId)
router.get('/competences/:formation_program_id', CompetenceController.compoetenceByFormation)

//* Resultados de Aprendizaje
router.get('/learningResults/:competence_id',LearningResultsController.ListLearningResults)
router.post('/learningResults',LearningResultsController.CreateResults)
router.put('/learningResults/:code',LearningResultsController.UpdateResults);
router.get('/learningResults/show/:id_Result',LearningResultsController.resultById);

//* Artefactos
router.get('/artiffacts/:recordId/:projectId',ArtiffactController.allArtiffacts);
router.post('/artiffacts',ArtiffactController.createArtiffacts);
router.put('/artiffacts/:idArtiffacts',ArtiffactController.updateArtiffacts);
router.delete('/artiffacts/:idArtiffacts',ArtiffactController.deleteArtifact);
router.get('/artifacts/quarter/:quarterId',ArtiffactController.artiffactsByQuarter);
router.get('/artifacts/show/:id_artiffact', ArtiffactController.artiffactById);

//* Categorias
router.get('/categories', CategorieController.allCategories);
router.post('/category', CategorieController.createCategory);
router.put('/category/:id_category', CategorieController.updateCategory)
router.delete('/category/:id_category', CategorieController.deleteCategory)

//* Fichas
router.get('/records/:formationPrograms_Id',RecordsController.allRecords);
router.get('/records',RecordsController.all);
router.get('/records/show/:idRecord',RecordsController.recordById);
router.post('/records',RecordsController.createRecords);
router.delete('/records/:idRecords',RecordsController.deleteRecords);
router.put('/records/:idRecords',RecordsController.updateRecords);

//* Modulos

router.get('/modules', ModulesController.allModules)
router.post('/modules', ModulesController.createModules);
router.put('/modules/:id_module', ModulesController.updatesModules);

//* Lineas Tematicas
router.get('/thematics', Thematic_lines.allthematics);


//* Trimestres
router.get('/quarter/:formation_program_id',QuartersController.allQuarters);
router.post('/quarter',QuartersController.createQuarter);
router.put('/quarter/:quarteId',QuartersController.updataQuarter);
router.delete('/quarter/:quarteId',QuartersController.deleteQuarter);

//*Documentos 
router.post('/documents',multerDoc, DocumentController.createDocument);
router.get('/download/:id', DocumentController.getDocId);

//* Graficas 
router.get('/graphsProjectFp', ProjectFormationProgramController.allProjectFormationProgram );
router.get('/graphsProjectCategory', ProjectFormationProgramController.categoryProject );

//* centros de formacion
router.get('/training_center', Training_centersController.allCenters);

module.exports = router;