const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const DocumentController = require('../controllers/DocumentController.js')
const { multerDoc } = require('../config/multer.js');


//*Documentos 
router.post('/documents',multerDoc, DocumentController.createDocument);
router.get('/download/:id', DocumentController.getDocId);

module.exports = router;