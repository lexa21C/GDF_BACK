const Project = require("../../models/Projects.js");
const ApiStructure = require('../../helpers/responseApi.js');

exports.allProjectFormationProgram = async (req, res) => {
  let apiStructure = new ApiStructure();

  try {
    const results = await Project.aggregate([
      {
        $lookup: {
          from: 'records',
          localField: 'record',
          foreignField: '_id',
          as: 'record'
        }
      },
      {
        $unwind: '$record'
      },
      {
        $lookup: {
          from: 'formation_programs',
          localField: 'record.formation_program',
          foreignField: '_id',
          as: 'formation_program'
        }
      },
      {
        $unwind: '$formation_program'
      },
      {
        $group: {
          _id: {
            formation_program_id: '$formation_program._id',
            program_name: '$formation_program.program_name'
          },
          projects: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          programId: '$_id.formation_program_id',
          programName: '$_id.program_name',
          projectsCount: { $size: '$projects' },
          inProcessCount: {
            $size: {
              $filter: {
                input: '$projects',
                as: 'project',
                cond: { $eq: ['$$project.state', 'En proceso'] }
              }
            }
          },
          completedCount: {
            $size: {
              $filter: {
                input: '$projects',
                as: 'project',
                cond: { $eq: ['$$project.state', 'Terminado'] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          programGroups: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          programGroups: {
            $map: {
              input: '$programGroups',
              as: 'group',
              in: {
                programId: '$$group.programId',
                programName: '$$group.programName',
                projectsCount: { $ifNull: ['$$group.projectsCount', 0] },
                inProcessCount: { $ifNull: ['$$group.inProcessCount', 0] },
                completedCount: { $ifNull: ['$$group.completedCount', 0] }
              }
            }
          }
        }
      }
    ]);

    if (results.length > 0) {
      apiStructure.setResult(results[0].programGroups);
    } else {
      apiStructure.setStatus(404, "No existe el Proyecto con ese Programa de Formación");
    }

    res.json(apiStructure.toResponse());
  } catch (error) {
    apiStructure.setStatus(500, "Error al obtener los datos");
    res.json(apiStructure.toResponse());
  }
};

//grafica categorias x proyectos
exports.categoryProject = async (req, res) => {
  try {
    const projects = await Project.find().populate('category');

    // Contar los proyectos por categoría
    const categoryCount = {};
    projects.forEach((project) => {
      project.category.forEach((category) => {
        if (categoryCount[category.name]) {
          categoryCount[category.name].project++;
        } else {
          categoryCount[category.name] = { category: category.name, project: 1 };
        }
      });
    });

    // Convertir el objeto de recuento en un array de objetos
    const result = Object.values(categoryCount);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías de los proyectos.' });
  }
};



