import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Falta configurar la variable JWT_SECRET");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h"
    }
  );
};

export const register = async (req, res, next) => {
  try {
    await connectDB();

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Nombre, email y contraseña son obligatorios"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un usuario registrado con ese email"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      nombre: nombre.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "cliente"
    });

    const token = createToken(newUser);

    res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email y contraseña son obligatorios"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas"
      });
    }

    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        message: "Usuario desactivado"
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas"
      });
    }

    const token = createToken(user);

    res.status(200).json({
      ok: true,
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Perfil obtenido correctamente",
    user: req.user
  });
};