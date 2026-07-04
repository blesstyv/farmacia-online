import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API Farmacia Online activa"
  });
});

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Ruta no encontrada"
  });
});

app.use((error, req, res, next) => {
  console.error("Error:", error.message);

  res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
    detail:
      process.env.NODE_ENV === "development"
        ? error.message
        : "No se pudo procesar la solicitud"
  });
});

export default app;