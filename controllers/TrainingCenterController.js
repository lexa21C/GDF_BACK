const Training_center = require('../models//Training_centers.js');
const estructureApi = require('../helpers/responseApi.js');

exports.allCenters = async(req, res) => {
    let apiEstructure = new estructureApi();

    const center = await Training_center.find({})

    if(center.length > 0){
    apiEstructure.setResult(center)
}else {
    apiEstructure.setStatus(404, "Info", "No hay Centros de formación")
}

res.json(apiEstructure.toResponse());
}