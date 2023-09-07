// Importar modelos y módulos necesarios
const Learning_results = require("../models/Learning_results.js")
const ApiStructure = require('../helpers/responseApi.js')
const Competences = require('../models/Competence.js')

// Controlador para listar todos los resultados de aprendizaje asociados a una competencia por su ID
exports.ListLearningResults = async (req, res) => {
    let apiStructure = new ApiStructure()

    let { competence_id } = req.params

    // Buscar resultados de aprendizaje relacionados con la competencia especificada
    const results = await Learning_results.find({ competence: competence_id })

    if (results.length > 0) {
        apiStructure.setResult(results)
    } else {
        apiStructure.setStatus(404, 'No hay resultados de aprendizaje')
    }

    res.json(apiStructure.toResponse())
}

// Controlador para listar un resultado de aprendizaje por su ID
exports.resultById = async (req, res) => {
    let apiStructure = new ApiStructure()
    let { id_Result } = req.params;

    // Buscar un resultado de aprendizaje por su ID
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

// Controlador para crear un nuevo resultado de aprendizaje
exports.CreateResults = async (req, res) => {
    let apiStructure = new ApiStructure();
    let { learning_result, competence, code } = req.body;

    // Verificar si el código ya existe en la base de datos
    const existingResult = await Learning_results.findOne({ _id: code });

    if (existingResult) {
        apiStructure.setStatus("Failed", 400, `El Código  Ya Existe`);
    } else {
        // Crear un nuevo resultado de aprendizaje
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

// Controlador para actualizar un resultado de aprendizaje por su código
exports.UpdateResults = async(req, res) => {
    let apiStructure = new ApiStructure();
    let code = req.params.code;
    let reqResult = req.body;

    // Buscar un resultado de aprendizaje por su código
    const result = await Learning_results.findById({ _id: code })
  
    if(result){
        apiStructure.setResult("Resultado de Aprendizaje Actualizado Correctamente")
    }else {
        apiStructure.setStatus(404, "Info", "No existe el Resultado de Aprendizaje")
    }

    // Actualizar los datos del resultado de aprendizaje
    await Learning_results.findByIdAndUpdate(code, {
        learning_result: reqResult.learning_result,
        competence: reqResult.competence
    }).then(async (success) => {
        apiStructure.setResult(success, "Resultado de Aprendizaje Actualizado con Éxito")
    }).catch((err) => {
        apiStructure.setStatus(
            "Failed",
            400,
            err._message,
        )
    })

    res.json(apiStructure.toResponse())
}
