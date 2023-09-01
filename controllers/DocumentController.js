const DocModel = require('../models/Documents.js');
const mime = require('mime-types');
const ApiStructure = require('../helpers/responseApi.js');
const zlib = require('zlib');

exports.getDocId = async (req, res) => {
  const id = req.params.id;

  try {
    // Busca el documento en MongoDB
    const doc = await DocModel.findById(id);

    if (!doc) {
      return res.status(404).send('El documento no existe');
    }

    // Descomprimir el buffer
    const uncompressedData = zlib.gunzipSync(doc.doc);

    // Obtener tipo MIME y extensión del archivo
    const fileExtension = mime.extension(doc.contentType);

    // Envía el archivo como una descarga
    res.setHeader('Content-Type', doc.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${doc.name}.${fileExtension}`);
    res.send(uncompressedData);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createDocument = async (req, res) => {
  const apiStructure = new ApiStructure();
  try {
    let { name, contentType, artiffact, project } = req.body;
    const compressedData = zlib.gzipSync(req.file.buffer); // comprimir los datos con gzip
    const document = await DocModel.create({
      name,
      contentType,
      doc: compressedData, // guardar el buffer comprimido directamente en la base de datos
      artiffact,
      project,
    });
    apiStructure.setResult(document);
    res.json(apiStructure.toResponse());
  } catch (error) {
    console.error(error);

    apiStructure.setStatus('Error al crear el documento', 500, error.message);
    res.status(500).json(apiStructure.toResponse());
  }
};


