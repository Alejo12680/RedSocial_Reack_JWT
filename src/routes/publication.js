// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { savePublication, showPublication, testPublication } from "../controller/publication.js";
import { ensureAuth } from "../middlewares/auth.js";


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa
router.get('/test-publication', testPublication);
router.post('/publication', ensureAuth, savePublication);

// Se coloca el Id de la "publicacion" que tenemos en la base de datos
router.get('/show-publication/:id', ensureAuth, showPublication);


// Exportar el Router
export default router;