/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: order.routes.js
 * Descripción:
 * Define las rutas relacionadas con la gestión de pedidos de la
 * API de Farmacia Online VidaSalud. Permite registrar pedidos,
 * consultar el listado de pedidos y obtener la información de
 * un pedido específico.
 *
 * Endpoints:
 * - POST /api/orders: Registra un nuevo pedido.
 * - GET /api/orders: Obtiene el listado de pedidos (solo administrador).
 * - GET /api/orders/:id: Consulta un pedido específico mediante su ID.
 *
 * Dependencias:
 * - order.controller.js: Contiene la lógica para gestionar los pedidos.
 * - auth.middleware.js: Verifica la autenticación y los permisos del usuario.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders
} from "../controllers/order.controller.js";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
/**
 * Instancia del enrutador de Express para la gestión de pedidos.
 */
const router = express.Router();
/**
 * Registra un nuevo pedido.
 *
 * Actualmente esta ruta es pública para permitir la simulación
 * de compras desde el frontend sin necesidad de autenticación.
 *
 * Nota:
 * En un entorno de producción se recomienda proteger esta ruta
 * para que solo usuarios autenticados puedan generar pedidos.
 */
router.post("/", createOrder);
/**
 * Obtiene el listado de todos los pedidos registrados.
 *
 * Requiere que el usuario esté autenticado y tenga permisos
 * de administrador.
 */
router.get("/", protect, adminOnly, getOrders);
/**
 * Obtiene la información de un pedido específico
 * mediante su identificador.
 */
router.get("/:id", getOrderById);

export default router;