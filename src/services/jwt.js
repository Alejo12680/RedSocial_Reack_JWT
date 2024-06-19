// Importacion de dependencias // Siempre colocar la extencion .JS
import jwt from 'jwt-simple';
import moment from 'moment';


// Clave secreta
const secret = 'SECRET_KEY_pRoJeCt_Social_Network@'

//Método para generar tokes
const createToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
    name: user.name,
    iat: moment().unix(),
    expire: moment().add(5, 'hours').unix()
  };

  // Devolver el token creado con el payload y la clave secreta
  return jwt.encode(payload, secret);

};

export { secret, createToken };