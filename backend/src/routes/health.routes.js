import express from "express";
import { connectDB } from "../config/db.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Backend de Farmacia Online funcionando correctamente"
  });
});

router.get("/db-test", async (req, res, next) => {
  try {
    const connection = await connectDB();

    res.status(200).json({
      ok: true,
      message: "Conexión correcta con MongoDB Atlas",
      database: connection.connection.name,
      readyState: connection.connection.readyState
    });
  } catch (error) {
    next(error);
  }
});

export default router;