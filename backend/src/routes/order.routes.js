import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders
} from "../controllers/order.controller.js";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Crear pedido desde el carrito.
// Por ahora queda público para permitir compra simulada sin login frontend.
router.post("/", createOrder);

// Listado de pedidos solo para administrador.
router.get("/", protect, adminOnly, getOrders);

// Consulta de boleta/pedido por ID.
router.get("/:id", getOrderById);

export default router;