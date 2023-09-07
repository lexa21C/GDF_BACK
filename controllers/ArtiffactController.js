// Importa los modelos y módulos necesarios
const Learning_results = require("../models/Learning_results.js");
const ApiStructure = require('../helpers/responseApi.js');
const Artiffacts = require('../models/Artiffacts.js');
const Quarters = require('../models/Quarters.js');
const Documents = require('../models/Documents.js');
const Records = require('../models/Records.js');

// Controlador para obtener todos los artefactos relacionados con un registro y proyecto específicos
exports.allArtiffacts = async (req, res) => {
    // Crea una instancia de ApiStructure para manejar la respuesta
    const apiStructure = new ApiStructure();
    // Obtiene los parámetros de la solicitud
    const { recordId, projectId } = req.params;

    try {
        // Encuentra el registro por su ID
        const record = await Records.findById(recordId);
        // Encuentra todos los trimestres relacionados con el programa de formación del registro
        const quarters = await Quarters.find({ formation_program: record.formation_program }).lean();
        const array = [];

        // Itera a través de los trimestres y encuentra los artefactos relacionados
        for (let quarter of quarters) {
            const artiffacts = await Artiffacts.find({ quarter: quarter._id }).populate('quarter');
            array.push(...artiffacts);
        }

        // Encuentra los documentos relacionados con los artefactos y el proyecto específico
        const arrayD = [];
        for (let i = 0; i < array.length; i++) {
            const documents = await Documents.find({ artiffact: array[i]._id, project: projectId }, { doc: 0 })
                .populate({
                    path: 'artiffact',
                    model: 'Artiffacts',
                    populate: {
                        path: 'quarter',
                        model: 'Quarters',
                        select: 'number'
                    }
                });

            // Si el artefacto no tiene documentos, lo agrega al arrayD
            if (documents.length === 0) {
                arrayD.push(array[i]);
            } else {
                arrayD.push(...documents);
            }
        }

        // Establece el resultado en la estructura de API
        apiStructure.setResult({ artiffacts: arrayD });
        // Envia la respuesta JSON
        return res.json(apiStructure.toResponse());
    } catch (err) {
        // Maneja los errores y establece el estado de error en la estructura de API
        apiStructure.setStatus("Failed", 400, err.message);
        // Envia la respuesta JSON de error
        return res.json(apiStructure.toResponse());
    }
}

// Controlador para obtener un artefacto por su ID
exports.artiffactById = async (req, res) => {
    // Crea una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();
    // Obtiene el ID del artefacto desde los parámetros de la solicitud
    let id_artiffact = req.params.id_artiffact;

    // Busca el artefacto por su ID y carga las relaciones con competencia y trimestre
    const artiffact = await Artiffacts.findById({ _id: id_artiffact }).populate('competence').populate('quarter');

    if (artiffact) {
        // Si se encontró el artefacto, establece el resultado en la estructura de API
        apiStructure.setResult(artiffact);
    } else {
        // Si no se encontró el artefacto, establece un estado de error 404 en la estructura de API
        apiStructure.setStatus(404, "No Existe el Artefacto");
    }

    // Envia la respuesta JSON
    res.json(apiStructure.toResponse());
}

