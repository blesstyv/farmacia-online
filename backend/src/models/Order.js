import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    codigo: {
      type: String,
      required: true
    },

    nombre: {
      type: String,
      required: true
    },

    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    numeroPedido: {
      type: String,
      required: true,
      unique: true
    },

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

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "El pedido debe tener al menos un producto"
      }
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    estado: {
      type: String,
      enum: ["generado", "anulado"],
      default: "generado"
    },

    boleta: {
      numeroBoleta: {
        type: String,
        required: true
      },

      fechaEmision: {
        type: Date,
        default: Date.now
      },

      tipoDocumento: {
        type: String,
        default: "Boleta simulada académica"
      },

      mensaje: {
        type: String,
        default:
          "Documento simulado para fines académicos. No corresponde a boleta electrónica real del SII."
      }
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;