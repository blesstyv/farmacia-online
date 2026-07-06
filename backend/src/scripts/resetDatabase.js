import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

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

const resetDatabase = async () => {
  try {
    await connectDB();

    console.log("Iniciando limpieza de base de datos...");

    await Order.deleteMany({});
    console.log("Pedidos y boletas simuladas eliminados.");

    await Product.deleteMany({});
    console.log("Productos anteriores eliminados.");

    await User.deleteMany({
      role: "cliente"
    });
    console.log("Usuarios cliente de prueba eliminados.");

    const adminName = process.env.ADMIN_NAME || "Administrador Farmacia";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@farmacia.cl";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin123456";

    const normalizedAdminEmail = adminEmail.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

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
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log("Administrador listo.");

    await Product.insertMany(initialProducts);
    console.log(`${initialProducts.length} productos iniciales insertados.`);

    console.log("Base de datos reiniciada correctamente.");
    console.log("Resumen:");
    console.log("- Pedidos: 0");
    console.log("- Boletas simuladas: 0");
    console.log(`- Productos: ${initialProducts.length}`);
    console.log(`- Administrador: ${normalizedAdminEmail}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error al reiniciar base de datos:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

resetDatabase();