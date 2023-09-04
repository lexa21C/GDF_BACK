const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const RecordsController=require('../controllers/RecordsController.js')


//* Fichas
router.get('/records/:formationPrograms_Id',RecordsController.allRecords);
router.get('/records',RecordsController.all);
router.get('/records/show/:idRecord',RecordsController.recordById);
router.post('/records',RecordsController.createRecords);
router.delete('/records/:idRecords',RecordsController.deleteRecords);
router.put('/records/:idRecords',RecordsController.updateRecords);

module.exports = router;