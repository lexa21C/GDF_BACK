const Project = require("../models/Projects.js"); 
const estructureApi = require("../helpers/responseApi.js");
const Category = require("../models/Categories.js")
const Record = require("../models/Records.js");
const { body, validationResult } = require('express-validator');

// Controlador para obtener todos los proyectos
exports.allProjects = async (req, res) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();

    try {
        // Buscar todos los proyectos en la base de datos
        const results = await Project.find({});

        if (results.length > 0) {
            // Establecer el resultado en la estructura de respuesta API
            apiEstructure.setResult(results);
        } else {
            // Establecer un estado de respuesta 404 si no hay proyectos encontrados
            apiEstructure.setStatus(404, "No existe el proyecto");
        }
    } catch (error) {
        // Capturar y manejar errores de servidor
        console.log(error);
        apiEstructure.setStatus(500, "Error en el servidor");
    }

    // Enviar la respuesta JSON al cliente
    res.json(apiEstructure.toResponse());
}

// Controlador para obtener todos los proyectos asociados a registros
exports.allProjectsByRecords = async (req, res) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();

    // Obtener el ID del registro a partir de los parámetros de la solicitud
    let {record_id} = req.params;
    
    // Buscar proyectos que estén relacionados con el registro especificado
    const results = await Project.find({ record: record_id })
    // Utilizar populate para obtener información adicional de las referencias en el modelo de proyecto
    .populate({
        path: 'record',
        populate: {
            path: 'user',
            model: 'Users',
            // Continuar anidando poblaciones para obtener información detallada
            populate:{
                path: 'formation_program',
                model: 'Formation_programs',
                populate: {
                    path: 'competence',
                    model: 'Competences',
                    select: '_id labor_competence_code labor_competition labor_competition_version'
                }
            }
        }
    })
    .populate('category');

    // Comprobar si se encontraron proyectos relacionados con el registro
    if (results.length > 0) {
        // Establecer el resultado en la estructura de respuesta API
        apiEstructure.setResult(results);
    } else {
        // Establecer un estado de respuesta 404 si no existen proyectos relacionados
        apiEstructure.setStatus(404, "No existe el Proyecto Formativo")
    }

    // Enviar la respuesta JSON al cliente
    res.json(apiEstructure.toResponse());
};




exports.validate = [
    body('name').trim().notEmpty().withMessage('El campo "name" es obligatorio.'), 
    body('state').trim().notEmpty().withMessage('El campo "state" es obligatorio.'),
    body('problem_statement').trim().notEmpty().withMessage('El campo "problem_statement" es obligatorio.'),
    body('project_justification').trim().notEmpty().withMessage('El campo "project_justification" es obligatorio.'),
    body('general_objective').trim().notEmpty().withMessage('El campo "general_objective" es obligatorio.'),
    body('specific_objectives').notEmpty().withMessage('El campo "specific_objectives" es obligatorio.'),
    body('scope_feasibility').trim().notEmpty().withMessage('El campo "scope_feasibility" es obligatorio.'),
    body('project_summary').trim().notEmpty().withMessage('El campo "project_summary" es obligatorio.'),
    body('technological_research').trim().notEmpty().withMessage('El campo "technological_research" es obligatorio.'),
    body('glossary').notEmpty().withMessage('El campo "glossary" es obligatorio.'),
    body('date_presentation').trim().notEmpty().withMessage('El campo "date_presentation" es obligatorio.'),
    body('approval_date').trim().notEmpty().withMessage('El campo "approval_date" es obligatorio.'),
]


