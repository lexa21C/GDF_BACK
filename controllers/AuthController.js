// Importar las funciones y módulos necesarios
const { compare } = require('../helpers/Bycript');  // Importar función de comparación de contraseñas
const { tokenSign, decodeSign } = require('../helpers/token');  // Importar funciones para tokens
const userModel = require('../models/Users.js');  // Importar el modelo de usuario
const training_center = require('../models/Training_centers');  // Importar el modelo de centros de entrenamiento
const ApiStructure = require('../helpers/responseApi.js');  // Importar clase para estructurar respuestas JSON

// Definir la función controladora para el proceso de registro de usuarios
exports.signup = async (req, res) => {
  // Desestructurar las propiedades del cuerpo de la solicitud
  const { email, password } = req.body;
  // Crear una instancia de ApiStructure para manejar la respuesta
  const apiStructure = new ApiStructure();
  try {
    // Buscar un usuario en la base de datos por correo electrónico y cargar relaciones
    const user = await userModel.findOne({ email }).populate('formation_program').populate('type_profile').populate('training_center');

    // Verificar si se encontró un usuario en la base de datos
    if (!user) {
      apiStructure.setStatus(404, "error", "no existe el usuario");
    } else {
      // Verificar la contraseña proporcionada con la contraseña almacenada
      const checkPassword = await compare(password, user.password);

      // Generar un token de sesión
      const tokenSession = await tokenSign(user);

      console.log(tokenSession);

      // Si la contraseña es correcta, enviar la respuesta JSON con el usuario y el token
      if (checkPassword) {
        return res.send({
          user: user,
          tokenSession,
        });
      }

      // Si la contraseña no es correcta, establecer el estado como error de credenciales
      if (!checkPassword) {
        apiStructure.setStatus(409, "error", "credenciales inválidas");
      }
    }

    // Enviar la respuesta JSON generada por apiStructure
    res.json(apiStructure.toResponse());
  } catch (err) {
    // Manejar errores y establecer el estado como error interno del servidor
    apiStructure.setStatus(500, 'error', err.message);
    // Enviar la respuesta JSON generada por apiStructure
    res.json(apiStructure.toResponse());
  }
};

// Definir la función controladora para decodificar un token
exports.singDecode = async (req, res) => {
  // Obtener el token del cuerpo de la solicitud
  const { token } = req.body;
  // Crear una instancia de ApiStructure para manejar la respuesta
  const apiStructure = new ApiStructure();
  try {
    // Decodificar el token
    const decode = await decodeSign(token);
    // Establecer el resultado en apiStructure
    apiStructure.setResult(decode);
  } catch (err) {
    // Manejar errores y establecer el estado como error interno del servidor
    apiStructure.setStatus(500, 'error', err.message);
  }
  // Enviar la respuesta JSON generada por apiStructure
  res.json(apiStructure.toResponse());
};
