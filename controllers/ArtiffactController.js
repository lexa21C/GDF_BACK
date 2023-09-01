const Learning_results = require("../models/Learning_results.js")
const ApiStructure = require('../helpers/responseApi.js')
const Artiffacts = require('../models/Artiffacts.js')
const Quarters = require('../models/Quarters.js')
const Documents = require('../models/Documents.js')
const Records = require('../models/Records.js')

exports.allArtiffacts = async (req, res) => {
    const apiStructure = new ApiStructure();
    const { recordId, projectId } = req.params;

    try {
        // Obtener todos los trimestres y sus artefactos
        const record = await Records.findById(recordId);

        const quarters = await Quarters.find({ formation_program: record.formation_program }).lean();

        const array = [];
        for (let quarter of quarters) {
            const artiffacts = await Artiffacts.find({ quarter: quarter._id }).populate('quarter')
            array.push(...artiffacts)
        }

        // Obtener todos los artefactos y sus documentos
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

            //   const filtered = records.filter(record => record.movementType);.lean();
            // Si el artefacto no tiene documentos, lo agregamos al arrayD
            if (documents.length === 0) {
                arrayD.push(array[i])
            } else {
                arrayD.push(...documents)
            }

        }

        apiStructure.setResult({ artiffacts: arrayD });
        return res.json(apiStructure.toResponse());
    } catch (err) {
        apiStructure.setStatus(
            "Falied",
            400,
            err.message,
        )
        return res.json(apiStructure.toResponse());
    }
}

// listar por ID
exports.artiffactById = async (req, res) => {
    let apiStructure = new ApiStructure();
    let id_artiffact = req.params.id_artiffact;

    const artiffact = await Artiffacts.findById({ _id: id_artiffact }).populate('competence').populate('quarter');

    if (artiffact) {
        apiStructure.setResult(artiffact)
    } else {
        apiStructure.setStatus(404, "No Existe el Artefacto")
    }
    res.json(apiStructure.toResponse());
}

// Crear artefacto
exports.createArtiffacts = async (req, res) => {
    const { body } = req;
    let apiStructure = new ApiStructure();

    if ('project' in body && body.project.length === 0) {
        delete req.body.project;
    }

   // Convertir el nombre a minúsculas y capitalizar la primera letra
    const formattedName = body.name.charAt(0).toUpperCase() + body.name.slice(1).toLowerCase();

   // Verificar si el nombre ya existe en la base de datos
    const existingArtiffact = await Artiffacts.findOne({ name: formattedName });
          if (existingArtiffact) {
              apiStructure.setStatus("Failed", 400, `El Nombre del Artefacto '${formattedName}' Ya Existe`);
        } else {
    // Actualizar el nombre formateado en el objeto antes de crearlo
    body.name = formattedName;

    // Si el nombre no existe, proceder con la creación
     await Artiffacts.create(body).then((success) => {
        apiStructure.setResult(success, "Artefacto creado con exito");
     }).catch((err) => {
        apiStructure.setStatus(
            "Failed",
            400,
            err.message,
          )
        })
        }
    res.json(apiStructure.toResponse());
};

exports.updateArtiffacts = async (req, res) => {
    const { name, description } = req.body
    const { idArtiffacts } = req.params
    let apiStructure = new ApiStructure()

    await Artiffacts.findByIdAndUpdate(idArtiffacts, {
        name, description
    }).then(async (success) => {
        apiStructure.setResult(success, "Artefacto actualizado   correctamente")
    }).catch((err) => {
        apiStructure.setStatus(
            "Falied",
            400,
            err._message,
        )
    }
    );
    res.json(apiStructure.toResponse())
}
exports.deleteArtifact = async (req, res) => {
    const { idArtiffacts } = req.params
    let apiStructure = new ApiStructure()
    await Artiffacts.findByIdAndDelete({ _id: idArtiffacts }).then(async (success) => {
        apiStructure.setResult(success, "Artefacto eliminado Correctamente")
    }).catch((err) => {
        apiStructure.setStatus(
            "Falied",
            400,
            err._message,
        )
    } );
    res.json(apiStructure.toResponse())
}
exports.artiffactsByQuarter = async (req, res) => {
    let apiStructure = new ApiStructure()
    try {
        const { quarterId } = req.params
        const artiffacts = await Artiffacts.find({ quarter: quarterId }).lean()
        const QuarteByCompetence = await Quarters.findById(quarterId).lean().populate('competence')
        if (!artiffacts) {
            apiStructure.setStatus(
                "info",
                202,
                "no artiffact in List",
            )
            return res.json(apiStructure.toResponse())
        }
        // const competence = QuarteByCompetence.map((item) => {
        //     return item.competence
        // })
        const object = {
            artiffacts: artiffacts,
            competence: QuarteByCompetence.competence
        }
        apiStructure.setResult(object)
        return res.json(apiStructure.toResponse())

    } catch {
        (error) => {
            console.error("Error in artiffactsByQuarter:", error);
            apiStructure.setStatus(500, "error", "Error get in server");
            return res.json(apiStructure.toResponse());
        }
    }
} 