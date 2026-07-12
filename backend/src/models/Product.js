/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Product.js
 * Descripción:
 * Define el modelo de productos de la Farmacia Online VidaSalud.
 *
 * El modelo almacena la información de los medicamentos y
 * productos disponibles en el catálogo, incluyendo sus datos
 * comerciales, precio, stock, imagen y estado de disponibilidad.
 *
 * Dependencias:
 * - mongoose: ODM utilizado para definir el esquema y el modelo.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import mongoose from "mongoose";

/**
 * Esquema que representa un producto del catálogo.
 *
 * Incluye información necesaria para la gestión de inventario,
 * comercialización y disponibilidad de los productos.
 */
const productSchema = new mongoose.Schema(
  {
    // Código único utilizado para identificar el producto.
    codigo: {
      type: String,
      required: [true, "El código del producto es obligatorio"],
      unique: true,
      trim: true,
      uppercase: true
    },

    // Nombre comercial del producto.
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },

    // Descripción del producto.
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true
    },

    // Categoría a la que pertenece el producto.
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true
    },

    // Laboratorio fabricante del producto.
    laboratorio: {
      type: String,
      trim: true,
      default: "No informado"
    },

    // Precio de venta del producto.
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },

    // Cantidad disponible en inventario.
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0
    },

    // Imagen representativa del producto.
    imagen: {
      type: String,
      default: "https://placehold.co/400x300?text=Medicamento"
    },

    // Indica si el producto requiere receta médica.
    requiereReceta: {
      type: Boolean,
      default: false
    },

    // Estado del producto dentro del catálogo.
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    // Registra automáticamente las fechas de creación y actualización del producto.
    timestamps: true
  }
);

/**
 * Modelo utilizado para gestionar los productos
 * almacenados en la base de datos.
 */
const Product = mongoose.model("Product", productSchema);

export default Product;