import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || "farmacia_online";

    if (!mongoUri) {
      throw new Error("Falta configurar MONGODB_URI en las variables de entorno.");
    }

    const connection = await mongoose.connect(mongoUri, {
      dbName
    });

    console.log("Conexión exitosa con MongoDB Atlas");
    console.log(`Base de datos conectada: ${connection.connection.name}`);
  } catch (error) {
    console.error("Error al conectar con MongoDB Atlas:", error.message);
    process.exit(1);
  }
};