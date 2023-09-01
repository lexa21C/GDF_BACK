const Formation_programs = require('../models/Formation_programs.js')
const ApiStructure = require('../helpers/responseApi.js');
const Records = require('../models/Records.js');

exports.all = async (req, res) => {
    let apiStructure = new ApiStructure();

    try {
        const results = await Records.find({});

        if (results.length > 0) {
            apiStructure.setResult(results);
        } else {
            apiStructure.setStatus(404, "No existe la ficha");
        }
    } catch (error) {
        console.log(error);
        apiStructure.setStatus(500, "Error en el servidor");
    }

    res.json(apiStructure.toResponse());
};


exports.allRecords = async (req, res) => {
    let apiStructure = new ApiStructure();

    let { formationPrograms_Id } = req.params

    const results = await Records.find({ formation_program: formationPrograms_Id }).populate('formation_program').populate({
    path: 'user', 
       populate:{
         path: 'training_center'
    }})

    if (results.length > 0) {
        apiStructure.setResult(results)
    } else {
        apiStructure.setStatus(404, 'no Records')
    }
    res.json(apiStructure.toResponse())
}
exports.recordById = async (req, res) => {
    let apiEstructure = new ApiStructure();
    let { idRecord } = req.params;

    const records = await Records.findById({ _id: idRecord });

    if (records) {
        apiEstructure.setResult(records);
    } else {
        apiEstructure.setStatus(404, "No existe el Proyecto Formativo")
    }
    res.json(apiEstructure.toResponse());
}

exports.createRecords = async (req, res) => {
    const { number_record, start_date, finish_date, formation_program, user } = req.body;
    const apiStructure = new ApiStructure();

    try {
        const existingRecord = await Records.findOne({ number_record: number_record });
        if (existingRecord) {
            apiStructure.setStatus("Stop", 400, "Lo sentimos, ya existe una ficha con ese número");
        } else {
            const createdRecord = await Records.create({
                number_record,
                start_date,
                finish_date,
                formation_program,
                user,
            });
            apiStructure.setResult(createdRecord, "Ficha Creada exitosamente");
        }
    } catch (err) {
        apiStructure.setStatus("Failed", 400, err.message);
    }

    res.json(apiStructure.toResponse());
};

exports.updateRecords = async (req, res) => {
    const { number_record, start_date, finish_date, formation_program, user } = req.body
    const { idRecords } = req.params
    let apiStructure = new ApiStructure()

    await Records.findByIdAndUpdate(idRecords, {
        number_record, start_date, finish_date, formation_program, user
    }).then(async (success) => {
        apiStructure.setResult(success, "Ficha actualizada con exito")
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
exports.deleteRecords = async (req, res) => {
    const { idRecords } = req.params
    let apiStructure = new ApiStructure()
    await Records.findByIdAndDelete({ _id: idRecords }).then(async (success) => {
        apiStructure.setResult(success, "successfully Delete")
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
