/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: User.js
 * Descripción:
 * Define el modelo de usuarios de la Farmacia Online VidaSalud.
 *
 * El modelo almacena la información necesaria para la
 * autenticación y autorización de los usuarios registrados,
 * incluyendo sus datos personales, credenciales de acceso,
 * rol dentro del sistema y estado de la cuenta.
 *
 * Dependencias:
 * - mongoose: ODM utilizado para definir el esquema y el modelo.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import mongoose from "mongoose";

/**
 * Esquema que representa un usuario del sistema.
 *
 * Contiene la información utilizada para identificar,
 * autenticar y asignar permisos a cada usuario
 * registrado en la plataforma.
 */
const userSchema = new mongoose.Schema(
  {
    // Nombre del usuario.
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },

    // Correo electrónico utilizado para iniciar sesión.
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "El email no tiene un formato válido"]
    },

    // Contraseña cifrada del usuario.
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },

    // Rol asignado al usuario dentro del sistema.
    role: {
      type: String,
      enum: ["cliente", "admin"],
      default: "cliente"
    },

    // Estado de la cuenta del usuario.
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    // Registra automáticamente las fechas de creación y actualización del usuario.
    timestamps: true
  }
);

/**
 * Modelo utilizado para gestionar los usuarios
 * almacenados en la base de datos.
 */
const User = mongoose.model("User", userSchema);

export default User;