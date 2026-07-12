/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Order.js
 * Descripción:
 * Define el modelo de pedidos de la Farmacia Online VidaSalud.
 *
 * El modelo almacena la información del cliente, los productos
 * incluidos en el pedido, el total de la compra y los datos
 * asociados a la boleta simulada generada por el sistema.
 *
 * Esquemas:
 * - orderItemSchema: Representa cada producto incluido en un pedido.
 * - orderSchema: Representa la información completa del pedido.
 *
 * Dependencias:
 * - mongoose: ODM utilizado para definir el esquema y el modelo.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import mongoose from "mongoose";

/**
 * Esquema que representa un producto incluido en un pedido.
 *
 * Cada elemento almacena una copia de la información necesaria
 * del producto al momento de realizar la compra, evitando que
 * futuras modificaciones al catálogo alteren el historial
 * del pedido.
 */
const orderItemSchema = new mongoose.Schema(
  {
    // Referencia al producto registrado en el catálogo.
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    // Código del producto al momento de realizar la compra.
    codigo: {
      type: String,
      required: true
    },

    // Nombre del producto registrado en el pedido.
    nombre: {
      type: String,
      required: true
    },

    // Precio unitario del producto.
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },

    // Cantidad adquirida por el cliente.
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },

    // Total correspondiente al producto.
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    // Evita crear un identificador independiente para cada producto del pedido.
    _id: false
  }
);

/**
 * Esquema principal que representa un pedido.
 *
 * Contiene la información del cliente, los productos
 * adquiridos, el total de la compra, el estado del
 * pedido y los datos de la boleta generada.
 */
const orderSchema = new mongoose.Schema(
  {
    // Identificador único del pedido.
    numeroPedido: {
      type: String,
      required: true,
      unique: true
    },

    // Información del cliente que realizó la compra.
    cliente: {
      nombre: {
        type: String,
        required: true,
        trim: true
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      }
    },

    // Productos incluidos en el pedido.
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        // Verifica que el pedido contenga al menos un producto.
        validator: function (items) {
          return items.length > 0;
        },
        message: "El pedido debe tener al menos un producto"
      }
    },

    // Monto total del pedido.
    total: {
      type: Number,
      required: true,
      min: 0
    },

    // Estado actual del pedido.
    estado: {
      type: String,
      enum: ["generado", "anulado"],
      default: "generado"
    },

    // Información correspondiente a la boleta simulada.
    boleta: {
      // Número identificador de la boleta.
      numeroBoleta: {
        type: String,
        required: true
      },

      // Fecha de emisión de la boleta.
      fechaEmision: {
        type: Date,
        default: Date.now
      },

      // Tipo de documento emitido.
      tipoDocumento: {
        type: String,
        default: "Boleta simulada académica"
      },

      // Mensaje informativo de uso académico.
      mensaje: {
        type: String,
        default:
          "Documento simulado para fines académicos. No corresponde a boleta electrónica real del SII."
      }
    }
  },
  {
    // Registra automáticamente la fecha de creación y actualización del pedido.
    timestamps: true
  }
);

/**
 * Modelo utilizado para gestionar los pedidos
 * almacenados en la base de datos.
 */
const Order = mongoose.model("Order", orderSchema);

export default Order;