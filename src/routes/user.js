// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { testUser, register, login } from "../controller/user.js";
import { ensureAuth } from "../middlewares/auth.js";


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa

// Para Proteger una ruta se utiliza el middleware el cual se coloca antes del metodo testUser.
router.get('/test-user', ensureAuth, testUser);

router.post('/register', register);
router.post('/login', login);


// Exportar el Router
export default router;
