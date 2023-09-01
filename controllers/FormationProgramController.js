const Formation_programs = require("../models/Formation_programs.js")
const estructuraApi = require('../helpers/responseApi.js');
const Competence = require('../models/Competence.js')
const User = require('../models/Users.js')
var Level=require("../models/Program_levels.js")

exports.allFormationProgramIdUser = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let { user_id } = req.params
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
    const level=await Level.find({})
    const formation_program = user?.formation_program.map((e) => {
        return e
    })

    if (formation_program?.length > 0) {
        apiEstructure.setResult(formation_program)
    } else {
        apiEstructure.setStatus(404, "info", "No hay usuarios con el Programas de formacion")
    }

    res.json(apiEstructure.toResponse());
}

exports.createFormstionPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let { program_name, number_quarters, user, competence } = req.body;

    const r = await Competence.findOne({ labor_competition: competence });
    competence = r

    const u = await User.findOne({ email: user });
    user = u

    await Formation_programs.create({
        program_name, number_quarters, user, competence
    })
        .then((succces) => {
            apiEstructure.setResult(succces)
        })
        .catch((error) => {
            apiEstructure.setStatus(
                error.parent || error,
                "Error al crear un programa de formacion",
                error.parent || error
            );
        });

    res.json(apiEstructure.toResponse());
}

exports.formation_programsbyid = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;


    const formation_programs = await Formation_programs.find({ _id: id_formation_programs });

    if (formation_programs) {
        apiEstructure.setResult(formation_programs)
    } else {
        apiEstructure.setStatus(404, "info", "No existe el programa de formacion")
    }
    res.json(apiEstructure.toResponse())
}

exports.updateFormationPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;
    let reqformation = req.body;

    const formation_programs = await Formation_programs.findById({ _id: id_formation_programs });

    if (formation_programs) {
        apiEstructure.setResult("Actualizado")
    } else {
        apiEstructure.setStatus(404, "Info", "No existe el prgrama de formacion")
    }

    await Formation_programs.findByIdAndUpdate(id_formation_programs, {
        name: reqformation.name,
        number_quarters: reqformation.number_quarters
    });
    res.json(apiEstructure.toResponse());
}

exports.deleteFormationPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;

    const formation_programs = await Formation_programs.findById({ _id: id_formation_programs })
    if (formation_programs) {
        apiEstructure.setResult("Eliminado")
    } else {
        apiEstructure.setStatus(404, "info", "NO existe el usuario")
    }

    await Formation_programs.findByIdAndDelete({ _id: id_formation_programs });
    res.json(apiEstructure.toResponse());

}

// exports.formationsProgrmasUser=async(req,res)=>{
//     let apiEstructure = new estructuraApi();
//     let {programs}=req.params
//     const formation_programs = await Formation_programs.find({_id: programs})
//     if(formation_programs.length >0){
//         apiEstructure.setResult(formation_programs)
//     }else{
//         apiEstructure.setStatus(404, "info", "No hay Programas de formacion")
//     }

//     res.json(apiEstructure.toResponse());
// }

exports.myformationprograms = async (req, res) => {
    let apiStructure = new estructuraApi();
    let { idformation_programs } = req.params;

    const thematics = await Formation_programs.find({ thematic_line: idformation_programs })
    if (thematics.length > 0) {
        apiStructure.setResult(thematics)
    } else {
        apiStructure.setStatus(404, "NOt found")
    }

    res.json(apiStructure.toResponse())
}