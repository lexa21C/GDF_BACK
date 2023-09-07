// Importar el modelo de documentos, la biblioteca 'mime-types', 
//la estructura de API personalizada y 'zlib' para la compresión
const DocModel = require('../models/Documents.js');
const mime = require('mime-types');
const ApiStructure = require('../helpers/responseApi.js');
const zlib = require('zlib');

// Controlador para obtener un documento por su ID
exports.getDocId = async (req, res) => {
  const id = req.params.id;

  try {
    // Busca el documento en MongoDB por su ID
    const doc = await DocModel.findById(id);

    if (!doc) {
      // Si el documento no existe, devuelve una respuesta con estado 404
      return res.status(404).send('El documento no existe');
    }

    // Descomprimir el buffer del documento (se supone que se comprimió previamente con gzip al almacenarse)
    const uncompressedData = zlib.gunzipSync(doc.doc);

    // Obtener el tipo MIME y la extensión del archivo a partir del contenido almacenado en la base de datos
    const fileExtension = mime.extension(doc.contentType);

    // Establecer las cabeceras de la respuesta para que el navegador interprete el archivo como una descarga
    res.setHeader('Content-Type', doc.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${doc.name}.${fileExtension}`);

    // Enviar el archivo descomprimido como respuesta
    res.send(uncompressedData);
  } catch (error) {
    // Manejo de errores: si ocurre un error, devuelve una respuesta con estado 500 y el mensaje de error
    return res.status(500).send(error);
  }
};

// Controlador para crear un nuevo documento
exports.createDocument = async (req, res) => {
  // Crear una instancia de ApiStructure para manejar la respuesta
  const apiStructure = new ApiStructure();
  try {
    // Obtener los datos del cuerpo de la solicitud, incluido el archivo cargado en 'req.file.buffer'
    let { name, contentType, artiffact, project } = req.body;

    // Comprimir los datos del archivo utilizando gzip
    const compressedData = zlib.gzipSync(req.file.buffer);

    // Crear un nuevo documento en la base de datos con los datos comprimidos
    const document = await DocModel.create({
      name,
      contentType,
      doc: compressedData, // guardar el buffer comprimido directamente en la base de datos
      artiffact,
      project,
    });

    // Establecer el resultado en la estructura de API con el documento creado
    apiStructure.setResult(document);

    // Enviar la respuesta JSON con la estructura de API
    res.json(apiStructure.toResponse());
  } catch (error) {
    apiStructure.setStatus('Error al crear el documento', 500, error.message);
    // Enviar la respuesta JSON con la estructura de API y estado 500
    res.status(500).json(apiStructure.toResponse());
  }
};
