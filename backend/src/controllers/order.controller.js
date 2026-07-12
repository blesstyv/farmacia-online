/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: order.controller.js
 * Descripción:
 * Contiene la lógica de negocio relacionada con la gestión de
 * pedidos de la Farmacia Online VidaSalud.
 *
 * Funcionalidades:
 * - Creación de pedidos.
 * - Generación automática de números de pedido y boleta.
 * - Actualización del stock de productos.
 * - Consulta de pedidos registrados.
 * - Consulta de pedidos por identificador.
 *
 * Dependencias:
 * - mongoose: Manejo de sesiones y transacciones.
 * - db.js: Conexión con MongoDB.
 * - Product.js: Modelo de productos.
 * - Order.js: Modelo de pedidos.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * Crea un objeto de error con un código HTTP personalizado.
 *
 * @param {string} message Mensaje descriptivo del error.
 * @param {number} statusCode Código HTTP asociado al error.
 *
 * @returns {Error} Error con el código de estado asignado.
 */
const createHttpError = (message, statusCode) => {
  // Asigna el código HTTP al objeto Error.
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Genera un número único para identificar un pedido.
 *
 * Combina la fecha y hora actual con un número aleatorio
 * para minimizar la posibilidad de duplicados.
 *
 * @returns {string} Número de pedido generado.
 */
const generateOrderNumber = () => {
  // Obtiene la fecha y hora actual en milisegundos.
  const timestamp = Date.now();
  // Genera un número aleatorio de cuatro dígitos.
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `PED-${timestamp}-${random}`;
};

/**
 * Genera un número único para una boleta simulada.
 *
 * @returns {string} Número de boleta generado.
 */
const generateReceiptNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `BOL-SIM-${timestamp}-${random}`;
};

/**
 * Registra un nuevo pedido.
 *
 * Valida la información enviada por el cliente, verifica la
 * disponibilidad de stock, actualiza el inventario y genera
 * automáticamente el pedido y su boleta simulada.
 *
 * Todo el proceso se ejecuta dentro de una transacción para
 * garantizar la consistencia de los datos.
 *
 * @async
 * @param {import("express").Request} req Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 * @param {import("express").NextFunction} next Middleware de manejo de errores.
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la creación del pedido.
 */
export const createOrder = async (req, res, next) => {
  // Inicia una sesión de MongoDB para ejecutar una transacción.
  const session = await mongoose.startSession();

  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    const { cliente, items } = req.body;

    // Verifica que se hayan recibido los datos obligatorios del cliente.
    if (!cliente || !cliente.nombre || !cliente.email) {
      throw createHttpError("Nombre y email del cliente son obligatorios", 400);
    }

    // Verifica que el pedido contenga al menos un producto.
    if (!Array.isArray(items) || items.length === 0) {
      throw createHttpError("El pedido debe tener al menos un producto", 400);
    }

    let createdOrder = null;

    // Ejecuta todo el proceso dentro de una transacción para garantizar
    // la consistencia de los datos.
    await session.withTransaction(async () => {
      const orderItems = [];
      let total = 0;

      // Recorre cada producto incluido en el pedido.
      for (const item of items) {
        const { productId, cantidad } = item;

        // Verifica que el identificador del producto sea válido.
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
          throw createHttpError("ID de producto inválido", 400);
        }

        // Verifica que la cantidad solicitada sea mayor que cero.
        if (!cantidad || cantidad <= 0) {
          throw createHttpError("La cantidad debe ser mayor a cero", 400);
        }

        // Obtiene la información del producto desde la base de datos.
        const product = await Product.findById(productId).session(session);

        // Verifica que el producto exista y se encuentre activo.
        if (!product || !product.activo) {
          throw createHttpError("Producto no encontrado o inactivo", 404);
        }

        // Comprueba que exista stock suficiente para completar el pedido.
        if (product.stock < cantidad) {
          throw createHttpError(
            `Stock insuficiente para ${product.nombre}. Stock disponible: ${product.stock}`,
            409
          );
        }

        // Calcula el subtotal correspondiente al producto.
        const subtotal = product.precio * cantidad;

        // Agrega el producto al detalle del pedido.
        orderItems.push({
          product: product._id,
          codigo: product.codigo,
          nombre: product.nombre,
          precioUnitario: product.precio,
          cantidad,
          subtotal
        });

        // Acumula el total de la compra.
        total += subtotal;

        // Actualiza el stock disponible del producto.
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

        // Verifica que el stock se haya actualizado correctamente.
        if (stockUpdate.modifiedCount !== 1) {
          throw createHttpError(
            `No fue posible actualizar stock para ${product.nombre}`,
            409
          );
        }
      }

      // Genera el número del pedido y de la boleta simulada.
      const numeroPedido = generateOrderNumber();
      const numeroBoleta = generateReceiptNumber();

      // Registra el pedido en la base de datos.
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

      // Guarda el pedido creado para devolverlo en la respuesta.
      createdOrder = order;
    });

    // Devuelve el pedido generado correctamente.
    res.status(201).json({
      ok: true,
      message: "Pedido generado correctamente",
      order: createdOrder
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  } finally {
    // Finaliza la sesión de la transacción.
    await session.endSession();
  }
};

/**
 * Obtiene el listado de pedidos registrados.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 */
export const getOrders = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene todos los pedidos ordenados por fecha de creación.
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.product", "nombre codigo categoria stock precio");

    // Devuelve el listado de pedidos.
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

/**
 * Obtiene un pedido mediante su identificador.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 */
export const getOrderById = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene el identificador del pedido.
    const { id } = req.params;

    // Verifica que el identificador tenga un formato válido.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "ID de pedido inválido"
      });
    }

    // Busca el pedido junto con la información de sus productos.
    const order = await Order.findById(id).populate(
      "items.product",
      "nombre codigo categoria stock precio"
    );

    // Verifica que el pedido exista.
    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Pedido no encontrado"
      });
    }

    // Devuelve la información del pedido.
    res.status(200).json({
      ok: true,
      message: "Pedido obtenido correctamente",
      order
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};