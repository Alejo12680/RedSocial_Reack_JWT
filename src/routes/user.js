// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { testUser, register } from "../controller/user.js";


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa
router.get('/test-user', testUser);
router.post('/register', register);


// Exportar el Router
export default router;
