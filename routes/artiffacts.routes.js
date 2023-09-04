const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const ArtiffactController=require('../controllers/ArtiffactController.js')


//* Artefactos
router.get('/artiffacts/:recordId/:projectId',ArtiffactController.allArtiffacts);
router.post('/artiffacts',ArtiffactController.createArtiffacts);
router.put('/artiffacts/:idArtiffacts',ArtiffactController.updateArtiffacts);
router.delete('/artiffacts/:idArtiffacts',ArtiffactController.deleteArtifact);
router.get('/artifacts/quarter/:quarterId',ArtiffactController.artiffactsByQuarter);
router.get('/artifacts/show/:id_artiffact', ArtiffactController.artiffactById);

module.exports = router;