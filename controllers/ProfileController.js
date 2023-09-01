const Profile = require('../models/Profiles.js');
const estructuraApi = require('../helpers/responseApi.js');

exports.allProfile = async (req, res) => {
    let apiStructure = new estructuraApi();

    const  profiles = await Profile.find({})

    if(profiles.length > 0){
     apiStructure.setResult(profiles)
    } else {
    apiStructure.setStatus(404, 'No hay perfiles')
    }

    res.json(apiStructure.toResponse())
}


exports.createProfile = async(req, res) => {
    let estructuraapi = new estructuraApi();
    let reqProfile = req.body;

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