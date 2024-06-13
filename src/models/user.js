// importaciones
import { Schema, model } from "mongoose";


const UserSchema = Schema( 
  {
    name: {
      type: String,
      require: true
    },
    last_name: {
      type: String,
      require: true
    },
    nick: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    role: {
      type: String,
      default: "role_user"
    },
    image: {
      type: String,
      default: "default.png"
    },
    created_at: {
      type: Date,
      require: Date.now
    },
  }
);

// Nombre de la coleccion es "users"
export default model("User", UserSchema, "users");