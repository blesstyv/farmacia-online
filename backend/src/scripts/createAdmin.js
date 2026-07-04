import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const adminName = process.env.ADMIN_NAME || "Administrador Farmacia";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@farmacia.cl";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin123456";

    const normalizedEmail = adminEmail.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      existingUser.role = "admin";
      existingUser.activo = true;
      await existingUser.save();

      console.log("Usuario existente actualizado como administrador:");
      console.log({
        nombre: existingUser.nombre,
        email: existingUser.email,
        role: existingUser.role
      });

      await mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

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

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error al crear administrador:", error.message);
    process.exit(1);
  }
};

createAdmin();