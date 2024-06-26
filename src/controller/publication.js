// importaiones deben tener .js
import Publication from "../models/publication.js";
import fs from "fs";
import path from "path";
import { followUserIds } from "../services/followService.js";



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
    let newPublication = new Publication(params);

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

// Método para eliminar una publicación
export const deletePublication = async (req, res) => {
  try {

    // Obtenemos el id de la publicacion que se quiere eliminar
    const publicationId = req.params.id;

    // Encontrar y eliminar la publicación
    const publicationDelete = await Publication.findOneAndDelete(
      {
        user_id: req.user.userId,
        _id: publicationId
      }
    ).populate('user_id', 'name last_name');

    // Verificar si se encontró y eliminó la publicación
    if (!publicationDelete) {
      return res.status(404).send({
        status: "Error",
        message: "No se ha encontrado o no tienes permiso para eliminar esta publicación"
      });
    }

    // Devolver respuesta exitosa 
    return res.status(200).send({
      status: "success",
      message: "Publicación eliminada con éxito",
      publication: publicationDelete
    });

  } catch (error) {
    console.log("Error al mostrar la publicación:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al eliminar la publicación"
    });
  }
}

// Método para listar publicaciones de un usuario
export const publicationsUser = async (req, res) => {
  try {

    // obtener el id del usuario
    const userId = req.params.id;

    // Asignar el número de página Comprobar si el número de página me llega por la Url
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;

    // Número de usuarios que queremos mostrar por pagina
    let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 3;

    // Configurar las opciones de la consulta
    const options = {
      page: page,
      limit: itemsPerPage,
      // Me va ordenar de mayor a menor (más Resiente a la más vieja)
      sort: {
        create_at: -1
      },
      populate: {
        path: 'user_id',
        select: '-password -role -__v -email'
      },
      lean: true
    };

    // Buscar las publicaciones del usuario
    const publications = await Publication.paginate({
      user_id: userId
    }, options);

    if (!publications.docs || publications.docs.length <= 0) {
      return res.status(500).send({
        status: "error",
        message: "No hay publicaciones para mostrar"
      });
    }

    // Devolver respuesta
    return res.status(200).send(
      {
        status: "success",
        mesaage: "Publicaciones del usuario",
        publications: publications.docs,
        total: publications.totalDocs,
        pages: publications.totalPages,
        page: publications.page,
        limit: publications.limit
      }
    );

  } catch (error) {
    console.log("Error al mostrar la publicación:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al listar las publicación"
    });
  }
}

// Método para subir archivos (imagen a las publicaciones que hacemos)
export const uploadMedia = async (req, res) => {
  try {
    // Obtener el id de la publicación
    const publicationId = req.params.id;

    // Verificar si la publicación existe en la base de datos antes de subir el archivo
    const publicationExists = await Publication.findById(publicationId);
    if (!publicationExists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la publicación"
      });
    }

    // Comprobamos que existe el archivo en el body
    if (!req.file) {
      return res.status(404).send({
        status: "error",
        message: "La petición no incluye la imagen"
      });
    }

    // Obtener el nombre del archivo
    let image = req.file.originalname;
    
    // Obtener la extensión del archivo
    const imageSplit = image.split(".");
    const extension = imageSplit[imageSplit.length -1];

    // Validar la extensión
    if (!["png", "jpg", "jpeg", "gif"].includes(extension.toLowerCase())){
      //Borrar archivo subido
      const invalidFilePath = req.file.path;
      fs.unlinkSync(invalidFilePath );

      return res.status(400).send({
        status: "error",
        message: "Extensión del archivo es inválida."
      });
    }

    // Comprobar tamaño del archivo (pj: máximo 1MB)
    const fileSize = req.file.size;
    const maxFileSize = 1 * 1024 * 1024; // 1 MB

    if (fileSize > maxFileSize) {
      const largeFilePath = req.file.path;
      fs.unlinkSync(largeFilePath );

      return res.status(400).send({
        status: "error",
        message: "El tamaño del archivo excede el límite (máx 1 MB)"
      });
    }

    // Verificar si el archivo realmente existe antes de proceder
    const actualFilePath  = path.resolve("./uploads/publications/", req.file.filename);
    try {
      fs.statSync(actualFilePath); 
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "El archivo no existe o hubo un error al verificarlo"
      });
    }

    // Si todo es correcto, se procede a guardar en la BD
    const publicationUpdated = await Publication.findOneAndUpdate(
      { user_id: req.user.userId, _id: publicationId },
      { file: req.file.filename },
      { new: true }
    );

    if (!publicationUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error en la subida del archivo"
      });
    }

    // Devolver respuesta exitosa
    return res.status(200).send({
      status: "success",
      message: "Archivo subido con éxito",
      publication: publicationUpdated,
      file: req.file
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al subir el archivo a la publicación"
    });
  }
}

// Método para mostrar el archivo subido a la publicación
export const showMedia = async (req, res) => {

  try {
    // Obtener el parámetro del archivo desde la url
    const file = req.params.file;

    // Crear el path real de la imagen
    const filePath = "./uploads/publications/" + file;

    // COmprobar si existe el archivo
    fs.stat(filePath, (error, exists) => {
      if (!exists) {
        return res.status(404).send({
          status: "error",
          message: "No existe la imagen"
        });
      }

      // Si lo encuetra nos devolvueve un archivo
      return res.sendFile(path.resolve(filePath));
    });

  } catch (error) {
    console.log("Error No se mostró el archivo:", error);
    return res.status(500).send({
      status: "error",
      message: "Error No se mostró el archivo"
    });
  }
}

// Método para listar todas las publicaciones de los usuarios que yo sigo (Feed)
export const feed = async (req, res) => {
  try {

    // Asignar el número de página Comprobar si el número de página me llega por la Url
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;

    // Número de publicaciones que queremos mostrar por pagina
    let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 3;

    // Verificar que el usuario autenticado existe y tiene un userId
    if (!req.user || !req.user.userId) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no autenticado"
      });
    }

    // Obtener un array de IDs de los usuarios que sigue el usuario autenticado
    const myFollows = await followUserIds(req);

    // Verificae que la lista de usuarios que sigo no esté vacia
    if (!myFollows.following || myFollows.following.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No sigues a ningun usuario, no hay publicaciones que mostrar"
      });
    }

    // Configurar las options de la consulta
    const options = {
      page: page,
      limit: itemsPerPage,
      // Me va ordenar de mayor a menor (más Resiente a la más vieja)
      sort: {
        create_at: -1
      },
      populate: {
        path: 'user_id',
        select: '-password -role -__v -email'
      },
      lean: true
    };

    // Consulta a la base de datos con paginate (in) es que contenga el usuario
    const result = await Publication.paginate(
      {
        user_id: {
          $in: myFollows.following
        }
      },
      options
    )

    // Verificar si se encontraron publicaciones en la base de datos
    if (!result.docs || result.docs.length <= 0) {
      return res.status(404).send({
        status: "error",
        message: "No hay publicaciones para mostrar"
      });

    }

    // Devolver respuesta
    return res.status(200).send(
      {
        status: "success",
        message: "Feed de Publicaciones",
        publications: result.docs,
        total: result.totalDocs,
        pages: result.totalPages,
        page: result.page,
        limit: result.limit
      }
    );

  } catch (error) {
    console.log("Error al mostrar las publicaciones en el feed ", error);
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar las publicaciones en el feed"
    });
  }
}