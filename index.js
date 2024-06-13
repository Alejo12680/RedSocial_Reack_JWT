// Importaciones
import connection from "./src/database/connection.js";
import express, { json, urlencoded } from "express";
import cors from "cors";

// Mensaje de Bienvenida
console.log("API NODE arriba");

// Conexion a la BD
connection();

// Crear servidor de Node:
const app = express();
const puerto = 3900;

// Configuracion cors: Permite que las peticiones se hagan correctamente
app.use(cors());

// Conversion de datos (body a objetos JS)
app.use(json())
app.use(urlencoded({extends: true}))

// Configurar rutas
app.get('/test-route', (req, res) => {
  // Ruta de prueba
  return res.status(200).json(
    {
      'id': 1,
      'name': 'alejandro',
      'username': 'alejo1527'
    })
})

// Configurar el servicio para escuchar las periticones HTTP
app.listen(puerto, () => {
  console.log("Servidor de NODE corriendo en el puerto", puerto);
})





