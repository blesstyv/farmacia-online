import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: [true, "El código del producto es obligatorio"],
      unique: true,
      trim: true,
      uppercase: true
    },

    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },

    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true
    },

    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true
    },

    laboratorio: {
      type: String,
      trim: true,
      default: "No informado"
    },

    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },

    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0
    },

    imagen: {
      type: String,
      default: "https://placehold.co/400x300?text=Medicamento"
    },

    requiereReceta: {
      type: Boolean,
      default: false
    },

    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;