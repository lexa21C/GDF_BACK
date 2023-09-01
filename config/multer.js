const mime = require('mime-types');
const multer = require('multer');

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Configuración del middleware de Multer
const multerDoc = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // tamaño máximo del archivo: 5 MB
  },
  fileFilter: function (req, file, cb) {
    if (
     file.mimetype !== 'image/jpeg' &&
     file.mimetype !== 'image/png' &&
     file.mimetype !== 'application/vnd.ms-excel' &&
     file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
     file.mimetype !== 'application/json' &&
     file.mimetype !== 'application/pdf' &&
     file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
         
    ) {
      return cb(new Error('El tipo de archivo no es válido.'));
    }
    cb(null, true);
  }
}).single('doc');

module.exports = { multerDoc };

