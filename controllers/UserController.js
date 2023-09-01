const User = require("../models/Users.js");
const ApiStructure = require('../helpers/responseApi.js');
const Profile = require("../models/Profiles.js");
const Tematic =  require("../models/Thematic_lines.js")
const { body, validationResult } = require("express-validator");
const { encrypt } = require("../helpers/Bycript");

//Listar usuarios
exports.allUser = async (req, res) => {
  let apiStructure = new ApiStructure();

  const users = await User.find({}).select('-password').populate("type_profile").populate('formation_program').populate('training_center');

  if (users.length > 0) {
    apiStructure.setResult(users);
  } else {
    apiStructure.setStatus(404, "info", "No hay usuarios");
  }
  res.json(apiStructure.toResponse());
};

exports.validate = [
  body("complete_names")
    .escape()
    .notEmpty()
    .matches(/^[A-Za-z0-9 ]+$/),
  body("email", "Invalid email").exists().isEmail(),
];

// Crear usuario
exports.createUser = async (req, res) => {
  let apiStructure = new ApiStructure();
  let { complete_names, email, password, type_profile, thematic_lines, formation_program, training_center } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }

    //* Verificar si el correo electrónico ya existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
    //*devuelve una respuesta de error si el correo no es único

    apiStructure.setStatus("Failed", 400, `El correo electrónico '${email}' ya está registrado`);
  
    }else {
      //* Busca un perfil en la base de datos cuyo campo 'type_profile' coincida con el valor de 'type_profile'
      const r = await Profile.findOne({ type_profile: type_profile });
      //* Asigna el resultado de la búsqueda a la variable 'type_profile
      type_profile =r
    
      //* Cifra la variable 'password' utilizando una función de cifrado y guarda el resultado en 'passwordHash'
      const passwordHash = await encrypt(password);

      //* Crea el usuario si el correo es único
      await User.create({
        complete_names,
        email,
        password: passwordHash,
        type_profile,
        thematic_lines,
        formation_program,
        training_center
      })
      .then((success) => {
        apiStructure.setResult(success, "Usuario Creado Exitosamente");
      })
      .catch((err) => {
        apiStructure.setStatus(
          "Failed",
          400,
          err.message,
        )
      })
    res.json(apiStructure.toResponse());
    }
    }


//Mi Usuario
exports.myUser = async (req, res) => {
  let apiStructure = new ApiStructure();
  let id_user = req.params.id_user;

  const user = await User.findOne({ _id: id_user }).populate('formation_program').populate('training_center').populate('type_profile');

  if (user) {
    apiStructure.setResult(user);
  } else {
    apiStructure.setStatus(404, "info", "El usuario no existe");
  }
  res.json(apiStructure.toResponse());
};

//Actualizar usuario
exports.UpdateUser = async (req, res) => {
  const { complete_names, email, password, type_profile, formation_program } = req.body
  const {id_user} = req.params;
  let apiStructure = new ApiStructure();
  const passwordHash = await encrypt(password);
  await User.findByIdAndUpdate(id_user, {
    complete_names, email, password: passwordHash, type_profile, formation_program
  }).then(async (success) => {
    apiStructure.setResult(success, "Usuario Actualizado Exitosamente")
  }).catch((err) => {
    apiStructure.setStatus(
      "Failed",
      400,
      err.message,
    )
  })
  res.json(apiStructure.toResponse())
}

//Eliminar usuario
exports.deleteUser = async (req, res) => {
  let apiStructure = new ApiStructure();
  let id_user = req.params.id_user;

  const users = await User.findById({ _id: id_user });

  if (users) {
    apiStructure.setResult("Eliminado Satisfactoriamente");
  } else {
    apiStructure.setStatus(404, "info", "No existe el usuario");
  }

  await User.findByIdAndDelete({ _id: id_user });
  res.json(apiStructure.toResponse());
};

exports.ProfileUser = async (req, res) => {
  let apiStructure = new ApiStructure();
  let user = req.body;
  let id_user = req.params.id_user;

  const users = await User.find({ _id: id_user }).populate("type_profile");
  //const users = await User.find(user, {complete_names :0 ,  email : 0, password :0,  _id :0}).populate('type_profile')
  if (users.length > 0) {
    apiStructure.setResult(users);
  } else {
    apiStructure.setStatus(404, "info", "No hay usuarios");
  }

  res.json(apiStructure.toResponse());
};

exports.filterUser = async (req, res) => {
  let apiStructure = new ApiStructure();
  let { buscar, buscarId } = req.params;

  await User.find({ [buscar]: buscarId }).select("email complete_names ")
    .then((success) => {
      if (success.length == 0) {
        apiStructure.setStatus(404, "info", "User null");
      } else {
        apiStructure.setResult(success);
      }
    })
    .catch((err) => {
      apiStructure.setStatus(500, "error", err);
    });
  res.json(apiStructure.toResponse());
};

exports.progrmsFormationUsers = async (req, res) => {
  let apiStructure = new ApiStructure();
  let { id_user } = req.params;
  // const users = await User.findById({ _id:id_user});

  let array = [];
  // for(let i=0;i<users.formation_program.length;i++){
  //     const formationProgram= await Formation_programs.findOne({_id:users.formation_program[i]})

  // }
  function generarNumeros() {
    let numeros = new Set();
    while (numeros.size < 1500) {
      const numero = Math.floor(Math.random() * 90000000) + 10000000;
      numeros.add(numero);
    }
    return Array.from(numeros);
  }

  const numerosGenerados = generarNumeros();
  res.json(numerosGenerados);

  // if (array.length > 0) {
  //   estructuraapi.setResult(array)
  // } else {
  //   estructuraapi.setStatus(404, "info", "No hay Programas de formacion")
  // }
  // res.json(estructuraapi.toResponse());
};

exports.filterFormationPrograms = async (req, res) => {
  let apiStructure = new ApiStructure();
  //let {thematic_line, thematic_line_description} = req.body
  
  // await Tematic.create({thematic_line, thematic_line_description}).then((success) => {
  //   estructuraapi.setResult(success)
  // }).catch((error) => {
  //   estructuraapi.setStatus(500, "No se pudo crear");
  // })
  const {thematic_linesId} = req.params
  const filter = await User.find({thematic_lines:thematic_linesId})
  if (filter.length > 0) {
    apiStructure.setResult(filter);
  } else {
    apiStructure.setStatus(404, "No hay usuarios");
  }
  res.json(apiStructure.toResponse());
};



