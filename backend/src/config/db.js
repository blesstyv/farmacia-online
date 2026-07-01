import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";

// Forzamos servidores DNS públicos para resolver correctamente registros SRV.
// Esto ayuda cuando la red local o el proveedor bloquea o rechaza consultas DNS SRV.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

export const connectDB = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || "farmacia_online";

    if (!uri) {
      throw new Error("Falta configurar la variable MONGODB_URI");
    }

    if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
      throw new Error(
        "La URI de MongoDB debe comenzar con mongodb:// o mongodb+srv://"
      );
    }

    cached.promise =
      cached.promise ||
      mongoose.connect(uri, {
        dbName,
        serverSelectionTimeoutMS: 10000
      });

    cached.conn = await cached.promise;

    console.log("Conexión exitosa con MongoDB Atlas");
    console.log("Base de datos conectada:", cached.conn.connection.name);

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;

    console.error("Error al conectar con MongoDB Atlas:", error.message);
    throw error;
  }
};