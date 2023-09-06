// Importar el módulo 'jsonwebtoken' para manejar tokens JWT
const jwt = require('jsonwebtoken');

// Función para generar un token JWT a partir de un usuario
const tokenSign = async (user) => {
    return jwt.sign(
        {
            _id: user._id,        // Identificador único del usuario
            role: user.profile    // Rol o perfil del usuario
        },
        process.env.JWT_SECRET,  // Secreto utilizado para firmar el token
        {
            expiresIn: "2h",     // Expiración del token en 2 horas
        }
    );
}

// Función para verificar la validez de un token JWT
const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET); // Verificar el token utilizando el secreto
    } catch (e) {
        return null; // Si hay un error al verificar, se devuelve null
    }
}

// Función para decodificar un token JWT sin verificar su validez
const decodeSign = (token) => {
    return jwt.decode(token, null); // Decodificar el token sin verificar su firma
}

// Exportar las funciones 'tokenSign', 'decodeSign', y 'verifyToken' para su uso en otros archivos
module.exports = { tokenSign, decodeSign, verifyToken };
