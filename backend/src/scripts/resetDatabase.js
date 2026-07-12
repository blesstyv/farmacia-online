/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: resetDatabase.js
 * Descripción:
 * Script encargado de reiniciar la base de datos de la
 * Farmacia Online VidaSalud.
 *
 * El proceso elimina los pedidos, restablece los productos
 * iniciales, elimina los usuarios de prueba y garantiza
 * la existencia de un usuario administrador.
 *
 * Este script está pensado para facilitar las pruebas
 * y el desarrollo del sistema.
 *
 * Dependencias:
 * - dotenv/config: Carga las variables de entorno.
 * - bcryptjs: Cifra la contraseña del administrador.
 * - mongoose: Gestiona la conexión con MongoDB.
 * - db.js: Establece la conexión con la base de datos.
 * - User.js: Modelo de usuarios.
 * - Product.js: Modelo de productos.
 * - Order.js: Modelo de pedidos.
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
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * Catálogo inicial de productos utilizado para poblar
 * la base de datos después del reinicio.
 *
 * Los productos son simulados y se utilizan únicamente
 * con fines académicos y de prueba.
 */
const initialProducts = [
  {
    codigo: "MED-001",
    nombre: "Paracetamol 500 mg",
    descripcion: "Medicamento simulado para alivio de dolor y fiebre.",
    categoria: "Analgésicos",
    laboratorio: "Laboratorio Simulado",
    precio: 1990,
    stock: 40,
    imagen: "https://placehold.co/400x300?text=Paracetamol",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-002",
    nombre: "Ibuprofeno 400 mg",
    descripcion: "Medicamento simulado para dolor e inflamación leve.",
    categoria: "Antiinflamatorios",
    laboratorio: "Laboratorio Simulado",
    precio: 2990,
    stock: 35,
    imagen: "https://placehold.co/400x300?text=Ibuprofeno",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-003",
    nombre: "Loratadina 10 mg",
    descripcion: "Medicamento simulado para síntomas de alergia.",
    categoria: "Antialérgicos",
    laboratorio: "Laboratorio Simulado",
    precio: 2490,
    stock: 30,
    imagen: "https://placehold.co/400x300?text=Loratadina",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-004",
    nombre: "Omeprazol 20 mg",
    descripcion: "Producto simulado para molestias gástricas.",
    categoria: "Gastrointestinales",
    laboratorio: "Laboratorio Simulado",
    precio: 3490,
    stock: 28,
    imagen: "https://placehold.co/400x300?text=Omeprazol",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-005",
    nombre: "Amoxicilina 500 mg",
    descripcion: "Antibiótico simulado. Producto marcado como requiere receta.",
    categoria: "Antibióticos",
    laboratorio: "Laboratorio Simulado",
    precio: 5990,
    stock: 18,
    imagen: "https://placehold.co/400x300?text=Amoxicilina",
    requiereReceta: true,
    activo: true
  },
  {
    codigo: "MED-006",
    nombre: "Metformina 850 mg",
    descripcion: "Producto simulado para tratamiento crónico. Requiere receta.",
    categoria: "Tratamientos crónicos",
    laboratorio: "Laboratorio Simulado",
    precio: 4590,
    stock: 22,
    imagen: "https://placehold.co/400x300?text=Metformina",
    requiereReceta: true,
    activo: true
  },
  {
    codigo: "MED-007",
    nombre: "Suero fisiológico 0,9%",
    descripcion: "Solución simulada para higiene nasal y limpieza general.",
    categoria: "Cuidado general",
    laboratorio: "Laboratorio Simulado",
    precio: 1890,
    stock: 50,
    imagen: "https://placehold.co/400x300?text=Suero",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-008",
    nombre: "Alcohol gel 70%",
    descripcion: "Producto simulado para higiene de manos.",
    categoria: "Higiene y prevención",
    laboratorio: "Laboratorio Simulado",
    precio: 1590,
    stock: 60,
    imagen: "https://placehold.co/400x300?text=Alcohol+Gel",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-009",
    nombre: "Mascarillas desechables",
    descripcion: "Caja simulada de mascarillas para protección general.",
    categoria: "Higiene y prevención",
    laboratorio: "Proveedor Simulado",
    precio: 3990,
    stock: 45,
    imagen: "https://placehold.co/400x300?text=Mascarillas",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-010",
    nombre: "Vitamina C 1000 mg",
    descripcion: "Producto simulado de apoyo nutricional.",
    categoria: "Vitaminas",
    laboratorio: "Laboratorio Simulado",
    precio: 4990,
    stock: 32,
    imagen: "https://placehold.co/400x300?text=Vitamina+C",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-011",
    nombre: "Crema hidratante dermatológica",
    descripcion: "Producto simulado para cuidado de la piel.",
    categoria: "Dermocosmética",
    laboratorio: "Laboratorio Simulado",
    precio: 6990,
    stock: 20,
    imagen: "https://placehold.co/400x300?text=Crema",
    requiereReceta: false,
    activo: true
  },
  {
    codigo: "MED-012",
    nombre: "Termómetro digital",
    descripcion: "Dispositivo simulado para control de temperatura corporal.",
    categoria: "Dispositivos médicos",
    laboratorio: "Proveedor Simulado",
    precio: 7990,
    stock: 15,
    imagen: "https://placehold.co/400x300?text=Termometro",
    requiereReceta: false,
    activo: true
  }
];

