
/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: auth.middleware.js
 * Descripción:
 * Contiene los middlewares encargados de la autenticación
 * y autorización de usuarios mediante JSON Web Tokens (JWT).
 *
 * Funcionalidades:
 * - Validación de tokens JWT.
 * - Identificación del usuario autenticado.
 * - Restricción de acceso a usuarios administradores.
 *
 * Dependencias:
 * - jsonwebtoken: Validación de tokens JWT.
 * - db.js: Conexión con MongoDB.
 * - User.js: Modelo de usuarios.
 *
 * Variables de entorno:
 * - JWT_SECRET: Clave utilizada para validar los tokens JWT.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

/**
 * Verifica que la solicitud provenga de un usuario autenticado.
 *
 * Valida el token JWT enviado en la cabecera Authorization,
 * comprueba que el usuario exista y se encuentre activo,
 * y almacena su información en la solicitud para los
 * siguientes middlewares o controladores.
 *
 * @async
 * @param {import("express").Request} req Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 * @param {import("express").NextFunction} next Función para continuar con el siguiente middleware.
 *
 * @returns {Promise<void>}
 */
export const protect = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene la cabecera de autorización enviada por el cliente.
    const authHeader = req.headers.authorization;

    // Verifica que la solicitud incluya un token con el formato Bearer.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "No autorizado. Token no proporcionado"
      });
    }

    // Extrae el token JWT de la cabecera Authorization.
    const token = authHeader.split(" ")[1];

    // Verifica que exista la clave utilizada para validar los tokens.
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        ok: false,
        message: "Falta configurar JWT_SECRET en el servidor"
      });
    }

    // Valida el token JWT y obtiene la información almacenada.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca el usuario asociado al token, excluyendo la contraseña.
    const user = await User.findById(decoded.id).select("-password");

    // Verifica que el usuario exista.
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "No autorizado. Usuario no encontrado"
      });
    }

    // Verifica que la cuenta del usuario se encuentre activa.
    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        message: "Usuario desactivado"
      });
    }

    // Almacena la información del usuario autenticado en la solicitud.
    req.user = {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    };

    // Continúa con el siguiente middleware o controlador.
    next();
    // Devuelve un error si el token es inválido o ha expirado.
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "No autorizado. Token inválido o expirado"
    });
  }
};

/**
 * Restringe el acceso a usuarios con rol de administrador.
 *
 * Verifica que el usuario autenticado tenga el rol
 * correspondiente antes de permitir el acceso al recurso.
 *
 * @param {import("express").Request} req Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 * @param {import("express").NextFunction} next Función para continuar con el siguiente middleware.
 *
 * @returns {void}
 */
export const adminOnly = (req, res, next) => {
  // Verifica que el usuario autenticado tenga permisos de administrador.
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      ok: false,
      message: "Acceso denegado. Se requiere rol administrador"
    });
  }
  
  // Continúa con el siguiente middleware o controlador.
  next();
};