/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: product.controller.js
 * Descripción:
 * Contiene la lógica de negocio relacionada con la gestión de
 * productos de la Farmacia Online VidaSalud.
 *
 * Funcionalidades:
 * - Consulta del catálogo de productos.
 * - Consulta de productos para administración.
 * - Obtención de productos por identificador.
 * - Creación de nuevos productos.
 * - Actualización de información y stock.
 * - Desactivación lógica de productos.
 *
 * Dependencias:
 * - db.js: Conexión con MongoDB.
 * - Product.js: Modelo de productos.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

/**
 * Obtiene el catálogo de productos disponibles.
 *
 * Permite filtrar productos por nombre o categoría,
 * mostrando únicamente aquellos que se encuentran activos.
 *
 * @async
 * @param {import("express").Request} req Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 * @param {import("express").NextFunction} next Función para delegar el manejo de errores.
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export const getProducts = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene los filtros enviados por el cliente.
    const { search, categoria } = req.query;

    // Inicializa el filtro mostrando únicamente productos activos.
    const filter = {
      activo: true
    };

    // Agrega un filtro de búsqueda por nombre.
    if (search) {
      filter.nombre = {
        $regex: search,
        $options: "i"
      };
    }

    // Agrega un filtro por categoría.
    if (categoria) {
      filter.categoria = categoria;
    }

    // Obtiene los productos ordenados por fecha de creación.
    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Devuelve el listado de productos.
    res.status(200).json({
      ok: true,
      message: "Productos obtenidos correctamente",
      total: products.length,
      products
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};

/**
 * Obtiene el listado completo de productos.
 *
 * Incluye productos activos e inactivos para su
 * administración.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la operación.
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene todos los productos registrados.
    const products = await Product.find().sort({ createdAt: -1 });

    // Devuelve el listado completo de productos.
    res.status(200).json({
      ok: true,
      message: "Productos administrativos obtenidos correctamente",
      total: products.length,
      products
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};

/**
 * Obtiene un producto mediante su identificador.
 *
 * Busca un producto activo utilizando su ID y devuelve
 * su información si existe.
 * 
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la operación.
 */
export const getProductById = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene el identificador del producto.
    const { id } = req.params;

    // Busca el producto en la base de datos.
    const product = await Product.findById(id);

    // Verifica que el producto exista y se encuentre activo.
    if (!product || !product.activo) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    // Devuelve la información del producto.
    res.status(200).json({
      ok: true,
      message: "Producto obtenido correctamente",
      product
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};

/**
 * Registra un nuevo producto.
 *
 * Valida la información recibida, comprueba que el código
 * del producto no exista previamente y registra el producto
 * en la base de datos.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la operación.
 */
export const createProduct = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene la información del producto.
    const {
      codigo,
      nombre,
      descripcion,
      categoria,
      laboratorio,
      precio,
      stock,
      imagen,
      requiereReceta
    } = req.body;

    // Verifica que los datos obligatorios hayan sido enviados.
    if (!codigo || !nombre || !descripcion || !categoria || precio === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Código, nombre, descripción, categoría y precio son obligatorios"
      });
    }

    // Verifica que el precio no sea negativo.
    if (Number(precio) < 0) {
      return res.status(400).json({
        ok: false,
        message: "El precio no puede ser negativo"
      });
    }

    // Verifica que el stock no sea negativo.
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        ok: false,
        message: "El stock no puede ser negativo"
      });
    }

    // Normaliza el código del producto para evitar duplicados.
    const normalizedCode = codigo.trim().toUpperCase();

    // Comprueba si ya existe un producto con el mismo código.
    const productExists = await Product.findOne({
      codigo: normalizedCode
    });

    // Impide registrar productos con códigos duplicados.
    if (productExists) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un producto con ese código"
      });
    }

    // Registra el nuevo producto en la base de datos.
    const product = await Product.create({
      codigo: normalizedCode,
      nombre,
      descripcion,
      categoria,
      laboratorio,
      precio,
      stock,
      imagen,
      requiereReceta
    });

    // Devuelve la información del producto creado.
    res.status(201).json({
      ok: true,
      message: "Producto creado correctamente",
      product
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};

/**
 * Actualiza la información de un producto.
 *
 * Permite modificar los datos de un producto existente,
 * validando previamente la información recibida.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la operación.
 */
export const updateProduct = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene el identificador del producto.
    const { id } = req.params;

    // Verifica que el producto exista.
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    // Normaliza el código del producto antes de actualizarlo.
    if (req.body.codigo) {
      const normalizedCode = req.body.codigo.trim().toUpperCase();

      // Comprueba que el nuevo código no esté siendo utilizado por otro producto.
      const codeExists = await Product.findOne({
        codigo: normalizedCode,
        _id: { $ne: id }
      });

      if (codeExists) {
        return res.status(409).json({
          ok: false,
          message: "Ya existe otro producto con ese código"
        });
      }

      req.body.codigo = normalizedCode;
    }

    // Verifica que el precio sea válido.
    if (req.body.precio !== undefined && Number(req.body.precio) < 0) {
      return res.status(400).json({
        ok: false,
        message: "El precio no puede ser negativo"
      });
    }

    // Verifica que el stock sea válido.
    if (req.body.stock !== undefined && Number(req.body.stock) < 0) {
      return res.status(400).json({
        ok: false,
        message: "El stock no puede ser negativo"
      });
    }

    // Actualiza la información del producto.
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    // Devuelve el producto actualizado.
    res.status(200).json({
      ok: true,
      message: "Producto actualizado correctamente",
      product: updatedProduct
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};

/**
 * Actualiza el stock de un producto.
 * 
 * Permite modificar la cantidad disponible de un producto,
 * validando que el valor recibido sea válido.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la operación.
 */
export const updateStock = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene el identificador del producto y el nuevo stock.
    const { id } = req.params;
    const { stock } = req.body;

    // Verifica que el stock haya sido enviado.
    if (stock === undefined) {
      return res.status(400).json({
        ok: false,
        message: "El stock es obligatorio"
      });
    }

    // Verifica que el stock no sea negativo.
    if (Number(stock) < 0) {
      return res.status(400).json({
        ok: false,
        message: "El stock no puede ser negativo"
      });
    }

    // Actualiza el stock del producto.
    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      {
        new: true,
        runValidators: true
      }
    );

    // Verifica que el producto exista.
    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    // Devuelve el producto con el stock actualizado.
    res.status(200).json({
      ok: true,
      message: "Stock actualizado correctamente",
      product
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};

/**
 * Desactiva un producto.
 *
 * Realiza una desactivación lógica marcando el producto
 * como inactivo, sin eliminarlo de la base de datos.
 *
 * @async
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error durante la operación.
 */
export const deactivateProduct = async (req, res, next) => {
  try {
    // Establece la conexión con la base de datos.
    await connectDB();

    // Obtiene el identificador del producto.
    const { id } = req.params;

    // Realiza una desactivación lógica del producto sin eliminarlo de la base de datos.
    const product = await Product.findByIdAndUpdate(
      id,
      { activo: false },
      {
        new: true
      }
    );

    // Verifica que el producto exista.
    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    // Devuelve la información del producto desactivado.
    res.status(200).json({
      ok: true,
      message: "Producto desactivado correctamente",
      product
    });
  } catch (error) {
    // Delega el manejo del error al middleware correspondiente.
    next(error);
  }
};