const {verifyToken} = require('../helpers/token.js')
const ApiStructure = require('../helpers/responseApi.js')

 const checkAuth = async (req, res, next) => {
  const responseapi = new ApiStructure();
  try {
    if (!req.headers.authorization) {
      responseapi.setStatus(403, "error", "No Tienes Authorización");
      res.json(responseapi.toResponse());
    } else {
      // TRAER EL TOKEN. SEPARAR EL TEXTO Y EL TOKEN. COJER SOLO EL ULTIMO DATO QUE ES EL TOKEN
      const token = req.headers.authorization.split(" ").pop();
      //  VERIFICAR QUE EL TOKEN PERTENESCA AL APLICATIVO Y QUE NO ESTE CADUCADO
      const tokenData = await verifyToken(token);

      if (!tokenData) {
        responseapi.setStatus(
          401,
          "error",
          "Su inicio de sesión es invalido. Por favor vuelva a iniciar"
        );
        res.json(responseapi.toResponse());
      } else {
        req.userId = tokenData._id;
        next();
      }
    }
  } catch (error) {
    responseapi.setStatus(
        "Falied",
        400,
        err.message,
    )
    res.json(responseapi.toResponse());
}
};

module.exports= {checkAuth}