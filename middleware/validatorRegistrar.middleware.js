const User = require("../models/Users.js");
const Profile = require("../models/Profiles.js");
const ApiStructure = require('../helpers/responseApi.js');
const { check, validationResult } = require('express-validator');

async function validateEmailMiddleware(req, res, next) {
  const { email, type_profile } = req.body;
  let apiStructure = new ApiStructure();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const apiStructure = new ApiStructure();
    apiStructure.setStatus("Failed", 400, `El correo electrónico1265 '${email}' ya está registrado`);
    return res.json(apiStructure.toResponse());
  }
  const existingProfile = await Profile.findOne({ type_profile: type_profile });
  console.log(!!existingProfile);

  if (!existingProfile) {
      // El perfil no existe, manejar el error
      apiStructure.setStatus("Failed", 400, `El perfil '${type_profile}' no existe`);
      return res.json(apiStructure.toResponse());
  }

  // Si el correo no está duplicado, pasa al siguiente middleware o al controlador
  next();
}

function validate(req, res, next) {
  const { body } = req;
  
  // Define aquí tus reglas de validación personalizadas
  const customValidationRules = [
    check("complete_names")
      .notEmpty().withMessage('El campo "complete_names" es obligatorio')
      .escape()
      .matches(/^[A-Za-z0-9 ]+$/),
    check("email")
      .notEmpty().withMessage('El campo "email" es obligatorio')
      .isEmail().withMessage('El correo electrónico no es válido'),
    check("type_profile")
      .notEmpty().withMessage('El campo "type_profile" es obligatorio'),
    check("thematic_lines")
      .notEmpty().withMessage('el campo "thematic_lines" es obligatorio')
  ];

  // Ejecuta las reglas de validación personalizadas
  Promise.all(customValidationRules.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      
      next(); // Si no hay errores de validación, pasa al siguiente middleware o al controlador
    });
}

module.exports = {
  validateEmailMiddleware,
  validate,
};
