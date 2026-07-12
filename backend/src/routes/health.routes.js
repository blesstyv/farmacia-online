/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: health.routes.js
 * Descripción:
 * Define la ruta de verificación del estado (Health Check) de la API.
 * Permite comprobar que el servidor se encuentra en funcionamiento
 * y respondiendo correctamente a las solicitudes.
 *
 * Endpoint:
 * - GET /api/health: Devuelve el estado actual de la API.
 *
 * Dependencias:
 * - express: Framework utilizado para definir las rutas.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import express from "express";
/**
 * Instancia del enrutador de Express para las rutas de verificación
 * del estado de la API.
 */
const router = express.Router();
/**
 * Endpoint de verificación del estado de la API.
 *
 * Respuesta:
 * - 200: La API se encuentra funcionando correctamente.
 */
router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Backend de Farmacia Online funcionando correctamente"
  });
});

export default router;