const Module = require("../models/Modules.js");
const ApiStructure = require("../helpers/responseApi.js");

exports.allModules = async(req, res) => {
    let apistructure = new ApiStructure();

    const module = await  Module.find({})

    if(module.length >0){
        apistructure.setResult(module)
    }else{
        apistructure.setStatus(404, 'info', 'NO hay modulos')
    }

    res.json(apistructure.toResponse())

}

exports.createModules = async (req, res) => {
  let apistructure = new ApiStructure();
  let { path, name, icon, element, layout, auth, sidebar } = req.body;

  await Module.create({ path, name, icon, element, layout, auth, sidebar })
    .then((success) => {
      apistructure.setResult(success);
    })
    .catch((error) => {
      apistructure.setStatus(
        error.parent || error,
        "Error al crear el Modulo",
        error.parent || error
      );
    });

  res.json(apistructure.toResponse());
};

exports.updatesModules = async (req, res) => {
  let apistructure = new ApiStructure();
  let id_module = req.params.id_module;
  let reqModule = req.body;

  const modules = await Module.find({});
  if (modules.length > 0) {
    apistructure.setResult("Siiiiuu");
  } else {
    apistructure.setResult(404, "Info", "No hay categorias");
  }

  await Module.findByIdAndUpdate(id_module, {
    path : reqModule.path,
    name : reqModule.name,
    icon : reqModule.icon,
    element : reqModule.element,
    layout : reqModule.layout,
    auth : reqModule.auth,
    sidebar : reqModule.sidebar
  });

  res.json(apistructure.toResponse());
};
