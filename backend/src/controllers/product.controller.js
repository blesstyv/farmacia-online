import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

export const getProducts = async (req, res, next) => {
  try {
    await connectDB();

    const { search, categoria } = req.query;

    const filter = {
      activo: true
    };

    if (search) {
      filter.nombre = {
        $regex: search,
        $options: "i"
      };
    }

    if (categoria) {
      filter.categoria = categoria;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      ok: true,
      message: "Productos obtenidos correctamente",
      total: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    await connectDB();

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || !product.activo) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      ok: true,
      message: "Producto obtenido correctamente",
      product
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    await connectDB();

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

    if (!codigo || !nombre || !descripcion || !categoria || precio === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Código, nombre, descripción, categoría y precio son obligatorios"
      });
    }

    if (precio < 0) {
      return res.status(400).json({
        ok: false,
        message: "El precio no puede ser negativo"
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        ok: false,
        message: "El stock no puede ser negativo"
      });
    }

    const normalizedCode = codigo.trim().toUpperCase();

    const productExists = await Product.findOne({
      codigo: normalizedCode
    });

    if (productExists) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un producto con ese código"
      });
    }

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

    res.status(201).json({
      ok: true,
      message: "Producto creado correctamente",
      product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    await connectDB();

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    if (req.body.codigo) {
      const normalizedCode = req.body.codigo.trim().toUpperCase();

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

    if (req.body.precio !== undefined && req.body.precio < 0) {
      return res.status(400).json({
        ok: false,
        message: "El precio no puede ser negativo"
      });
    }

    if (req.body.stock !== undefined && req.body.stock < 0) {
      return res.status(400).json({
        ok: false,
        message: "El stock no puede ser negativo"
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      ok: true,
      message: "Producto actualizado correctamente",
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({
        ok: false,
        message: "El stock es obligatorio"
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        ok: false,
        message: "El stock no puede ser negativo"
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      ok: true,
      message: "Stock actualizado correctamente",
      product
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateProduct = async (req, res, next) => {
  try {
    await connectDB();

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { activo: false },
      {
        new: true
      }
    );

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      ok: true,
      message: "Producto desactivado correctamente",
      product
    });
  } catch (error) {
    next(error);
  }
};