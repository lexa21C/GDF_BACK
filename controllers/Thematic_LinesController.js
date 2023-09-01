const Thematic_lines = require('../models/Thematic_lines.js')
const ApiStructure = require('../helpers/responseApi.js')

exports.allthematics = async(req, res) => {
    let apiStructure = new ApiStructure();

    const thematics = await Thematic_lines.find({}).populate('formation_program')

    if(thematics.length >0){
        apiStructure.setResult(thematics)
    }else{
        apiStructure.setStatus(404, 'No hay Lineas tematicas')
    }

    res.json(apiStructure.toResponse())
}



