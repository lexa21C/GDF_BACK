// Importa el modelo y el módulo de respuesta API necesarios
const Categories = require('../models/Categories.js');
const estructureApi = require('../helpers/responseApi.js');

// Controlador para obtener todas las categorías
exports.allCategories = async(req, res) => {
    // Crea una instancia de la estructura de API para manejar la respuesta
    let apiEstructure = new estructureApi();

    // Busca todas las categorías en la base de datos
    const categories = await Categories.find({});

    if(categories.length > 0){
        // Si hay categorías, establece el resultado en la estructura de API
        apiEstructure.setResult(categories);
    } else {
        // Si no hay categorías, establece un estado informativo en la estructura de API
        apiEstructure.setStatus(404, "Info", "No hay categorías");
    }

    // Envia la respuesta JSON
    res.json(apiEstructure.toResponse());
}

// Controlador para crear una categoría
exports.createCategory = async (req, res) => {
    // Crea una instancia de la estructura de API para manejar la respuesta
    let apiEstructure = new estructureApi();
    const { name } = req.body;

    try {
        // Comprueba si el nombre de la categoría ya existe en la base de datos (sin distinción entre mayúsculas y minúsculas)
        const existingCategory = await Categories.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (existingCategory) {
            // Devuelve una respuesta de error si el nombre no es único
            apiEstructure.setStatus("Failed", 400, `El nombre de la categoría '${name}' ya existe`);
        } else {
            // Crea la categoría si el nombre es único, convirtiendo el nombre a minúsculas
            await Categories.create({ name: name.toLowerCase() });
            // Establece un mensaje de éxito en la estructura de API
            apiEstructure.setResult(null, "Categoría creada exitosamente");
        }
    } catch (err) {
        // Maneja los errores y establece un estado de error en la estructura de API
        apiEstructure.setStatus("Failed", 400, err.message);
    }

    // Envia la respuesta JSON
    res.json(apiEstructure.toResponse());
};

// Controlador para actualizar una categoría
exports.updateCategory = async (req, res) => {
    // Crea una instancia de la estructura de API para manejar la respuesta
    let apiEstructure = new estructureApi();
    let { id_category } = req.params;
    let { name } = req.body;

    try {
        // Encuentra la categoría por su ID
        const category = await Categories.findById(id_category);

        // Comprueba si el nuevo nombre es diferente del nombre actual (sin distinción entre mayúsculas y minúsculas)
        if (category.name.toLowerCase() !== name.toLowerCase()) {

            // Comprueba si el nuevo nombre ya existe en la base de datos (sin distinción entre mayúsculas y minúsculas)
            const existingName = await Categories.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

            if (existingName) {
                // Devuelve una respuesta de error si el nombre no es único
                apiEstructure.setStatus("Error", 400, `El nombre de la categoría '${name}' ya existe`);
                res.json(apiEstructure.toResponse());
                return;
            }

            // Actualiza el nombre de la categoría
            category.name = name;
            await category.save();
            // Establece un mensaje de éxito en la estructura de API
            apiEstructure.setResult(category, "Categoría actualizada correctamente");
        } else {
            // Si el nombre no ha cambiado, establece un mensaje informativo en la estructura de API
            apiEstructure.setResult(category, "El nombre de la categoría es igual, no se realizó ninguna actualización.");
        }

    } catch (err) {
        // Maneja los errores y establece un estado de error en la estructura de API
        apiEstructure.setStatus("Error", 500, err.message);
    }

    // Envia la respuesta JSON
    res.json(apiEstructure.toResponse());
};

// Controlador para eliminar una categoría
exports.deleteCategory = async (req, res) => {
    // Crea una instancia de la estructura de API para manejar la respuesta
    let apiEstructure = new estructureApi();
    let id_category = req.params.id_category;

    const category = await Categories.findById({ _id: id_category });

    if (category) {
        // Si la categoría existe, establece un mensaje de éxito en la estructura de API
        apiEstructure.setResult("Categoría Eliminada");
    } else {
        // Si la categoría no existe, establece un estado informativo en la estructura de API
        apiEstructure.setStatus(404, "Info", "No existe la categoría");
    }

    // Elimina la categoría por su ID
    await Categories.findByIdAndDelete({ _id: id_category });
    // Envia la respuesta JSON
    res.json(apiEstructure.toResponse());
}
