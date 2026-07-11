/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: app.js
 * Descripción:
 * Configura la aplicación principal de Express para la API de
 * Farmacia Online VidaSalud. Define los middlewares, la política
 * CORS, las rutas disponibles y el manejo de rutas no encontradas.
 *
 * Dependencias:
 * - express: Framework para crear la API.
 * - cors: Middleware para controlar el acceso desde distintos orígenes.
 * - dotenv: Carga las variables de entorno definidas en el archivo .env.
 *
 * Rutas:
 * - /api/health: Estado de la API.
 * - /api/products: Gestión de productos.
 * - /api/auth: Autenticación de usuarios.
 * - /api/orders: Gestión de pedidos.
 *
 * Variables de entorno:
 * - FRONTEND_URL: URL del frontend autorizada para realizar
 *   solicitudes a la API.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";
// Carga las variables de entorno desde el archivo .env.
dotenv.config();
/**
 * Instancia principal de la aplicación Express.
 */
const app = express();
/**
 * Lista de orígenes autorizados para consumir la API.
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://farmacia-online-tan.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean); // Elimina valores nulos o indefinidos de la lista de orígenes.
/**
 * Configuración de la política CORS.
 *
 * Permite solicitudes únicamente desde los orígenes autorizados.
 * También habilita el envío de credenciales y define los métodos
 * HTTP y encabezados permitidos.
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Permite solicitudes sin origen (por ejemplo, Postman).
    if (!origin) {
      callback(null, true);
      return;
    }
    // Permite solicitudes provenientes de orígenes autorizados.
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    // Rechaza solicitudes desde orígenes no autorizados.
    console.log("Origen bloqueado por CORS:", origin);
    callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
// Aplica la configuración CORS a todas las solicitudes.
app.use(cors(corsOptions));
// Habilita las solicitudes preflight (OPTIONS).
app.options(/.*/, cors(corsOptions));
// Permite recibir datos en formato JSON.
app.use(express.json());
/**
 * Ruta principal de la API.
 *
 * Devuelve un mensaje indicando que la API está funcionando
 * junto con las rutas principales disponibles.
 */
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API Farmacia Online funcionando correctamente",
    routes: [
      "/api/health",
      "/api/products",
      "/api/auth",
      "/api/orders"
    ]
  });
});
// Registro de las rutas principales de la API.
app.use("/api/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
/**
 * Middleware para manejar rutas inexistentes.
 *
 * Se ejecuta cuando ninguna ruta anterior coincide con la solicitud.
 */
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Ruta no encontrada"
  });
});

export default app;