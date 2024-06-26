// Importaciones siempre llevan al final .js
import { followUserIds } from "../services/followService.js";
import Follow from "../models/follow.js"
import User from "../models/user.js"


// Acciones de prueba
export const testFollow = (req, res) => {
  return res.status(200).send(
    {
      message: "Mensaje enviado desde el controlador: follow.js"
    }
  );
}

// Método para guardar en follow (seguir a otro usuario)
export const saveFollow = async (req, res) => {

  try {
    // Obtener datos del body
    const { followed_user } = req.body;

    // Obtener el id del usuario autenticado (login) desde el token
    const identity = req.user;

    // Verificar si "identity" contiene la información del usuario autenticado
    if (!identity || !identity.userId) {
      return res.status(400).send(
        {
          status: "error",
          message: "No se ha proporcionado el usuario para realizar el following"
        }
      );
    }

    // Verificar si el usuario está intentando seguirse a sí mismo
    if (identity.userId === followed_user) {
      return res.status(400).send(
        {
          status: "error",
          message: "No puedes seguirte a ti mismo"
        }
      );
    }

    // Verificar si el usuario a seguir existe
    const followedUser = await User.findById(followed_user);
    if (!followedUser) {
      return res.status(404).send(
        {
          status: "error",
          message: "El usuario que intentas seguir no existe"
        }
      );
    }

    // Verificar si ya existe un seguimiento con los mismos usuarios una relacion entre los usuarios
    const existingFollow = await Follow.findOne(
      {
        following_user: identity.userId,
        followed_user: followed_user
      }
    );

    if (existingFollow) {
      return res.status(400).send(
        {
          status: "error",
          message: "Ya estás siguiendo a este usuario."
        }
      );
    }

    // Crear el objeto con modelo follow
    const newFollow = new Follow(
      {
        following_user: identity.userId,
        followed_user: followed_user
      }
    );

    // Guardar objeto en la BD
    const followStored = await newFollow.save();

    // Verificar si se guardó correctamente en la BD
    if (!followStored) {
      return res.status(500).send(
        {
          status: "error",
          message: "No se ha podido seguir al usuario."
        }
      );
    }

    // Obtener el nombre y apellido del usuario seguido
    const followedUserDetails = await User.findById(followed_user).select('name last_name');

    if (!followedUserDetails) {
      return res.status(404).send(
        {
          status: "error",
          message: "Usuario seguido no encontrado"
        }
      );
    }

    // Combinar datos de follow y followedUser
    const combinedFollowData = {
      ...followStored.toObject(),
      followedUser: {
        name: followedUserDetails.name,
        last_name: followedUserDetails.last_name
      }
    };

    // Devolver respuesta
    return res.status(200).json(
      {
        status: "success",
        identity: req.user,
        follow: combinedFollowData
      }
    );

  } catch (error) {
    // Error de índice único duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Ya estás siguiendo a este usuario."
      });
    }

    console.log("error al seguir al usuario", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al seguir al usuario"
      }
    );

  }
}

// Método para eliminar un follow (dejar de seguir)
export const unfollow = async (req, res) => {

  try {
    // Obtener el Id del usuario identificado
    const userId = req.user.userId;

    // Obtener el Id del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    // Búsqueda de las conincidencias de ambos usuarios y elimina
    const followDeleted = await Follow.findOneAndDelete(
      {
        // Quien realiza el seguimiento
        following_user: userId,
        // A quien se quiere dejar de seguir
        followed_user: followedId
      }
    );

    // Verificar si se encontró el documento y lo eliminó
    if (!followDeleted) {
      return res.status(404).send(
        {
          status: "Error",
          message: "No se encontró el seguimiento a eliminar"
        }
      );
    }

    // Devolver respuesta
    return res.status(200).json(
      {
        status: "success",
        mesaage: "Dejaste de seguir al usuario correctamente"
      }
    );

  } catch (error) {
    console.log("Error al dejar de seguir el usuario", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al dejar de seguir el usuario"
      }
    );
  }
}

// Método para listar usuarios que estoy siguiendo
export const following = async (req, res) => {

  try {
    // Obtener el ID del usuario identificado | condicional ternario
    let userId = req.user && req.user.userId ? req.user.userId : undefined

    // Comprobar si llega el ID por párametro en la Url (este tiene prioridad)
    if (req.params.id) {      
      userId = req.params.id;

    }

    // Asignar el número de página Comprobar si el número de página me llega por la Url
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;

    // Número de usuarios que queremos mostrar por pagina
    let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 3;

    // Configurar las opciones de la consulta
    // Este metodo al final lena() va ayudar a optimizar el documento, con el metodo populate es como un join en SQL
    const options = {
      page: page,
      limit: itemsPerPage,
      populate: {
        path: "followed_user",
        select: "-password -role -__V -email"
      },
      lean: true
    } 

    // Buscar en la BD los seguidores y popular los datos de los usuarios
    const follows = await Follow.paginate(
      { following_user: userId },
      options
    );

    // Listar los seguidores de un usuario, obtener el array de IDs de los usuarios que sigo
    let followUsers = await followUserIds(req);
    
    // Devolver respuesta
    return res.status(200).send(
      {
        status: "success",
        mesaage: "listado de usuarios que estoy siguiendo",
        follows: follows.docs,
        total: follows.totalDocs,
        pages: follows.totalPages,
        page:follows.page,
        limit: follows.limit,
        users_following: followUsers.following,
        user_follow_me: followUsers.followers
      }
    );

  } catch (error) {
    console.log("Error al listar los usuarios que estan siguiendo", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al listar los usuarios que estan siguiendo"
      }
    );
  }
}

// Método para listar los usuarios que me siguen
export const followers = async (req, res) => {

  try {
    // Obtener el ID del usuario identificado | condicional ternario
    let userId = req.user && req.user.userId ? req.user.userId : undefined

    // Comprobar si llega el ID por párametro en la Url (este tiene prioridad)
    if (req.params.id) {      
      userId = req.params.id;

    }

    // Asignar el número de página Comprobar si el número de página me llega por la Url
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;

    // Número de usuarios que queremos mostrar por pagina
    let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 3;

    // Configurar las opciones de la consulta
    // Este metodo al final lena() va ayudar a optimizar el documento, con el metodo populate es como un join en SQL
    const options = {
      page: page,
      limit: itemsPerPage,
      populate: {
        path: "following_user",
        select: "-password -role -__V -email"
      },
      lean: true
    } 

    // Buscar en la BD los seguidores y popular los datos de los usuarios
    const follows = await Follow.paginate(
      { followed_user: userId },
      options
    );

    // Listar los seguidores de un usuario, obtener el array de IDs de los usuarios que sigo
    let followUsers = await followUserIds(req);
    
    // Devolver respuesta
    return res.status(200).send(
      {
        status: "success",
        mesaage: "listado de usuarios que me siguen",
        follows: follows.docs,
        total: follows.totalDocs,
        pages: follows.totalPages,
        page:follows.page,
        limit: follows.limit,
        users_following: followUsers.following,
        user_follow_me: followUsers.followers
      }
    );

  } catch (error) {
    console.log("Error al listar los usuarios que me siguen", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al listar los usuarios que me siguen"
      }
    );
  }
}