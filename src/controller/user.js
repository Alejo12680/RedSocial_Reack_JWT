// importaaciones
import User from "../models/user.js"
import bcrypt from "bcrypt";
import path from "path";


// Acciones de prueba
export const testUser = (req, res) => {
  return res.status(200).send(
    {
      message: "Mensaje enviado desde el controlador: user.js"
    }
  );
}


// Regisro de usuarios
export const register = async (req, res) => {

  try {
    // Recoger datos de la petición
    let params = req.body;

    // Validar que los datos lleguen correctos y estan obligatorios
    if (!params.name || !params.last_name || !params.email || !params.password || !params.nick) {
      return res.status(400).json(
        {
          status: "error",
          message: "Faltan datos por enviar",
        }
      );
    }

    // Crear una instancia del modelo User  con los datos validados
    let user_to_save = new User(params);

    // Buscar si ya existe un usuario con el mismo email o el nick
    const existingUser = await User.findOne(
      {
        // Condiciones en las que va buscar
        $or: [
          { email: user_to_save.email.toLowerCase() },
          { nick: user_to_save.nick.toLowerCase() },
        ]
      }
    );

    // si encuentra un usuario, devuelve un mensaje que ya existe
    if (existingUser) {
      return res.status(409).json(
        {
          status: "Error",
          message: "El usuario ya existe!",
        }
      )
    }

    // Cifrar contraseñas
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(user_to_save.password, salt);
    user_to_save.password = hasedPassword;

    // Guardar el usuario en la base de datos
    await user_to_save.save();

    // Devolver respuesta de exito y el usuario registrado
    return res.status(201).json(
      {
        status: "created",
        menssage: "Usuario registrado con exito",
        user: user_to_save
      }
    );

    
  } catch (error) {
    console.log("Error en el registro del usuario: ", error);
    return res.status(500).json({
      status: "error",
      message: "Error en registro de usuario"
    });
  }
}

// Método para autenticar usuario
export const login = async (req, res) => {

  try {
    let params = req.body;

    // Valida si llega el email y el password
    if (!params.email || !params.password) {
      return res.status(400).send(
        {
          status: "error",
          message: "Faltan datos por enviar"
        }
      )
    }

    // Buscar en la BD si existe el email que nos envian
    const user = await User.findOne(
      { email: params.email.toLowerCase() }
    );

    // Si no existe el user
    if (!user) {
      return res.status(404).json(
        {
          status: "error",
          message: "Usuario no encontrado"
        }
      );
    }

    // Comprobar si el password recibido es igual al que esta en la BD
    const validPassword = await bcrypt.compare(params.password, user.password);

    // Si los passwords no coinciden
    if (!validPassword) {
      return res.status(401).json(
        {
          status: "error",
          message: "Contraeña incorrecta"
        }
      );
    }

    return res.status(200).json(
      {
        status: "success",
        message: "Prueba de login"
      }
    );

  } catch (error) {
    console.log("Error en el login del usuario", error);
    return res.status(500).json(
      {
        status: "error",
        message: "Error en login del usuario"
      }
    );
  }
}

// Pruebas****
/* export const register = (req, res) => {
  return res.status(200).json(
    {
      message: "Registro de Usuario Exitoso",
      params
    }
  )
} */