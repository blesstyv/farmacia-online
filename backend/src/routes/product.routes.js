/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: product.routes.js
 * Descripción:
 * Define las rutas relacionadas con la gestión de productos de la
 * API de Farmacia Online VidaSalud. Incluye rutas públicas para
 * consultar el catálogo de productos y rutas protegidas para que
 * los administradores puedan crear, actualizar, modificar el stock
 * o desactivar productos.
 *
 * Endpoints:
 * - GET    /api/products: Obtiene el catálogo de productos disponibles.
 * - GET    /api/products/admin/all: Obtiene todos los productos (solo administrador).
 * - GET    /api/products/:id: Obtiene un producto por su identificador.
 * - POST   /api/products: Registra un nuevo producto (solo administrador).
 * - PUT    /api/products/:id: Actualiza un producto (solo administrador).
 * - PATCH  /api/products/:id/stock: Actualiza el stock de un producto (solo administrador).
 * - DELETE /api/products/:id: Desactiva un producto (solo administrador).
 *
 * Dependencias:
 * - product.controller.js: Contiene la lógica para la gestión de productos.
 * - auth.middleware.js: Verifica la autenticación y los permisos del usuario.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import express from "express";
import {
  createProduct,
  deactivateProduct,
  getAdminProducts,
  getProductById,
  getProducts,
  updateProduct,
  updateStock
} from "../controllers/product.controller.js";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
/**
 * Instancia del enrutador de Express para la gestión de productos.
 */
const router = express.Router();
/**
 * Obtiene el catálogo de productos disponible para los clientes.
 */
router.get("/", getProducts);
/**
 * Obtiene el listado completo de productos para el panel administrativo.
 *
 * Nota:
 * Esta ruta debe declararse antes de "/:id" para evitar conflictos
 * con la resolución de rutas de Express.
 */
router.get("/admin/all", protect, adminOnly, getAdminProducts);
/**
 * Obtiene la información de un producto específico mediante su ID.
 */
router.get("/:id", getProductById);
/**
 * Registra un nuevo producto.
 *
 * Requiere autenticación y permisos de administrador.
 */
router.post("/", protect, adminOnly, createProduct);
/**
 * Actualiza la información de un producto existente.
 *
 * Requiere autenticación y permisos de administrador.
 */
router.put("/:id", protect, adminOnly, updateProduct);
/**
 * Actualiza únicamente el stock de un producto.
 *
 * Requiere autenticación y permisos de administrador.
 */
router.patch("/:id/stock", protect, adminOnly, updateStock);
/**
 * Desactiva un producto del catálogo.
 *
 * Requiere autenticación y permisos de administrador.
 */
router.delete("/:id", protect, adminOnly, deactivateProduct);

export default router;