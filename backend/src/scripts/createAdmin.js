/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: createAdmin.js
 * Descripción:
 * Script encargado de crear el usuario administrador inicial
 * de la Farmacia Online VidaSalud.
 *
 * Si el usuario administrador ya existe, actualiza su rol
 * a "admin" y habilita su cuenta. En caso contrario, crea
 * un nuevo usuario administrador utilizando la información
 * configurada en las variables de entorno.
 *
 * Dependencias:
 * - dotenv/config: Carga las variables de entorno.
 * - bcryptjs: Encripta la contraseña del administrador.
 * - mongoose: Gestiona la conexión con MongoDB.
 * - db.js: Establece la conexión con la base de datos.
 * - User.js: Modelo de usuarios.
 *
 * Variables de entorno:
 * - ADMIN_NAME
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

/**
 * Crea o actualiza el usuario administrador del sistema.
 *
 * El script verifica si existe un usuario con el correo
 * configurado como administrador. Si existe, actualiza
 * su rol y estado. Si no existe, crea un nuevo usuario
 * administrador con la contraseña cifrada.
 *
 * @async
 * @returns {Promise<void>}
 */
const createAdmin = async () => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene los datos del administrador desde las variables de entorno.
    const adminName = process.env.ADMIN_NAME || "Administrador Farmacia";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@farmacia.cl";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin123456";

    // Normaliza el correo electrónico para evitar diferencias
    // por mayúsculas, minúsculas o espacios.
    const normalizedEmail = adminEmail.toLowerCase().trim();

    // Comprueba si el administrador ya existe en la base de datos.
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    // Si el usuario existe, actualiza su rol y habilita la cuenta.
    if (existingUser) {
      existingUser.role = "admin";
      existingUser.activo = true;
      // Guarda los cambios realizados al usuario existente.
      await existingUser.save();

      console.log("Usuario existente actualizado como administrador:");
      console.log({
        nombre: existingUser.nombre,
        email: existingUser.email,
        role: existingUser.role
      });

      // Cierra la conexión con la base de datos.
      await mongoose.connection.close();
      return;
    }

    // Genera una sal para cifrar la contraseña.
    const salt = await bcrypt.genSalt(10);
    // Cifra la contraseña del administrador.
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Crea el nuevo usuario administrador.
    const admin = await User.create({
      nombre: adminName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      activo: true
    });

    console.log("Administrador creado correctamente:");
    console.log({
      nombre: admin.nombre,
      email: admin.email,
      role: admin.role
    });

    // Cierra la conexión con la base de datos.
    await mongoose.connection.close();
    // Muestra el error y finaliza la ejecución del script.
  } catch (error) {
    console.error("Error al crear administrador:", error.message);
    process.exit(1);
  }
};

// Ejecuta el proceso de creación o actualización del administrador.
createAdmin();