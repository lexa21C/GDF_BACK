const Profile = require("../../../models/Profiles.js");
const ApiStructure = require('../../responseApi.js');

async function validateProfileExistence(typeProfile, res) {
    let apiStructure = new ApiStructure();
   
    const existingProfile = await Profile.findOne({ type_profile: typeProfile });
    console.log(!!existingProfile);

    if (!existingProfile) {
        // El perfil no existe, manejar el error
        apiStructure.setStatus("Failed", 400, `El perfil '${typeProfile}' no existe`);
        return res.json(apiStructure.toResponse());
    }else {
      return existingProfile;
    }
}

module.exports = {
    validateProfileExistence,
};

  