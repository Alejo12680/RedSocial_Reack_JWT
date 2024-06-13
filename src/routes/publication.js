// Importaciones siempre va el .js en los archivos
import { Router } from "express";
import { testPublication } from "../controller/publication.js";


const router = Router();

// Definir Rutas | Nombre de la ruta y luego va el metodo con el que usa
router.get('/test-publication', testPublication);


// Exportar el Router
export default router;