// importaiones deben tener .js
import Publication from "../models/publication.js";

// Acciones de prueba
export const testPublication = (req, res) => {
  return res.status(200).send(
    {
      message: "Mensaje enviado desde el controlador: publication.js"
    }
  );
}

// Metodo para hacer una publicación
export const savePublication = async (req, res) => {

  try {

    // Obtener los datos del body
    const params = req.body;

    // verificar que llegue desde el body el parametro text con su informacion
    if (!params.text) {
      return res.status(400).send(
        {
          status: "error",
          mesaage: "Debes enviar el texto de la publicación "
        }
      );
    }

    // Crear el objeto del modelo
    let newPublication =  new Publication(params);

    // Incluir la información del usuario autenticado al objeto de la nueva publicación
    newPublication.user_id = req.user.userId;

    // Guardar la nueva publicación en la BD
    const publicationStored = await newPublication.save();

    // Verificar si se guardó la publicacion en la BD (si existe publicationStored)
    if (!publicationStored) {
      return res.status(500).send(
        {
          status: "error",
          mesaage: "Noi se guardó la publicación "
        }
      );
    }

    // Devolver respuesta exitosa
    return res.status(200).send(
      {
        status: "success",
        mesaage: "Publicación creada con éxito",
        publicationStored
      }
    );
    
  } catch (error) {
    console.log("Error al crear una publicación", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al crear una publicación"
      }
    );
  }

}

// Método para mostrar la publicación
export const showPublication = async (req, res) => {

  try {
    // Obtener el id de la publicacion de la url
    const publicationId = req.params.id;

    // Buscar la publicación por id desde la BD
    const publicationStored = await Publication.findById(publicationId).populate('user_id', 'name last_name');

    // Verificar si se encontró la publicación
    if (!publicationStored) {
      return res.status(500).send(
        {
          status: "error",
          mesaage: "No existe la publicación"
        }
      );
      
    }

    // devolver la respuesta
    return res.status(200).send(
      {
        status: "success",
        mesaage: "publicado exitosamente",
        publication: publicationStored
      }
    );
    
  } catch (error) {
    console.log("Error al mostrar la publicación", error);
    return res.status(500).send(
      {
        status: "error",
        mesaage: "Error al mostrar la publicación"
      }
    );
  }
}