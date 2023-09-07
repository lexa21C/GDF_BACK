// Importar modelos y una estructura de API personalizada
const Competence = require('../models/Competence.js');
const Formation_programs = require('../models/Formation_programs.js');
const ApiStructure = require('../helpers/responseApi.js');

// Controlador para obtener todas las competencias
exports.allCompentences = async (req, res) => {
    // Crear una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();

    // Buscar todas las competencias en la base de datos y convertirlas en objetos JavaScript planos (lean)
    const competences = await Competence.find({}).lean();

    if (competences.length > 0) {
        // Si existen competencias, establecer el resultado en la estructura de API
        apiStructure.setResult(competences);
    } else {
        // Si no hay competencias, establecer un estado 404 en la estructura de API
        apiStructure.setStatus(404, 'No hay competencias');
    }

    // Enviar la respuesta JSON
    res.json(apiStructure.toResponse());
}

// Controlador para obtener una competencia por su ID
exports.competenceId = async (req, res) => {
    // Crear una instancia de ApiStructure para manejar la respuesta
    let apiEstructure = new ApiStructure();
    let id_competences = req.params.id_competence;

    // Buscar una competencia por su ID
    const competence = await Competence.find({ _id: id_competences });

    if (competence) {
        // Si la competencia existe, establecer el resultado en la estructura de API
        apiEstructure.setResult(competence);
    } else {
        // Si la competencia no existe, establecer un estado 404 en la estructura de API
        apiEstructure.setStatus(404, "info", "No existe la competencia");
    }

    // Enviar la respuesta JSON
    res.json(apiEstructure.toResponse());
}

// Controlador para crear una nueva competencia
exports.createCompetences = async (req, res) => {
    // Crear una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();
    let { name, quarter, formation_programs } = req.body;

    let arrayF = [];
    for (let i = 0; i < formation_programs.length; i++) {
        // Buscar programas de formación por nombre y obtener sus ID
        const foundformation_programs = await Formation_programs.findOne({ program_name: formation_programs[i] })

        arrayF.push(foundformation_programs._id)
    }
    formation_programs = arrayF;

    // Crear una nueva competencia en la base de datos
    await Competence.create({ name, quarter, formation_programs })
        .then(async (success) => {
            // Si la competencia se crea correctamente, establecer el resultado en la estructura de API
            apiStructure.setResult(success);
        })
        .catch((err) => {
            // Si no se puede crear la competencia, establecer un estado de error 500 en la estructura de API
            apiStructure.setStatus(
                "NO se pudo registrar la competencia",
                500,
                err._message
            );
        });

    // Enviar la respuesta JSON
    res.json(apiStructure.toResponse());
}

// Controlador para obtener competencias por programa de formación
exports.compoetenceByFormation = async (req, res) => {
    // Crear una instancia de ApiStructure para manejar la respuesta
    let apiStructure = new ApiStructure();
    let { formation_program_id } = req.params
    let formationProgram = await Formation_programs.findById({ _id: formation_program_id });
    
    if (formationProgram != null) {
        const FormArtifacts = []

        let numberQuarter = formationProgram.total_duration / 3;
        const quaterProgram = []
        for (let i = 1; i <= numberQuarter; i++) {
            quaterProgram.push(i)
        }

        // Buscar competencias por programa de formación
        let competence = await Competence.find({
            program: formation_program_id,
        });
        const competenceArray = competence.map((e) => { return e })

        // Agregar datos a la estructura FormArtifacts
        FormArtifacts.push({
            quaters: quaterProgram,
            competences: competenceArray
        })

        // Establecer el resultado en la estructura de API
        apiStructure.setResult(FormArtifacts)

    } else {
        // Si el programa de formación no se encuentra, establecer un estado 404 en la estructura de API
        apiStructure.setStatus(
            404,
            "info",
            "No se encuantra el progrma de formacion"
        );
    }

    // Enviar la respuesta JSON
    res.json(apiStructure.toResponse());
}
