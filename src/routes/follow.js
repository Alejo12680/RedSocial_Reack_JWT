// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { testFollow } from "../controller/follow.js";


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa
router.get('/test-follow', testFollow);


// Exportar el Router
export default router;