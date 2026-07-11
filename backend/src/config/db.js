/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: db.js
 * Descripción:
 * Gestiona la conexión entre la API de Farmacia Online VidaSalud
 * y la base de datos MongoDB Atlas utilizando Mongoose.
 * Verifica que las variables de entorno necesarias existan antes
 * de establecer la conexión y finaliza la aplicación si ocurre
 * un error durante el proceso.
 *
 * Dependencias:
 * - mongoose: Biblioteca para interactuar con MongoDB.
 * - dotenv: Carga las variables de entorno definidas en el archivo .env.
 *
 * Variables de entorno:
 * - MONGODB_URI: Cadena de conexión a MongoDB Atlas.
 * - DB_NAME: Nombre de la base de datos. Si no está definido,
 *   se utilizará "farmacia_online".
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
// Carga las variables de entorno desde el archivo .env.
dotenv.config();
/**
 * Establece la conexión con la base de datos MongoDB Atlas.
 *
 * Proceso:
 * 1. Obtiene la cadena de conexión y el nombre de la base de datos.
 * 2. Verifica que la variable MONGODB_URI esté configurada.
 * 3. Establece la conexión mediante Mongoose.
 * 4. Muestra un mensaje indicando que la conexión fue exitosa.
 * 5. Si ocurre un error, registra el mensaje y finaliza la aplicación.
 *
 * @async
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    // Obtiene la cadena de conexión desde las variables de entorno.
    const mongoUri = process.env.MONGODB_URI;
    // Obtiene el nombre de la base de datos o utiliza el valor por defecto.
    const dbName = process.env.DB_NAME || "farmacia_online";
    // Verifica que exista una cadena de conexión configurada.
    if (!mongoUri) {
      throw new Error("Falta configurar MONGODB_URI en las variables de entorno.");
    }
    // Establece la conexión con MongoDB Atlas.
    const connection = await mongoose.connect(mongoUri, {
      dbName
    });
    // Confirma que la conexión se realizó correctamente.
    console.log("Conexión exitosa con MongoDB Atlas");
    console.log(`Base de datos conectada: ${connection.connection.name}`);
  } catch (error) {
    // Muestra el error ocurrido durante la conexión.
    console.error("Error al conectar con MongoDB Atlas:", error.message);
    // Finaliza la aplicación para evitar que continúe sin conexión a la base de datos.
    process.exit(1);
  }
};