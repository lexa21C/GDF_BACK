const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const Thematic_lines = require('../controllers/Thematic_LinesController.js')

//* Lineas Tematicas
router.get('/thematics', Thematic_lines.allthematics);

module.exports = router;