// Controlador para crear un artefacto
exports.createArtiffacts = async (req, res) => {
    // Obtiene el cuerpo de la solicitud
    const { body } = req;
    // Crea una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();

    // Verifica si 'project' está en el cuerpo y si su longitud es 0, en cuyo caso lo elimina
    if ('project' in body && body.project.length === 0) {
        delete req.body.project;
    }

    // Convierte el nombre a minúsculas y capitaliza la primera letra
    const formattedName = body.name.charAt(0).toUpperCase() + body.name.slice(1).toLowerCase();

    // Verifica si el nombre ya existe en la base de datos
    const existingArtiffact = await Artiffacts.findOne({ name: formattedName });

    if (existingArtiffact) {
        // Si el nombre ya existe, establece un estado de error 400 en la estructura de API
        apiStructure.setStatus("Failed", 400, `El Nombre del Artefacto '${formattedName}' Ya Existe`);
    } else {
        // Si el nombre no existe, procede con la creación
        // Actualiza el nombre formateado en el objeto antes de crearlo
        body.name = formattedName;

        try {
            // Intenta crear el artefacto y manejar los resultados
            const createdArtiffact = await Artiffacts.create(body);
            // Establece el resultado en la estructura de API con un mensaje de éxito
            apiStructure.setResult(createdArtiffact, "Artefacto creado con éxito");
        } catch (err) {
            // Si ocurre un error durante la creación, establece un estado de error 400 en la estructura de API
            apiStructure.setStatus("Failed", 400, err.message);
        }
    }

    // Envia la respuesta JSON
    res.json(apiStructure.toResponse());
};

// Controlador para actualizar un artefacto
exports.updateArtiffacts = async (req, res) => {
    // Obtiene los datos de la solicitud
    const { name, description } = req.body;
    const { idArtiffacts } = req.params;
    // Crea una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();

    // Intenta actualizar el artefacto por su ID
    await Artiffacts.findByIdAndUpdate(idArtiffacts, {
        name, description
    }).then(async (success) => {
        // Si la actualización fue exitosa, establece el resultado en la estructura de API con un mensaje de éxito
        apiStructure.setResult(success, "Artefacto actualizado correctamente");
    }).catch((err) => {
        // Si ocurre un error durante la actualización, establece un estado de error 400 en la estructura de API
        apiStructure.setStatus("Failed", 400, err._message);
    });

    // Envia la respuesta JSON
    res.json(apiStructure.toResponse());
}

// Controlador para eliminar un artefacto
exports.deleteArtifact = async (req, res) => {
    // Obtiene el ID del artefacto desde los parámetros de la solicitud
    const { idArtiffacts } = req.params;
    // Crea una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();

    // Intenta eliminar el artefacto por su ID
    await Artiffacts.findByIdAndDelete({ _id: idArtiffacts }).then(async (success) => {
        // Si la eliminación fue exitosa, establece el resultado en la estructura de API con un mensaje de éxito
        apiStructure.setResult(success, "Artefacto eliminado correctamente");
    }).catch((err) => {
        // Si ocurre un error durante la eliminación, establece un estado de error 400 en la estructura de API
        apiStructure.setStatus("Failed", 400, err._message);
    });

    // Envia la respuesta JSON
    res.json(apiStructure.toResponse());
}

// Controlador para obtener artefactos por trimestre
exports.artiffactsByQuarter = async (req, res) => {
    // Crea una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();

    try {
        // Obtiene el ID del trimestre desde los parámetros de la solicitud
        const { quarterId } = req.params;
        // Encuentra los artefactos relacionados con el trimestre
        const artiffacts = await Artiffacts.find({ quarter: quarterId }).lean();
        // Encuentra el trimestre y su competencia relacionada
        const QuarteByCompetence = await Quarters.findById(quarterId).lean().populate('competence');

        if (!artiffacts) {
            // Si no hay artefactos en la lista, establece un estado informativo en la estructura de API
            apiStructure.setStatus("info", 202, "No hay artefactos en la lista");
            return res.json(apiStructure.toResponse());
        }

        // Crea un objeto que contiene artefactos y la competencia del trimestre
        const object = {
            artiffacts: artiffacts,
            competence: QuarteByCompetence.competence
        };

        // Establece el resultado en la estructura de API
        apiStructure.setResult(object);
        // Envia la respuesta JSON
        return res.json(apiStructure.toResponse());

    } catch (error) {
        // Maneja los errores y establece el estado de error en la estructura de API
        console.error("Error in artiffactsByQuarter:", error);
        apiStructure.setStatus(500, "error", "Error en el servidor al obtener los artefactos");
        return res.json(apiStructure.toResponse());
    }
}
