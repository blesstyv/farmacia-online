import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    await connectDB();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "No autorizado. Token no proporcionado"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        ok: false,
        message: "Falta configurar JWT_SECRET en el servidor"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "No autorizado. Usuario no encontrado"
      });
    }

    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        message: "Usuario desactivado"
      });
    }

    req.user = {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "No autorizado. Token inválido o expirado"
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      ok: false,
      message: "Acceso denegado. Se requiere rol administrador"
    });
  }

  next();
};