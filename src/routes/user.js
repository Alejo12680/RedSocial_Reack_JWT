// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { testUser, register, login, profile, listUsers, updateUSer, uploadFiles, avatar, counters } from "../controller/user.js";
import { ensureAuth } from "../middlewares/auth.js";
// Depéndencia para subir archivos
import multer from "multer";
import User from "../models/user.js"
import { checkEntityExists } from "../middlewares/checkEntityExists.js"


// Configuracion que nos sirve para identificar como y donde se van almacenar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // resive la ruta donde se van alojar las imagenes cargadas
    cb(null, "./uploads/avatars/");
  },

  filename: (req, file, cb) => {
    // Es el prefijo de cada archivo cargado con la fecha para que el servidor no ponga problema si tiene el mismo nombre
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  }
});

// Este tambien viene siendo un middleware para subir archivos
const uploads = multer({storage});

const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa

// Para Proteger una ruta se utiliza el middleware el cual se coloca antes del metodo testUser, cuando se necesita aplicar más de un middleware se encierra entre corchetes. []

router.get('/test-user', ensureAuth, testUser);

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers);
router.put('/update', ensureAuth, updateUSer);

// Para aplicar un multer es necesario un metodo de multer en este caso "singles" y aca se le da el nombre del campo del objeto, donde ya no se va colocar en la base de datos porque ya se creo aca.
router.post('/upload', [ensureAuth, checkEntityExists(User, 'user_id') , uploads.single("file0")], uploadFiles);

// Se quita el enpoint porque no se requiere doble autenticación
router.get('/avatar/:file', avatar);

router.get('/counters/:id?', ensureAuth, counters);


// Exportar el Router
export default router;