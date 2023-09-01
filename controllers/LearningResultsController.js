const Learning_results = require("../models/Learning_results.js")
const ApiStructure = require('../helpers/responseApi.js')
const Competences = require('../models/Competence.js')


exports.ListLearningResults = async (req, res) => {
    let apiStructure = new ApiStructure()

    let { competence_id } = req.params

    const results = await Learning_results.find({ competence: competence_id })

    if (results.length > 0) {
        apiStructure.setResult(results)
    } else {
        apiStructure.setStatus(404, 'No hay resultados de aprendizaje')
    }

    res.json(apiStructure.toResponse())
}

// Listar por Id
exports.resultById = async (req, res) => {
    let apiStructure = new ApiStructure()
    let { id_Result } = req.params;

    const result = await Learning_results.findById({ _id: id_Result });

    if(result) {
        apiStructure.setResult(result);
    }else {
        apiStructure.setStatus(
            404,
            "No existe el Resultado de Aprendizaje"
            )
    }

    res.json(apiStructure.toResponse());
}

exports.CreateResults = async (req, res) => {
    let apiStructure = new ApiStructure();
    let { learning_result, competence, code } = req.body;

        // Verificar si el código ya existe en la base de datos
        const existingResult = await Learning_results.findOne({ _id: code });

        if (existingResult) {
            apiStructure.setStatus("Failed", 400, `El Código  Ya Existe`);
        } else {
            await Learning_results.create({
                _id: code, learning_result, competence
            }).then(async (success) => {
                apiStructure.setResult(success, "Resultado de aprendizaje creado");
            }).catch((err) => {
                apiStructure.setStatus(
                    "No se pudo registrar el resultado de aprendizaje",
                    500,
                    err.message
                );
            })
        }
    res.json(apiStructure.toResponse());
}

exports.UpdateResults = async(req, res) => {
    let apiStructure = new ApiStructure();
    let code = req.params.code;
    let reqResult = req.body;

    const result = await Learning_results.findById({ _id: code })
  
    if(result){
        apiStructure.setResult("Resultado de Aprendizaje Actializado Correctamente")
    }else {
        apiStructure.setStatus(404, "Info", "No existe el Resultado de Aprendizaje")
    }

    await Learning_results.findByIdAndUpdate(code, {
        learning_result: reqResult.learning_result,
        competence: reqResult.competence
    }).then(async (success) => {
        apiStructure.setResult(success, "Resultado de Aprendizaje Actualizado con Exito")
    }).catch((err) => {
        apiStructure.setStatus(
            "Failed",
            400,
            err._message,
        )
    })

    res.json(apiStructure.toResponse())
}