import { following } from "../controller/follow.js";
import Follow from "../models/follow.js"


// Obtenemos un array de IDs de usuarios que yo sigo y que me siguen
export const followUserIds = async (req, res) => {
  try {
    // obtener el ID del usuario autenticado
    const identityUserId = req.user.userId;

    // En caso de llegar el userID
    if (!identityUserId) {
      return res.status(400).send(
        {
          status: "Error",
          message: "Usario no recibido"
        }
      );      
    }

    // Obtener la informacion de los usuarios que estoy siguiendo (el usuario autenticado está siguiendo)
    let following = await Follow.find(
      { "following_user": identityUserId }
    ).select({ "followed_user": 1, "_id": 0 }).exec();
    
    // Obtener el array con la informacion de los usuarios qu me digen a mi (los usuarios que siguen al usuarios autenticado)
    let followers = await Follow.find(
      { "followed_user": identityUserId }
    ).select({ "following_user": 1, "_id": 0 }).exec();

    // Procesar array de identificadores: convertirlos en un array de solo IDS
    const user_following = following.map(follow => follow.followed_user);

    const user_follow_me = followers.map(follow => follow.following_user);

    return {
      following: user_following,
      followers: user_follow_me
    }
    
  } catch (error) {
    // devuelve un objeto vacío
    return {
      following: [],
      followers: []
    };
    
  }
}

// Obtenemos datos de Un Usuario que me esta siguiendo a mi o que yo sigo
export const followThisUser = async (identityUserId, profileUserId) => {

  try {
    // Verificar si los IDs son válidos
    if (!identityUserId || !profileUserId) {
      throw new Error("IDs de los usuarios son inválidos");

    }
 
    // Consultar si yo como usuario identificado ( identityUserID) sigoal otro usuario (profileUSerId)
    const following = await Follow.findOne(
      {
        "following_user": identityUserId,
        "followed_user": profileUserId
      }
    );

    // Consultar si el otro usuario (profileUserId) me sigue a mi o al usuario autenticado (identityUserId)
    const follower = await Follow.findOne(
      {
        "following_user": profileUserId,
        "followed_user": identityUserId
      }
    );

    return {
      following,
      follower
    }
    
  } catch (error) {
    console.log("Error al obtener la informacion de seguimiento", error);

    // Devuelve null si no se sigue
    return {
      following: null,
      follower: null
    }
    
  }
}
