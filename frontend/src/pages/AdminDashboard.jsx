import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deactivateProduct,
  getAdminProducts,
  updateProduct
} from "../services/api";

const initialForm = {
  codigo: "",
  nombre: "",
  descripcion: "",
  categoria: "",
  laboratorio: "",
  precio: "",
  stock: "",
  imagen: "",
  requiereReceta: false
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setError("");

      const data = await getAdminProducts();

      setProducts(data.products || []);
    } catch (error) {
      setError(error.message || "No se pudieron cargar los productos");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const activeProducts = products.filter((product) => product.activo).length;

    const inactiveProducts = products.filter((product) => !product.activo).length;

    const totalStock = products.reduce((total, product) => {
      return total + Number(product.stock || 0);
    }, 0);

    const productsWithoutStock = products.filter((product) => {
      return product.stock <= 0;
    }).length;

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalStock,
      productsWithoutStock
    };
  }, [products]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const validateForm = () => {
    if (!formData.codigo.trim()) {
      return "El código es obligatorio.";
    }

    if (!formData.nombre.trim()) {
      return "El nombre es obligatorio.";
    }

    if (!formData.descripcion.trim()) {
      return "La descripción es obligatoria.";
    }

    if (!formData.categoria.trim()) {
      return "La categoría es obligatoria.";
    }

    if (formData.precio === "" || Number(formData.precio) < 0) {
      return "El precio debe ser igual o mayor a cero.";
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      return "El stock debe ser igual o mayor a cero.";
    }

    return "";
  };

  const buildProductPayload = () => {
    const payload = {
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria.trim(),
      laboratorio: formData.laboratorio.trim() || "No informado",
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      requiereReceta: formData.requiereReceta
    };

    if (formData.imagen.trim()) {
      payload.imagen = formData.imagen.trim();
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const validationMessage = validateForm();

      if (validationMessage) {
        setError(validationMessage);
        return;
      }

      const payload = buildProductPayload();

      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage("Producto actualizado correctamente.");
      } else {
        await createProduct(payload);
        setMessage("Producto creado correctamente.");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setError(error.message || "No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      codigo: product.codigo || "",
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      categoria: product.categoria || "",
      laboratorio: product.laboratorio || "",
      precio: product.precio || "",
      stock: product.stock || "",
      imagen: product.imagen || "",
      requiereReceta: Boolean(product.requiereReceta)
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDeactivate = async (productId) => {
    const confirmAction = window.confirm(
      "¿Seguro que deseas desactivar este producto?"
    );

    if (!confirmAction) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deactivateProduct(productId);

      setMessage("Producto desactivado correctamente.");
      await loadProducts();
    } catch (error) {
      setError(error.message || "No se pudo desactivar el producto");
    }
  };

  const handleActivate = async (productId) => {
    try {
      setError("");
      setMessage("");

      await updateProduct(productId, {
        activo: true
      });

      setMessage("Producto activado correctamente.");
      await loadProducts();
    } catch (error) {
      setError(error.message || "No se pudo activar el producto");
    }
  };

  return (
    <section className="admin-page">
      <div className="section-header">
        <span className="hero-label">Panel administrador</span>
        <h2>Gestión de productos</h2>
        <p>
          Administra el catálogo de medicamentos conectado a MongoDB Atlas.
        </p>
      </div>

      <div className="admin-grid">
        <article className="stat-card">
          <span>Total productos</span>
          <strong>{stats.totalProducts}</strong>
        </article>

        <article className="stat-card">
          <span>Productos activos</span>
          <strong>{stats.activeProducts}</strong>
        </article>

        <article className="stat-card">
          <span>Stock total</span>
          <strong>{stats.totalStock}</strong>
        </article>

        <article className="stat-card">
          <span>Sin stock</span>
          <strong>{stats.productsWithoutStock}</strong>
        </article>

        <article className="stat-card">
          <span>Desactivados</span>
          <strong>{stats.inactiveProducts}</strong>
        </article>
      </div>

      {message && <p className="alert-success">{message}</p>}
      {error && <p className="alert-error">{error}</p>}

      <div className="admin-layout">
        <form className="admin-form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Editar producto" : "Crear producto"}</h3>

          <div className="form-grid">
            <label>
              Código
              <input
                type="text"
                name="codigo"
                placeholder="MED-013"
                value={formData.codigo}
                onChange={handleChange}
              />
            </label>

            <label>
              Nombre
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del medicamento"
                value={formData.nombre}
                onChange={handleChange}
              />
            </label>

            <label>
              Categoría
              <input
                type="text"
                name="categoria"
                placeholder="Analgésicos"
                value={formData.categoria}
                onChange={handleChange}
              />
            </label>

            <label>
              Laboratorio
              <input
                type="text"
                name="laboratorio"
                placeholder="Laboratorio"
                value={formData.laboratorio}
                onChange={handleChange}
              />
            </label>

            <label>
              Precio
              <input
                type="number"
                name="precio"
                min="0"
                placeholder="1990"
                value={formData.precio}
                onChange={handleChange}
              />
            </label>

            <label>
              Stock
              <input
                type="number"
                name="stock"
                min="0"
                placeholder="30"
                value={formData.stock}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Imagen URL
            <input
              type="text"
              name="imagen"
              placeholder="https://placehold.co/400x300?text=Medicamento"
              value={formData.imagen}
              onChange={handleChange}
            />
          </label>

          <label>
            Descripción
            <textarea
              name="descripcion"
              placeholder="Descripción del producto"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
            />
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              name="requiereReceta"
              checked={formData.requiereReceta}
              onChange={handleChange}
            />
            Requiere receta
          </label>

          <div className="admin-form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? "Guardando..."
                : editingId
                  ? "Actualizar producto"
                  : "Crear producto"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <div className="admin-products-card">
          <h3>Productos registrados</h3>

          {loadingProducts ? (
            <p>Cargando productos...</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.codigo}</td>
                      <td>
                        <strong>{product.nombre}</strong>
                        {product.requiereReceta && (
                          <span className="recipe-chip admin-recipe-chip">
                            Receta
                          </span>
                        )}
                      </td>
                      <td>{product.categoria}</td>
                      <td>${Number(product.precio).toLocaleString("es-CL")}</td>
                      <td>{product.stock}</td>
                      <td>
                        {product.activo ? (
                          <span className="status-pill active">Activo</span>
                        ) : (
                          <span className="status-pill inactive">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-secondary small-btn"
                            onClick={() => handleEdit(product)}
                          >
                            Editar
                          </button>

                          {product.activo ? (
                            <button
                              className="btn-danger small-btn"
                              onClick={() => handleDeactivate(product._id)}
                            >
                              Desactivar
                            </button>
                          ) : (
                            <button
                              className="btn-primary small-btn"
                              onClick={() => handleActivate(product._id)}
                            >
                              Activar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan="7">
                        No hay productos registrados en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;