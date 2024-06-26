// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { savePublication, showPublication, testPublication, deletePublication, publicationsUser, uploadMedia, showMedia, feed } from "../controller/publication.js";
import { ensureAuth } from "../middlewares/auth.js";
// Depéndencia para subir archivos
import multer from "multer";
import Publication from "../models/publication.js"
import { checkEntityExists } from "../middlewares/checkEntityExists.js"


// Configuracion que nos sirve para identificar como y donde se van almacenar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // resive la ruta donde se van alojar las imagenes cargadas
    cb(null, "./uploads/publications/");
  },

  filename: (req, file, cb) => {
    // Es el prefijo de cada archivo cargado con la fecha para que el servidor no ponga problema si tiene el mismo nombre
    cb(null, "pub-" + Date.now() + "-" + file.originalname);
  }
});

// Este tambien viene siendo un middleware para subir archivos
const uploads = multer({storage});


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa
router.get('/test-publication', testPublication);
router.post('/publication', ensureAuth, savePublication);

// Se coloca el Id de la "publicacion" que tenemos en la base de datos
router.get('/show-publication/:id', ensureAuth, showPublication);

router.delete('/delete-publication/:id', ensureAuth, deletePublication);

router.get('/publications-user/:id/:page?', ensureAuth, publicationsUser);

// subir archivos, el campo file0 es para postman y lleva el ID de la publicación
router.post('/upload-media/:id', [ensureAuth, checkEntityExists(Publication, 'id'), uploads.single("file0")], uploadMedia);

// Se quita el enpoint porque no se requiere doble autenticación
router.get('/media/:file', showMedia);

router.get('/feed/:page?', ensureAuth, feed);


// Exportar el Router
export default router;