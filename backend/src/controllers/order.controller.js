import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `PED-${timestamp}-${random}`;
};

const generateReceiptNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `BOL-SIM-${timestamp}-${random}`;
};

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const { cliente, items } = req.body;

    if (!cliente || !cliente.nombre || !cliente.email) {
      throw createHttpError("Nombre y email del cliente son obligatorios", 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw createHttpError("El pedido debe tener al menos un producto", 400);
    }

    let createdOrder = null;

    await session.withTransaction(async () => {
      const orderItems = [];
      let total = 0;

      for (const item of items) {
        const { productId, cantidad } = item;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
          throw createHttpError("ID de producto inválido", 400);
        }

        if (!cantidad || cantidad <= 0) {
          throw createHttpError("La cantidad debe ser mayor a cero", 400);
        }

        const product = await Product.findById(productId).session(session);

        if (!product || !product.activo) {
          throw createHttpError("Producto no encontrado o inactivo", 404);
        }

        if (product.stock < cantidad) {
          throw createHttpError(
            `Stock insuficiente para ${product.nombre}. Stock disponible: ${product.stock}`,
            409
          );
        }

        const subtotal = product.precio * cantidad;

        orderItems.push({
          product: product._id,
          codigo: product.codigo,
          nombre: product.nombre,
          precioUnitario: product.precio,
          cantidad,
          subtotal
        });

        total += subtotal;

        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            stock: { $gte: cantidad }
          },
          {
            $inc: {
              stock: -cantidad
            }
          },
          {
            session
          }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw createHttpError(
            `No fue posible actualizar stock para ${product.nombre}`,
            409
          );
        }
      }

      const numeroPedido = generateOrderNumber();
      const numeroBoleta = generateReceiptNumber();

      const [order] = await Order.create(
        [
          {
            numeroPedido,
            cliente: {
              nombre: cliente.nombre.trim(),
              email: cliente.email.toLowerCase().trim()
            },
            items: orderItems,
            total,
            boleta: {
              numeroBoleta,
              fechaEmision: new Date(),
              tipoDocumento: "Boleta simulada académica",
              mensaje:
                "Documento simulado para fines académicos. No corresponde a boleta electrónica real del SII."
            }
          }
        ],
        {
          session
        }
      );

      createdOrder = order;
    });

    res.status(201).json({
      ok: true,
      message: "Pedido generado correctamente",
      order: createdOrder
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

export const getOrders = async (req, res, next) => {
  try {
    await connectDB();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.product", "nombre codigo categoria stock precio");

    res.status(200).json({
      ok: true,
      message: "Pedidos obtenidos correctamente",
      total: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    await connectDB();

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de pedido inválido"
      });
    }

    const order = await Order.findById(id).populate(
      "items.product",
      "nombre codigo categoria stock precio"
    );

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Pedido no encontrado"
      });
    }

    res.status(200).json({
      ok: true,
      message: "Pedido obtenido correctamente",
      order
    });
  } catch (error) {
    next(error);
  }
};