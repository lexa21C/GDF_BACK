// Importar el modelo y módulos necesarios
const Profile = require('../models/Profiles.js');
const estructuraApi = require('../helpers/responseApi.js');

// Controlador para obtener todos los perfiles
exports.allProfile = async (req, res) => {
    let apiStructure = new estructuraApi();

    // Buscar todos los perfiles en la base de datos
    const  profiles = await Profile.find({})

    if(profiles.length > 0){
        apiStructure.setResult(profiles)
    } else {
        apiStructure.setStatus(404, 'No hay perfiles')
    }

    res.json(apiStructure.toResponse())
}

// Controlador para crear un nuevo perfil
exports.createProfile = async(req, res) => {
    let estructuraapi = new estructuraApi();
    let reqProfile = req.body;

    // Crear un nuevo perfil con los datos proporcionados
    await Profile.create(reqProfile)
    .then((success) => {
        estructuraapi.setResult(success);
    })
    .catch((error) => {
        estructuraapi.setStatus(
            error.parent || error,
            "Error al crear el perfil",
            error.parent || error
        );
    });
    res.json(estructuraapi.toResponse())
}
