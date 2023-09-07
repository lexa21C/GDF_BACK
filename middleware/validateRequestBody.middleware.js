
// validateRequestBody.js
const ApiStructure = require('../helpers/responseApi.js');
// Middleware para validar si se envían datos en la solicitud POST
const validateRequestBody = (req, res, next) => {
    let apiStructure = new ApiStructure();
    if (Object.keys(req.body).length === 0) {
      // Si el cuerpo de la solicitud está vacío, responder con un error 400 (Solicitud incorrecta)
        apiStructure.setStatus("Error", 400,'El cuerpo de la solicitud no contiene datos');
        return res.json(apiStructure.toResponse());
      
    }
    // Si hay datos en el cuerpo de la solicitud, continúa con la siguiente función (el controlador signup)
    next();
  };
  
  module.exports = validateRequestBody;
  