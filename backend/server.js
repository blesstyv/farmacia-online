/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: server.js
 * Descripción:
 * Inicializa el servidor de la API de Farmacia Online VidaSalud.
 * Este archivo establece la conexión con la base de datos MongoDB
 * antes de iniciar el servidor Express. Si ocurre un error durante
 * el proceso de inicio, la aplicación finaliza para evitar que el
 * servidor quede en un estado inconsistente.
 *
 * Dependencias:
 * - app: Instancia de la aplicación Express configurada en ./src/app.js.
 * - connectDB: Función encargada de establecer la conexión con MongoDB.
 *
 * Variables de entorno:
 * - PORT: Puerto en el que se ejecutará el servidor. Si no está definido,
 *   se utilizará el puerto 3000.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
/**
 * Puerto donde se ejecutará el servidor.
 */
const PORT = process.env.PORT || 3000;
/**
 * Inicializa el servidor de la aplicación.
 *
 * Proceso:
 * 1. Establece la conexión con la base de datos.
 * 2. Inicia el servidor Express.
 * 3. Si ocurre un error durante el inicio, registra el mensaje
 *    en la consola y finaliza la aplicación.
 * 
 * @async
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    // Establece la conexión con la base de datos antes de iniciar la API.
    await connectDB();
    // Inicia el servidor y queda listo para recibir solicitudes HTTP.
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    // Muestra el error ocurrido durante el inicio del servidor.
    console.error("Error al iniciar el servidor:", error.message);
    // Finaliza el proceso indicando que ocurrió un error.
    process.exit(1);
  }
};
// Ejecuta la función principal para iniciar la aplicación.
startServer();