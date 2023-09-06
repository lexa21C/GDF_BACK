
const User = require("../../../models/Users.js");
const ApiStructure = require('../../responseApi.js');

async function validateEmail(email, res) {
  let apiStructure = new ApiStructure();
  const existingUser = await User.findOne({ email }); 
  
  if (existingUser) {
    //*devuelve una respuesta de error si el correo no es único
      apiStructure.setStatus("Failed", 400, `El correo electrónico12 '${email}' ya está registrado`);
      return res.json(apiStructure.toResponse());
  }else {
    return existingUser
  }

  
  

}
  
module.exports = {
  validateEmail
};
  
