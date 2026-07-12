/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: auth.routes.js
 * Descripción:
 * Define las rutas relacionadas con la autenticación y gestión
 * de usuarios en la API de Farmacia Online VidaSalud.
 *
 * Endpoints:
 * - POST /api/auth/register: Registra un nuevo usuario.
 * - POST /api/auth/login: Autentica un usuario y devuelve un token.
 * - GET /api/auth/profile: Obtiene el perfil del usuario autenticado.
 *
 * Dependencias:
 * - auth.controller.js: Contiene la lógica de autenticación.
 * - auth.middleware.js: Verifica la autenticidad del usuario mediante JWT.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import express from "express";
import {
  getProfile,
  login,
  register
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
/**
 * Instancia del enrutador de Express para las rutas de autenticación.
 */
const router = express.Router();
// Registra un nuevo usuario.
router.post("/register", register);
// Inicia sesión y genera un token de autenticación.
router.post("/login", login);
// Obtiene el perfil del usuario autenticado.
// Requiere un token JWT válido.
router.get("/profile", protect, getProfile);

export default router;