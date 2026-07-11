/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: index.js
 * Descripción:
 * Punto de entrada a la API de Farmacia Online VidaSalud.
 * Este archivo carga las variables de entorno, importa la configuración
 * de la aplicación Express e inicia el servidor HTTP en el puerto especificado.
 * 
 * Dependencias:
 * -dotenv/config carga automaticamene las variables de entorno definidas 
 * en el archivo .env
 * -app es una instancia de la aplicacion Express configurada en ./src/app.js
 * 
 * Variables de entorno:
 * -PORT es el puerto en el que se ejeutará el servidor, si no está definido
 * se utilizará el puerto 3000
 * 
 * Ejemplo de ejecución:
 * npm run dev
 * npm start
 * 
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import "dotenv/config";
import app from "./src/app.js";
/**
 * Puerto donde se ejecutará el servidor.
*/
const PORT = process.env.PORT || 3000;
/**
 * Inicia el servidor Express y comienza a escuchar solicitudes HTTP entrantes.
*/
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});