/**
 * Reinicia la base de datos del sistema.
 *
 * Elimina la información de prueba, restablece el
 * usuario administrador e inserta nuevamente el
 * catálogo inicial de productos.
 *
 * @async
 * @returns {Promise<void>}
 */

const resetDatabase = async () => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    console.log("Iniciando limpieza de base de datos...");

    // Elimina todos los pedidos registrados.
    await Order.deleteMany({});
    console.log("Pedidos y boletas simuladas eliminados.");

    // Elimina todos los productos existentes.
    await Product.deleteMany({});
    console.log("Productos anteriores eliminados.");

    // Elimina únicamente los usuarios con rol de cliente.
    await User.deleteMany({
      role: "cliente"
    });
    console.log("Usuarios cliente de prueba eliminados.");

    // Obtiene los datos del administrador desde las variables de entorno.
    const adminName = process.env.ADMIN_NAME || "Administrador Farmacia";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@farmacia.cl";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin123456";

    // Normaliza el correo electrónico del administrador.
    const normalizedAdminEmail = adminEmail.toLowerCase().trim();
    // Cifra la contraseña del administrador.
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crea o actualiza el usuario administrador.
    await User.findOneAndUpdate(
      {
        email: normalizedAdminEmail
      },
      {
        nombre: adminName,
        email: normalizedAdminEmail,
        password: hashedPassword,
        role: "admin",
        activo: true
      },
      {
        // Si el administrador no existe, lo crea automáticamente.
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log("Administrador listo.");

    // Inserta el catálogo inicial de productos.
    await Product.insertMany(initialProducts);
    console.log(`${initialProducts.length} productos iniciales insertados.`);

    console.log("Base de datos reiniciada correctamente.");
    // Muestra un resumen del proceso realizado.
    console.log("Resumen:");
    console.log("- Pedidos: 0");
    console.log("- Boletas simuladas: 0");
    console.log(`- Productos: ${initialProducts.length}`);
    console.log(`- Administrador: ${normalizedAdminEmail}`);

    // Cierra la conexión con la base de datos.
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    // Muestra el error ocurrido durante el proceso.
    console.error("Error al reiniciar base de datos:", error.message);

    // Cierra la conexión antes de finalizar el script.
    await mongoose.connection.close();
    // Finaliza el proceso indicando que ocurrió un error.
    process.exit(1);
  }
};

// Ejecuta el proceso de reinicio de la base de datos.
resetDatabase();