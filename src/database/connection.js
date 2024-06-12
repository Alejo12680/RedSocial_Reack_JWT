// Con esta variable trae todas las dependencias para poderlas utilizar

const mongoose = require("mongoose");

// Coneccion, siempre se trabajan con try catch
const connection = async() => {

  try {
    await mongoose.connect("mongodb://localhost:27017/db_socialNet");
    console.log("Conectado correctamente a la BD: db_socialNet");

  } catch (error) {
    console.log(error);
    throw new error("No se ha podido conectar a la base de datos")
    
  }
}
module.exports = connection;
