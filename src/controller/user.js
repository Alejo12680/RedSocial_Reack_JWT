// importaaciones
import User from "../models/user.js"
import bcrypt from "bcrypt";
import path from "path";
import { createToken } from "../services/jwt.js";



// Pruebas****
/* export const register = (req, res) => {
  return res.status(200).json(
    {
      message: "Registro de Usuario Exitoso",
      params
    }
  )
} */

// Acciones de prueba
export const testUser = (req, res) => {
  return res.status(200).send(
    {
      message: "Mensaje enviado desde el controlador: user.js"
    }
  );
}

// Método para Regisro de usuarios
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

// Método para Autenticar usuario
export const login = async (req, res) => {

  try {
    // Recoger los parametros del body
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

    // Generar token de autenticacion 
    const token = createToken(user);

    // Devolver token generado y los datos del usuario
    return res.status(200).json(
      {
        status: "success",
        message: "Login exitoso",
        token,
        user: {
          id: user._id,
          name: user.name,
          last_name: user.last_name,
          bio: user.bio,
          email: user.email,
          nick: user.nick,
          role: user.role,
          image: user.image,
          created_at: user.created_at,
        }
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

// Metodo para mostrar el perfil del usuario
export const profile = async (req, res) => {

  try {
    // Obtener el ID del usuario desde los parametros de la url
    const userId = req.params.id;

    // Buscar el usuario en la base de datos, excluimos la contraseña, rol y version
    const user = await User.findById(userId).select('-password -role -__v');

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).send(
        {
          status: "error",
          message: "Usuario no encontrado"
        }
      );
    }

    // Devolver la informacion del perfil del usuario
    return res.status(200).json(
      {
        status: "success",
        user
      }
    );
    
  } catch (error) {
    console.log("error al obtener el perfil del usuario", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al obtener el perfil del usuario"
      }
    );
    
  }
}

// Método para listar usuarios con paginación
export const listUsers = async (req, res) => {

  try {

    // Controlar en que pagina estamos y el número de items por pagina ternario va ubicar en la pagina 1
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;

    // Query va traer todo el objeto va ubicar 2 usuarios por pagina
    let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 2;

    // Realizar la consulta paginada
    const options = {
      page: page,
      limit: itemsPerPage,
      // No necesito
      select: '-password -role -__v'
    };

    const users = await User.paginate({}, options);

    // Si no hay usuario en la pagina solicitada
    if (!users || users.docs.length === 0) {
      return res.status(404).send(
        {
          status: "error",
          message: "No hay usuarios disponibles"
        }
      )
    }

    // Devolver los usuarios paginados
    return res.status(200).json(
      {
        status: "success",
        users: users.docs,
        totalDocs: users.totalDocs,
        totalPages: users.totalPages,
        page: users.page,
        pagingCounter: users.pagingCounter,
        hasPrevPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        prevPage: users.prevPage,
        nextPage: users.nextPage,
      }
    );
    
  } catch (error) {
    console.log("error al listar los usuarios", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al listar los usuario"
      }
    );
  }
}

// Método para actualizar los datos del usuario
export const updateUSer = async (req, res) => {

  try {

    // Recoger informacion del usuario para actualizar
    let userIdentity = req.user;
    let userToUpdate = req.body;

    // validar que los campos necesario estan presentes
    if (!userToUpdate.email || !userToUpdate.nick) {
      return res.status(400).send(
        {
          status: "Error",
          mesaage: "Los campos email y nick son requeridos"
        }
      )
    }

    // Eliminar campos sobrantes del objeto user
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    // Comprobar si el usuario ya existe
    const users = await User.find(
      {
        $or: [
          {email: userToUpdate.email.toLowerCase() },
          {nick: userToUpdate.nick.toLowerCase() }
        ]
      }
      // ejecuta la consulta
    ).exec();

    // Verifica si el usuario duplicado y evitar conflicto (variable boleana se escribe "is" al inicio)
    const isDuplicateUser = users.some(user => {
      return user && user._id.toString() !== userIdentity.userId

    });

    if (isDuplicateUser) {
      return res.status(400).send(
        {
          status: "Error",
          mesaage: "Solo se puede modificar los datos a usuarios no duplicado"
        }
      )
    }

    // Cifrar la contraseña en el caso de que llegue en la actualización
    if (userToUpdate.password) {
      
      try {
        // Encripta el password recopilado
        let pwd = await bcrypt.hash(userToUpdate.password, 10);
        
        // asigna a userToUpDate el password encriptado
        userToUpdate.password = pwd
        
      } catch (hashError) {
        return res.status(500).send(
          {
            status: "error",
            mesaage: "error al cifrar la contraseña"
          }
        );
      }

      // si no me envio la contraseña se elimina del objeto pero no de la base de datos
    } else {
      delete userToUpdate.password;

    }

    // Buscar y actualizar el usuario modificado
    let userUpDated = await User.findByIdAndUpdate(userIdentity.userId, userToUpdate, {new: true});

    if (!userUpDated) {
      return res.status(400).send(
        {
          status: "error",
          message: "Error al actualizar el usuario"
        }
      );
    }

    // Devolver respuesta exitosa con el usuario actualizado
    return res.status(200).send(
      {
        status: "success",
        message: "Usuario actualizado correctamente!",
        user: userUpDated
      }
    );
    
  } catch (error) {
    console.log("error al actualizar el usuarios", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al listar los usuario"
      }
    );
    
  }
}