// Crear Proyecto
exports.createProject = async (req, res) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();

    // Obtener los datos del proyecto del cuerpo de la solicitud
    let { name, state, problem_statement, project_justification, general_objective,
        specific_objectives, scope_feasibility, project_summary, technological_research,
        glossary, date_presentation, approval_date, category, record } = req.body;

    // Validar los datos del proyecto utilizando express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Si hay errores de validación, establecer un estado de respuesta con el detalle de los errores
        apiEstructure.setStatus(
            "Failed",
            400,
            errors.array()
        );
        res.json(apiEstructure.toResponse());
    } else {
        try {
            // Verificar si el nombre del proyecto ya existe en la base de datos
            const existingProject = await Project.findOne({ name });

            if (existingProject) {
                // Si el nombre del proyecto ya existe, establecer un estado de respuesta con un mensaje de error
                apiEstructure.setStatus("Failed", 400, `El nombre del proyecto '${name}' Ya Existe`);
            } else {
                let arrayC = [];
                const arrayCategories = Array.isArray(category);

                if (arrayCategories) {
                    for (let i = 0; i < category.length; i++) {
                        // Buscar y agregar el ID de la categoría al arreglo
                        const foundcategory = await Category.findOne({ name: category[i] });
                        arrayC.push(foundcategory._id);
                    }
                    category = arrayC;
                } else {
                    // Buscar y asignar el ID de la categoría si no es un arreglo
                    const f = await Category.findOne({ name: category });
                    category = f;
                }

                // Buscar y asignar el registro relacionado al proyecto
                const r = await Record.findOne({ number_record: record });
                record = r;

                // Crear el nuevo proyecto con los datos proporcionados
                const newProject = await Project.create({
                    name, state, problem_statement, project_justification, general_objective,
                    specific_objectives, scope_feasibility, project_summary, technological_research,
                    glossary, date_presentation, approval_date, category, record
                });

                // Establecer el resultado y un mensaje de éxito en la estructura de respuesta API
                apiEstructure.setResult(newProject, "Proyecto creado Exitosamente");
            }
        } catch (err) {
            // Si ocurre un error durante la creación del proyecto, establecer un estado de respuesta con el mensaje de error
            apiEstructure.setStatus("Failed", 500, err.message);
        }

        // Enviar la respuesta JSON al cliente
        res.json(apiEstructure.toResponse());
    }
};



// Obtener proyecto por ID
exports.projectById = async (req, res) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();
    
    // Obtener el ID del proyecto de los parámetros de la solicitud
    let id_project = req.params.id_project;

    // Buscar el proyecto en la base de datos por su ID y poblamos la categoría relacionada
    const project = await Project.findById({ _id: id_project }).populate("category");

    if (project) {
        // Si se encuentra el proyecto, establecer el resultado en la estructura de respuesta
        apiEstructure.setResult(project);
    } else {
        // Si no se encuentra el proyecto, establecer un estado de respuesta con un mensaje de error
        apiEstructure.setStatus(404, "No existe el Proyecto Formativo")
    }

    // Enviar la respuesta JSON al cliente
    res.json(apiEstructure.toResponse());
}


// Actualizar proyecto por ID
exports.updateProjects = async (req, res) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();

    // Obtener el ID del proyecto de los parámetros de la solicitud
    let id_project = req.params.id_project;

    // Obtener los datos actualizados del proyecto de la solicitud
    let reqproject = req.body;

    // Buscar el proyecto en la base de datos por su ID
    const project = await Project.findById({ _id: id_project });

    if (project) {
        // Si se encuentra el proyecto, establecer un mensaje de éxito en la estructura de respuesta
        apiEstructure.setResult("Proyecto Actualizado! Exitosamente ")
    } else {
        // Si no se encuentra el proyecto, establecer un estado de respuesta con un mensaje de error
        apiEstructure.setStatus(404, "Info", "No existe el Proyecto")
    }

    let arrayC = [];
    const arrayCategories = Array.isArray(reqproject.category);

    if (arrayCategories) {
        if (reqproject.category[0].name != null) {
            for (let i = 0; i < reqproject.category.length; i++) {
                const foundcategory = await Category.findOne({ name: reqproject.category[i].name });
                arrayC.push(foundcategory._id)
            }
        } else {
            for (let i = 0; i < reqproject.category.length; i++) {
                const foundcategory = await Category.findOne({ name: reqproject.category[i] });
                arrayC.push(foundcategory._id)
            }
        }

        reqproject.category = arrayC
    } else {
        const f = await Category.findOne({ name: reqproject.category });
        reqproject.category = f._id
    }

    // Actualizar el proyecto en la base de datos
    await Project.findByIdAndUpdate(id_project, {
        name: reqproject.name,
        state: reqproject.state,
        problem_statement: reqproject.problem_statement,
        project_justification: reqproject.project_justification,
        general_objective: reqproject.general_objective,
        specific_objectives: reqproject.specific_objectives,
        scope_feasibility: reqproject.scope_feasibility,
        project_summary: reqproject.project_summary,
        technological_research: reqproject.technological_research,
        glossary: reqproject.glossary,
        date_presentation: reqproject.date_presentation,
        approval_date: reqproject.approval_date,
        category: reqproject.category
    }).then(async (success) => {
        // Si la actualización se realiza con éxito, establecer el resultado en la estructura de respuesta
        apiEstructure.setResult(success, "Proyecto Actualizado! Exitosamente ")
    }).catch((err) => {
        // Si se produce un error durante la actualización, establecer un estado de respuesta con un mensaje de error
        apiStructure.setStatus(
            "Falied",
            400,
            err._message,
        )
    });

    // Enviar la respuesta JSON al cliente
    res.json(apiEstructure.toResponse());
}

