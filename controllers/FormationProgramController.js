// Importar modelos y módulos necesarios
const Formation_programs = require("../models/Formation_programs.js")
const estructuraApi = require('../helpers/responseApi.js');
const Competence = require('../models/Competence.js')
const User = require('../models/Users.js')
var Level = require("../models/Program_levels.js")

// Controlador para obtener todos los programas de formación asociados a un usuario por su ID
exports.allFormationProgramIdUser = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let { user_id } = req.params

    // Buscar el usuario por su ID y población de los programas de formación relacionados
    const user = await User.findById({ _id: user_id }).populate({
        path: 'formation_program',
        model: 'Formation_programs',
        populate: [
            {
                path: 'competence',
                model: 'Competences',
                select: '_id labor_competence_code labor_competition labor_competition_version',
            },
            {
                path: 'program_level',
                model: 'Program_levels',
            }
        ],

    })

    // Obtener los niveles de programa disponibles
    const level = await Level.find({})

    // Mapear los programas de formación relacionados con el usuario
    const formation_program = user?.formation_program.map((e) => {
        return e
    })

    if (formation_program?.length > 0) {
        apiEstructure.setResult(formation_program)
    } else {
        apiEstructure.setStatus(404, "info", "No hay usuarios con programas de formación asociados")
    }

    res.json(apiEstructure.toResponse());
}

// Controlador para crear un nuevo programa de formación
exports.createFormstionPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let { program_name, number_quarters, user, competence } = req.body;

    // Buscar la competencia y el usuario por su nombre y correo electrónico respectivamente
    const r = await Competence.findOne({ labor_competition: competence });
    competence = r

    const u = await User.findOne({ email: user });
    user = u

    // Crear un nuevo programa de formación
    await Formation_programs.create({
        program_name, number_quarters, user, competence
    })
        .then((succces) => {
            apiEstructure.setResult(succces)
        })
        .catch((error) => {
            apiEstructure.setStatus(
                error.parent || error,
                "Error al crear un programa de formación",
                error.parent || error
            );
        });

    res.json(apiEstructure.toResponse());
}

// Controlador para obtener un programa de formación por su ID
exports.formation_programsbyid = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;

    const formation_programs = await Formation_programs.find({ _id: id_formation_programs });

    if (formation_programs) {
        apiEstructure.setResult(formation_programs)
    } else {
        apiEstructure.setStatus(404, "info", "No existe el programa de formación")
    }
    res.json(apiEstructure.toResponse())
}

// Controlador para actualizar un programa de formación por su ID
exports.updateFormationPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;
    let reqformation = req.body;

    const formation_programs = await Formation_programs.findById({ _id: id_formation_programs });

    if (formation_programs) {
        apiEstructure.setResult("Actualizado")
    } else {
        apiEstructure.setStatus(404, "Info", "No existe el programa de formación")
    }

    // Actualizar los datos del programa de formación
    await Formation_programs.findByIdAndUpdate(id_formation_programs, {
        name: reqformation.name,
        number_quarters: reqformation.number_quarters
    });
    res.json(apiEstructure.toResponse());
}

// Controlador para eliminar un programa de formación por su ID
exports.deleteFormationPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;

    const formation_programs = await Formation_programs.findById({ _id: id_formation_programs })

    if (formation_programs) {
        apiEstructure.setResult("Eliminado")
    } else {
        apiEstructure.setStatus(404, "info", "No existe el programa de formación")
    }

    // Eliminar el programa de formación por su ID
    await Formation_programs.findByIdAndDelete({ _id: id_formation_programs });
    res.json(apiEstructure.toResponse());
}

// Controlador para obtener los programas de formación asociados a una temática
exports.myformationprograms = async (req, res) => {
    let apiStructure = new estructuraApi();
    let { idformation_programs } = req.params;

    // Buscar programas de formación relacionados con la temática especificada
    const thematics = await Formation_programs.find({ thematic_line: idformation_programs })

    if (thematics.length > 0) {
        apiStructure.setResult(thematics)
    } else {
        apiStructure.setStatus(404, "NOt found")
    }

    res.json(apiStructure.toResponse())
}
