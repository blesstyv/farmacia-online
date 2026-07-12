/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: auth.controller.js
 * Descripción:
 * Contiene la lógica de negocio relacionada con la autenticación
 * y gestión de usuarios. Permite registrar nuevos usuarios,
 * iniciar sesión y obtener el perfil del usuario autenticado.
 *
 * Funcionalidades:
 * - Registro de usuarios.
 * - Inicio de sesión.
 * - Generación de tokens JWT.
 * - Consulta del perfil del usuario autenticado.
 *
 * Dependencias:
 * - bcryptjs: Encriptación y validación de contraseñas.
 * - jsonwebtoken: Generación de tokens JWT.
 * - db.js: Conexión con MongoDB.
 * - User.js: Modelo de usuarios.
 *
 * Variables de entorno:
 * - JWT_SECRET: Clave utilizada para firmar los tokens JWT.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

/**
 * Genera un token JWT para un usuario autenticado.
 *
 * @param {Object} user Usuario autenticado.
 * @param {string} user._id Identificador único del usuario.
 * @param {string} user.role Rol asignado al usuario.
 *
 * @returns {string} Token JWT firmado.
 *
 * @throws {Error} Si la variable JWT_SECRET no está configurada.
 */
const createToken = (user) => {
  // Verifica que exista la clave secreta para firmar los tokens.
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
      // El token será válido durante 2 horas.
      expiresIn: "2h"
    }
  );
};

/**
 * Registra un nuevo usuario en el sistema.
 *
 * Valida la información recibida, comprueba que el correo
 * electrónico no esté registrado previamente, cifra la
 * contraseña y crea el usuario en la base de datos.
 *
 * @async
 * @param {import("express").Request} req Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 * @param {import("express").NextFunction} next Función para delegar el manejo de errores.
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante el proceso de registro.
 */
export const register = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    const { nombre, email, password } = req.body;

    // Verifica que todos los campos obligatorios hayan sido enviados.
    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Nombre, email y contraseña son obligatorios"
      });
    }

    // Verifica que la contraseña cumpla con la longitud mínima requerida.
    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Normaliza el correo electrónico para evitar registros duplicados
    // debido a diferencias de mayúsculas, minúsculas o espacios.
    const normalizedEmail = email.toLowerCase().trim();

    // Comprueba si ya existe un usuario registrado con el mismo correo.
    const userExists = await User.findOne({ email: normalizedEmail });

    // Impide registrar usuarios con un correo electrónico ya existente.
    if (userExists) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un usuario registrado con ese email"
      });
    }

    // Genera una sal y cifra la contraseña antes de almacenarla.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea el nuevo usuario con el rol predeterminado de cliente.
    const newUser = await User.create({
      nombre: nombre.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "cliente"
    });

    // Genera un token JWT para autenticar al usuario recién registrado.
    const token = createToken(newUser);

    // Devuelve la información del usuario junto con el token de autenticación.
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
    // Pasa el error al middleware global para su manejo.
    next(error);
  }
};

/**
 * Autentica un usuario registrado.
 *
 * Verifica las credenciales recibidas, valida el estado del
 * usuario y genera un token JWT si la autenticación es correcta.
 *
 * @async
 * @param {import("express").Request} req Solicitud HTTP.
 * @param {import("express").Response} res Respuesta HTTP.
 * @param {import("express").NextFunction} next Middleware de manejo de errores.
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante el proceso de autenticación.
 */
export const login = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    const { email, password } = req.body;

    // Verifica que se hayan enviado las credenciales requeridas.
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email y contraseña son obligatorios"
      });
    }

    // Normaliza el correo electrónico para evitar diferencias
    // por mayúsculas, minúsculas o espacios.
    const normalizedEmail = email.toLowerCase().trim();

    // Busca el usuario asociado al correo electrónico.
    const user = await User.findOne({ email: normalizedEmail });

    // Verifica que exista un usuario registrado con ese correo.
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas"
      });
    }

    // Verifica que la cuenta del usuario se encuentre activa.
    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        message: "Usuario desactivado"
      });
    }

    // Compara la contraseña ingresada con la almacenada en la base de datos.
    const passwordIsValid = await bcrypt.compare(password, user.password);

    // Impide el acceso si la contraseña es incorrecta.
    if (!passwordIsValid) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas"
      });
    }

    // Genera un token JWT para autenticar al usuario.
    const token = createToken(user);

    // Devuelve la información del usuario junto con el token de autenticación.
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
    // Delega el manejo del error al middleware de errores de Express.
    next(error);
  }
};

/**
 * Obtiene el perfil del usuario autenticado.
 *
 * Devuelve la información del usuario almacenada por el
 * middleware de autenticación.
 *
 * @async
 * @param {import("express").Request} req Solicitud HTTP.
 * @param {import("express").Response} res Respuesta HTTP.
 *
 * @returns {Promise<void>}
 */
export const getProfile = async (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Perfil obtenido correctamente",
    user: req.user
  });
};