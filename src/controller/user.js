// importaaciones
import User from "../models/user.js"
import bcrypt from "bcrypt";


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
          {
            email: user_to_save.email.toLowerCase()
          },
          {
            nick: user_to_save.nick.toLowerCase()
          },
        ]
      }
    );

    // si encuentra un usuario, devuelve un mensaje que ya existe
    if (existingUser) {
      return res.status(200).json(
        {
          status: "sucess",
          message: "El usuario ya existe",
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
    return res.status(200).json(
      {
        status: "sucess",
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

// Pruebas****
/* export const register = (req, res) => {
  return res.status(200).json(
    {
      message: "Registro de Usuario Exitoso",
      params
    }
  )
} */