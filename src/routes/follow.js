// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { saveFollow, testFollow, unfollow } from "../controller/follow.js";
import { ensureAuth } from "../middlewares/auth.js";


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa
router.get('/test-follow', testFollow);
router.post('/follow', ensureAuth, saveFollow);
router.delete('/unfollow/:id', ensureAuth, unfollow);


// Exportar el Router
export default router;