// Importaciones
import connection from "./src/database/connection.js";
import express, { json, urlencoded } from "express";
import cors from "cors";
// Coneccion a las Routes el nombre del import se le colocan
import UserRoutes from "./src/routes/user.js";
import FollowRoutes from "./src/routes/follow.js";
import PublicationRoutes from "./src/routes/publication.js";


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

// Para ver las rutas, toca con los prefijos 
/* localhost:3900/api/follow/test-follow
localhost:3900/api/publications/test-publication
localhost:3900/api/publications/test-user */

app.use('/api/user', UserRoutes);
app.use('/api/publication', PublicationRoutes);
app.use('/api/follow', FollowRoutes);


// Ruta de prueba
app.get('/test-route', (req, res) => {
  
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