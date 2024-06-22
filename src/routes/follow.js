// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { following, saveFollow, testFollow, unfollow, followers } from "../controller/follow.js";
import { ensureAuth } from "../middlewares/auth.js";


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa
router.get('/test-follow', testFollow);
router.post('/follow', ensureAuth, saveFollow);
router.delete('/unfollow/:id', ensureAuth, unfollow);
// id opcional y la pagina es opcional
router.get('/following/:id?/:page?', ensureAuth, following);
router.get('/followers/:id?/:page?', ensureAuth, followers);


// Exportar el Router
export default router;