// Eliminar proyecto por ID
exports.deleteProject = async (req, res) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();

    // Obtener el ID del proyecto de los parámetros de la solicitud
    let id_project = req.params.id_project;

    // Buscar el proyecto en la base de datos por su ID
    const project = await Project.findById({ _id: id_project });

    if (project) {
        // Si se encuentra el proyecto, establecer un mensaje de éxito en la estructura de respuesta
        apiEstructure.setResult("Proyecto Eliminado")
    } else {
        // Si no se encuentra el proyecto, establecer un estado de respuesta con un mensaje de error
        apiEstructure.setStatus(404, "Info", "No existe el proyecto")
    }

    // Eliminar el proyecto de la base de datos utilizando `Project.findByIdAndDelete`
    await Project.findByIdAndDelete({ _id: id_project });

    // Enviar la respuesta JSON al cliente
    res.json(apiEstructure.toResponse());
}

// Buscar proyectos por nombre y categorías
exports.searchProject = async (req, res) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();

    // Obtener los datos de búsqueda de la solicitud (nombre y categorías)
    const { name, categories } = req.body;

    // Buscar las categorías por nombre en la base de datos
    const category_name = await Category.find({ name: categories })

    const id = [];

    if (categories.length > 0) {
        // Si se proporcionaron categorías en la búsqueda, realizar una búsqueda de proyectos
        // que coincidan con el nombre y tengan una categoría en la lista de categorías
        Project.find(
            { name: { $regex: new RegExp(name, 'i') } }
        )
            .populate('category').then((project) => {
                project.forEach((data) => {
                    id.push(data.id);
                });
                // Llamar a la función SearchCategory para refinar la búsqueda
                SearchCategory(res, id, category_name);
            })
            .catch((error) => {
                // Si se produce un error, establecer un estado de respuesta con un mensaje de error
                apiEstructure.setStatus(404, "No existe el proyecto", error);
            });
    } else {
        // Si no se proporcionaron categorías en la búsqueda, realizar una búsqueda de proyectos
        // que coincidan solo con el nombre
        Project.find(
            { name: { $regex: new RegExp(name, 'i') } }
        )
            .populate('category').then((project) => {
                // Establecer el resultado de la búsqueda en la estructura de respuesta
                apiEstructure.setResult(project);
            })
            .catch((error) => {
                // Si se produce un error, establecer un estado de respuesta con un mensaje de error
                apiEstructure.setStatus(404, "Info", "No existe el proyecto", error);
            });
        // Enviar la respuesta JSON al cliente
        res.json(apiEstructure.toResponse());
    }
}

// Función para refinar la búsqueda por categorías
const SearchCategory = async (res, idProject, a) => {
    // Crear una estructura de respuesta API
    let apiEstructure = new estructureApi();
    var o = [];

    for (let i = 0; i < idProject.length; i++) {
        o.push(
            await Project.find({ _id: idProject, category: a[i] }).populate('category')
        );
        apiEstructure.setResult(o, "Búsqueda exitosa");
    }

    // Enviar la respuesta JSON al cliente
    res.json(apiEstructure.toResponse());
}
