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

const router = express.Router();

// Rutas públicas
router.get("/", getProducts);

// Ruta administrativa: debe ir antes de "/:id"
router.get("/admin/all", protect, adminOnly, getAdminProducts);

// Rutas públicas por ID
router.get("/:id", getProductById);

// Rutas protegidas solo para administrador
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.patch("/:id/stock", protect, adminOnly, updateStock);
router.delete("/:id", protect, adminOnly, deactivateProduct);

export default router;