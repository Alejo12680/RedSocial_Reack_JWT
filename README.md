# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## BACKEND

API REST: NODE – EXPRESS – MONGODB
JWT – AUTENTICACIÓN

## VERIFICAR O INSTALAR NODE Y NPM

### Abrir la terminal y ejecutar estos comandos para verificar si están instalados node y npm: `node --version` y `npm --version`

Las versiones utilizadas son:

**Node: v20.13.1**
**Npm: v10.7.0**

Si no tienes instalado node, sigue estos pasos:
Instalación en Windows
1. Descargar el instalador:
o Ve a la página oficial de descargas de Node.js: https://nodejs.org/en
o Descarga el instalador recomendado para tu sistema operativo (LTS es la versión recomendada para la mayoría de los usuarios).
2. Ejecutar el instalador:
o Abre el archivo .msi que descargaste.
o Sigue las instrucciones del asistente de instalación. Asegúrate de marcar la opción que añade Node.js al PATH.
3. Verificar la instalación:
o Abre una terminal o símbolo del sistema (Command Prompt).
o Escribe node --version para verificar que Node.js se instaló correctamente.


Instalación de npm manualmente (opcional)
Si por alguna razón npm no se instala automáticamente con Node.js, puedes instalar npm manualmente:
1. Descargar el paquete npm:
o Abre la terminal y ejecuta el siguiente comando para instalar npm globalmente: npm install -g npm
o Este comando descarga e instala la última versión de npm globalmente en tu sistema.
2. Verificar la instalación de npm:
o Después de la instalación, verifica la versión de npm nuevamente: npm --version
o Deberías ver la versión de npm instalada.


## CREAR EL PACKAGE.JSON E INICIALIZAR EL PROYECTO

Ejecutar el comando: `npm init` (permite mediante un asistente crear nuestro package.json e inicializar un proyecto). Seguir las instrucciones del asistente para la creación del package.json.
Captura de las preguntas que salen y sus respuestas, donde no se escribe nada se hace clic en la techa ENTER.

This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and save it as a dependency in the package.json file.

Press ^C at any time to quit.

package name: (api-rest-social-network)
version: (1.0.0)
description: API REST con stack MERN y autenticacion JWT para Red Social
entry point: (index.js)
test command:
git repository:https://github.com/Alejo12680/RedSocial_Reack_JWT.git
keywords :
author: Alejandro Ramirez
license: (ISC) ISC
About to write to D:\INESProjFulIStack\api-rest-sociaI-network\package.json:
{
	"name": "api-rest-social-network" ,
	"versiona: "1.0.0",
	"description": "API REST con stack MERN y autenticacion JWT para Red Social",
	"main": "index.js",
	"scripts" {
		"test": "echo \ "Error: no test specified\" && exit 1"
	},
	"author": "Alejandro Ramirez",
	"license": "ISC"
}

Is this OK? (yes)


## INSTALAR LAS DEPENDENCIAS Y PAQUETES DEL PROYECTO

Al instalar las dependencias, automáticamente se añade información al **package.json** y se crea la carpeta de node modules en donde se guardan cada una de las dependencias.

1. **Instalar Express:** es el framework de Node que nos va a permitir trabajar con el protocolo HTTP, crear controladores, rutas, endpoints, todo lo del backend. `npm install express`

2. **Instalar la dependencia de Mongoose:** permite trabajar con la Base de Datos de manera fácil, usando una capa de abstracción de métodos, permite trabajar con la base de datos más fácil que hacerlo directamente con consultas nativas de Mongo, es lo mismo, pero con el ODM. `npm install mogoose`

3. **Instalar la dependencia de Mongoose - Pagination:** es una librería para hacer paginación con Mongoose, es como añadir un método a Mongoose. `npm install mongoose-pagination`

4. **Instalar la dependencia Multer:** es una librería para subir archivos, imágenes, etc al servidor. npm install multer

5. **Instalar la dependencia Moment:** es una librería para gestionar fechas. `npm install moment`

6. **Instalar la dependencia Validator:** es una librería para validar alguna información. `npm install validator`

7. **Instalar la dependencia bcrypt-nodejs:** es un protocolo de cifrado que permite cifrar contraseñas o cualquier tipo de string o dato. `npm install bcrypt`

8. **Instalar la dependencia jwt-simple:** librería para autenticación con JWT. `npm install jwt-simple`

9. **Instalar la dependencia Cors:** permite hacer peticiones entre dominios de manera fácil, podemos limitar las peticiones Ajax a cierta URL, lo hacemos mediante una regla. `npm install cors`

10. **Instalar la dependencia de Nodemon:** permite mantener ejecutado nuestro proyecto y se refresque el servidor, que monitoree los cambios y nos refleja los cambios. No quiero que sea una dependencia que se vaya a producción, solo la quiero instalar local, por esto usamos el atributo --save-dev.
`npm install nodemon --save-dev`
