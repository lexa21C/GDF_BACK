const Categories = require('../models/Categories.js');
const estructureApi = require('../helpers/responseApi.js');

exports.allCategories = async(req, res) => {
    let apiEstructure = new estructureApi();

    const categories = await Categories.find({})

    if(categories.length > 0){
    apiEstructure.setResult(categories)
}else {
    apiEstructure.setStatus(404, "Info", "No hay categorias")
}

res.json(apiEstructure.toResponse());
}
exports.createCategory = async (req, res) => {
  let apiEstructure = new estructureApi();
  const { name } = req.body;

  try {
   //^ Comprobar si el nombre de la categoría ya existe en la base de datos (sin distinción entre mayúsculas y minúsculas)
    const existingCategory = await Categories.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingCategory) {
      //^ Devuelve una respuesta de error si el nombre no es único
      apiEstructure.setStatus("Failed", 400, `El nombre de la categoría '${name}' ya existe`);
    } else {
      //^ Crea la categoría si el nombre es único
      await Categories.create({ name: name.toLowerCase() }); //^ Convierte el nombre de la categoría a minúsculas
      apiEstructure.setResult(null, "Categoría creada exitosamente");
    }
  } catch (err) {
    apiEstructure.setStatus("Failed", 400, err.message);
  }

  res.json(apiEstructure.toResponse());
};


exports.updateCategory = async (req, res) => {
  let apiEstructure = new estructureApi();
  let { id_category } = req.params;
  let { name } = req.body;

  try {
    //* Encuentra la categoría por su ID
    const category = await Categories.findById(id_category);

   //* Comprobar si el nuevo nombre es diferente del nombre actual (sin distinción entre mayúsculas y minúsculas)
    if (category.name.toLowerCase() !== name.toLowerCase()) {

   //* Comprobar si el nuevo nombre ya existe en la base de datos (sin distinción entre mayúsculas y minúsculas)
      const existingName = await Categories.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

      if (existingName) {
        apiEstructure.setStatus("Error", 400, `El nombre de la categoría '${name}' ya existe`);
        res.json(apiEstructure.toResponse());
        return;
      }
   //* Actualizar el nombre de la categoría
      category.name = name;
      await category.save();
      apiEstructure.setResult(category, "Categoría actualizada correctamente");
    } else {
      apiEstructure.setResult(category, "El nombre de la categoría es igual, no se realizó ninguna actualización.");
    }

    res.json(apiEstructure.toResponse());
  } catch (err) {
    apiEstructure.setStatus("Error", 500, err.message);
    res.json(apiEstructure.toResponse());
  }
};


exports.deleteCategory = async (req, res) => {
    let apiEstructure = new estructureApi();
    let id_category = req.params.id_category;

    const category = await Categories.findById({ _id: id_category});
    
    if(category){
        apiEstructure.setResult("Categoria Eliminada")
    }else {
        apiEstructure.setStatus(404, "Info", "No existe la categoria")
    }
    await Categories.findByIdAndDelete({ _id: id_category})
    res.json(apiEstructure.toResponse());

}