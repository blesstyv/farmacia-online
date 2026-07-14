/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: AdminDashboard.jsx
 * Descripción:
 * Página de administración encargada de gestionar el catálogo
 * de medicamentos del sistema VidaSalud. Permite visualizar,
 * crear, editar, activar y desactivar productos registrados
 * en la base de datos.
 *
 * Funcionalidades:
 * - Carga de productos desde el backend.
 * - Visualización de estadísticas del catálogo.
 * - Registro de nuevos productos.
 * - Edición de productos existentes.
 * - Activación y desactivación de productos.
 * - Validación de formularios.
 * - Administración del inventario.
 *
 * Dependencias:
 * - React: Manejo de estados, efectos y optimización.
 * - api service: Comunicación con el backend.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

import { useEffect, useMemo, useRef, useState } from "react";

import {
  createProduct,
  deactivateProduct,
  getAdminProducts,
  updateProduct
} from "../services/api";

import "./AdminDashboard.css";

/**
 * Valores iniciales del formulario.
 */
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

/**
 * Imagen SVG utilizada cuando el producto no tiene imagen
 * o cuando su ruta no se puede cargar.
 */
const PRODUCT_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="340" viewBox="0 0 500 340">
    <rect width="500" height="340" fill="#eef7f3"/>
    <circle cx="250" cy="135" r="64" fill="#cde7dc"/>
    <rect x="215" y="92" width="70" height="86" rx="22" fill="#16835f"/>
    <rect x="215" y="125" width="70" height="20" fill="#ffffff"/>
    <text
      x="250"
      y="245"
      text-anchor="middle"
      font-family="Arial, sans-serif"
      font-size="25"
      font-weight="700"
      fill="#31554a"
    >
      Sin imagen
    </text>
  </svg>
`)}`;

/**
 * Formatea números como moneda chilena.
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
};

/**
 * Devuelve la imagen del producto o una imagen alternativa.
 */
const getProductImage = (product) => {
  if (product?.imagen && product.imagen.trim()) {
    return product.imagen.trim();
  }

  return PRODUCT_PLACEHOLDER;
};

const AdminDashboard = () => {
  // Listado completo recibido desde el backend.
  const [products, setProducts] = useState([]);

  // Información del formulario.
  const [formData, setFormData] = useState(initialForm);

  // ID del producto seleccionado para editar.
  const [editingId, setEditingId] = useState(null);

  // Estados de carga.
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Mensajes de resultado.
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Herramientas del inventario.
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [sortOption, setSortOption] = useState("nombre-asc");

  // Permite desplazarse directamente al formulario al editar.
  const formSectionRef = useRef(null);

  /**
   * Obtiene todos los productos, tanto activos como inactivos,
   * utilizando la función administrativa existente en api.js.
   */
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setError("");

      const data = await getAdminProducts();

      setProducts(data.products || []);
    } catch (requestError) {
      setError(
        requestError.message || "No se pudieron cargar los productos."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  /**
   * Carga productos al abrir el panel.
   */
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Calcula las estadísticas visibles en la parte superior.
   */
  const stats = useMemo(() => {
    const totalProducts = products.length;

    const activeProducts = products.filter(
      (product) => product.activo
    ).length;

    const inactiveProducts = products.filter(
      (product) => !product.activo
    ).length;

    const totalStock = products.reduce((total, product) => {
      return total + Number(product.stock || 0);
    }, 0);

    const productsWithoutStock = products.filter((product) => {
      return Number(product.stock) <= 0;
    }).length;

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalStock,
      productsWithoutStock
    };
  }, [products]);

  /**
   * Genera la lista de categorías para el filtro.
   */
  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.categoria)
          .filter(Boolean)
      )
    ].sort((categoryA, categoryB) => {
      return categoryA.localeCompare(categoryB, "es");
    });
  }, [products]);

  /**
   * Filtra y ordena los productos sin solicitar nuevamente
   * información al backend.
   */
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.nombre?.toLowerCase().includes(normalizedSearch) ||
        product.codigo?.toLowerCase().includes(normalizedSearch) ||
        product.categoria?.toLowerCase().includes(normalizedSearch) ||
        product.laboratorio?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "activos" && product.activo) ||
        (statusFilter === "inactivos" && !product.activo) ||
        (
          statusFilter === "sin-stock" &&
          Number(product.stock) <= 0
        );

      const matchesCategory =
        categoryFilter === "todas" ||
        product.categoria === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return [...result].sort((productA, productB) => {
      if (sortOption === "nombre-desc") {
        return productB.nombre.localeCompare(productA.nombre, "es");
      }

      if (sortOption === "stock-asc") {
        return Number(productA.stock) - Number(productB.stock);
      }

      if (sortOption === "stock-desc") {
        return Number(productB.stock) - Number(productA.stock);
      }

      if (sortOption === "precio-asc") {
        return Number(productA.precio) - Number(productB.precio);
      }

      if (sortOption === "precio-desc") {
        return Number(productB.precio) - Number(productA.precio);
      }

      return productA.nombre.localeCompare(productB.nombre, "es");
    });
  }, [
    products,
    searchTerm,
    statusFilter,
    categoryFilter,
    sortOption
  ]);

  /**
   * Actualiza el formulario.
   */
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentForm) => {
      return {
        ...currentForm,
        [name]: type === "checkbox" ? checked : value
      };
    });
  };

  /**
   * Restablece el formulario y cancela la edición.
   */
  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  /**
   * Limpia buscador y filtros.
   */
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setCategoryFilter("todas");
    setSortOption("nombre-asc");
  };

  /**
   * Valida los datos antes de enviarlos.
   */
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

    if (
      formData.precio === "" ||
      Number(formData.precio) < 0
    ) {
      return "El precio debe ser igual o mayor a cero.";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      return "El stock debe ser igual o mayor a cero.";
    }

    return "";
  };

  /**
   * Construye el objeto esperado por el backend.
   */
  const buildProductPayload = () => {
    const payload = {
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria.trim(),
      laboratorio:
        formData.laboratorio.trim() || "No informado",
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      requiereReceta: formData.requiereReceta
    };

    if (formData.imagen.trim()) {
      payload.imagen = formData.imagen.trim();
    }

    return payload;
  };

  /**
   * Crea o actualiza un producto.
   *
   * Las llamadas CRUD originales se mantienen:
   * - createProduct para crear.
   * - updateProduct para actualizar.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

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
    } catch (requestError) {
      setError(
        requestError.message || "No se pudo guardar el producto."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Carga un producto en el formulario para editarlo.
   */
  const handleEdit = (product) => {
    setMessage("");
    setError("");

    setEditingId(product._id);

    setFormData({
      codigo: product.codigo || "",
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      categoria: product.categoria || "",
      laboratorio: product.laboratorio || "",
      precio: product.precio ?? "",
      stock: product.stock ?? "",
      imagen: product.imagen || "",
      requiereReceta: Boolean(product.requiereReceta)
    });

    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  /**
   * Desactiva lógicamente un producto.
   */
  const handleDeactivate = async (product) => {
    const confirmAction = window.confirm(
      `¿Seguro que deseas desactivar "${product.nombre}"?`
    );

    if (!confirmAction) {
      return;
    }

    try {
      setProcessingId(product._id);
      setMessage("");
      setError("");

      await deactivateProduct(product._id);

      setMessage(
        `El producto "${product.nombre}" fue desactivado correctamente.`
      );

      await loadProducts();
    } catch (requestError) {
      setError(
        requestError.message ||
          "No se pudo desactivar el producto."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Reactiva un producto previamente desactivado.
   */
  const handleActivate = async (product) => {
    try {
      setProcessingId(product._id);
      setMessage("");
      setError("");

      await updateProduct(product._id, {
        activo: true
      });

      setMessage(
        `El producto "${product.nombre}" fue activado correctamente.`
      );

      await loadProducts();
    } catch (requestError) {
      setError(
        requestError.message ||
          "No se pudo activar el producto."
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <header className="admin-dashboard-header">
          <div>
            <span className="admin-header-label">
              Panel administrador
            </span>

            <h1>Gestión de productos</h1>

            <p>
              Administra el catálogo, los precios, el stock y el
              estado de los medicamentos almacenados en MongoDB Atlas.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadProducts}
            disabled={loadingProducts}
          >
            {loadingProducts ? "Actualizando..." : "Actualizar listado"}
          </button>
        </header>

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon">📦</span>
            <div>
              <span>Total de productos</span>
              <strong>{stats.totalProducts}</strong>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">✅</span>
            <div>
              <span>Productos activos</span>
              <strong>{stats.activeProducts}</strong>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">📊</span>
            <div>
              <span>Stock total</span>
              <strong>{stats.totalStock}</strong>
            </div>
          </article>

          <article className="admin-stat-card admin-stat-warning">
            <span className="admin-stat-icon">⚠️</span>
            <div>
              <span>Productos sin stock</span>
              <strong>{stats.productsWithoutStock}</strong>
            </div>
          </article>

          <article className="admin-stat-card admin-stat-muted">
            <span className="admin-stat-icon">⏸️</span>
            <div>
              <span>Desactivados</span>
              <strong>{stats.inactiveProducts}</strong>
            </div>
          </article>
        </div>

        <div
          className="admin-messages"
          aria-live="polite"
        >
          {message && (
            <div className="admin-alert admin-alert-success">
              <span>✓</span>
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="admin-alert admin-alert-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="admin-workspace">
          <aside
            className="admin-form-panel"
            ref={formSectionRef}
          >
            <div className="admin-panel-heading">
              <div>
                <span className="admin-section-label">
                  {editingId ? "Modo edición" : "Nuevo registro"}
                </span>

                <h2>
                  {editingId
                    ? "Editar producto"
                    : "Crear producto"}
                </h2>
              </div>

              {editingId && (
                <span className="admin-editing-badge">
                  Editando
                </span>
              )}
            </div>

            <form
              className="admin-product-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Código *</span>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    placeholder="Ejemplo: MED-001"
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Nombre *</span>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del medicamento"
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Categoría *</span>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    placeholder="Ejemplo: Analgésicos"
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Laboratorio</span>
                  <input
                    type="text"
                    name="laboratorio"
                    value={formData.laboratorio}
                    onChange={handleChange}
                    placeholder="Nombre del laboratorio"
                  />
                </label>

                <label className="admin-field">
                  <span>Precio *</span>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Stock *</span>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="admin-field admin-field-full">
                  <span>Imagen URL</span>
                  <input
                    type="text"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    placeholder="/productos/paracetamol-500mg.png"
                  />
                  <small>
                    Utiliza una ruta de la carpeta
                    frontend/public/productos.
                  </small>
                </label>

                <label className="admin-field admin-field-full">
                  <span>Descripción *</span>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Descripción breve del medicamento"
                    required
                  />
                </label>

                <label className="admin-checkbox-card admin-field-full">
                  <input
                    type="checkbox"
                    name="requiereReceta"
                    checked={formData.requiereReceta}
                    onChange={handleChange}
                  />

                  <span className="admin-checkbox-visual" />

                  <span>
                    <strong>Requiere receta</strong>
                    <small>
                      Marca esta opción para identificar medicamentos
                      que requieren receta.
                    </small>
                  </span>
                </label>
              </div>

              {formData.imagen.trim() && (
                <div className="admin-form-image-preview">
                  <span>Vista previa</span>

                  <img
                    src={formData.imagen}
                    alt="Vista previa del producto"
                    onError={(event) => {
                      event.currentTarget.src = PRODUCT_PLACEHOLDER;
                    }}
                  />
                </div>
              )}

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="admin-button admin-button-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Actualizar producto"
                      : "Crear producto"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </aside>

          <main className="admin-inventory-panel">
            <div className="admin-inventory-heading">
              <div>
                <span className="admin-section-label">
                  Inventario
                </span>

                <h2>Productos registrados</h2>

                <p>
                  Se muestran {filteredProducts.length} de{" "}
                  {products.length} productos.
                </p>
              </div>
            </div>

            <div className="admin-toolbar">
              <label className="admin-search-field">
                <span>Buscar producto</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                  placeholder="Nombre, código, categoría..."
                />
              </label>

              <label className="admin-filter-field">
                <span>Estado</span>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                  }}
                >
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                  <option value="sin-stock">Sin stock</option>
                </select>
              </label>

              <label className="admin-filter-field">
                <span>Categoría</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                  }}
                >
                  <option value="todas">
                    Todas las categorías
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-filter-field">
                <span>Ordenar</span>
                <select
                  value={sortOption}
                  onChange={(event) => {
                    setSortOption(event.target.value);
                  }}
                >
                  <option value="nombre-asc">
                    Nombre A–Z
                  </option>
                  <option value="nombre-desc">
                    Nombre Z–A
                  </option>
                  <option value="stock-asc">
                    Menor stock
                  </option>
                  <option value="stock-desc">
                    Mayor stock
                  </option>
                  <option value="precio-asc">
                    Menor precio
                  </option>
                  <option value="precio-desc">
                    Mayor precio
                  </option>
                </select>
              </label>

              <button
                type="button"
                className="admin-clear-filters"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            </div>

            {loadingProducts ? (
              <div className="admin-loading-state">
                <div className="admin-loader" />
                <p>Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="admin-empty-state">
                <span>🔎</span>
                <h3>No se encontraron productos</h3>
                <p>
                  Prueba cambiando el texto de búsqueda o los filtros.
                </p>

                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={clearFilters}
                >
                  Mostrar todos
                </button>
              </div>
            ) : (
              <div className="admin-products-grid">
                {filteredProducts.map((product) => {
                  const isProcessing =
                    processingId === product._id;

                  return (
                    <article
                      key={product._id}
                      className={`admin-product-card ${
                        !product.activo ? "is-inactive" : ""
                      }`}
                    >
                      <div className="admin-product-image-wrapper">
                        <img
                          src={getProductImage(product)}
                          alt={product.nombre}
                          className="admin-product-image"
                          onError={(event) => {
                            event.currentTarget.src =
                              PRODUCT_PLACEHOLDER;
                          }}
                        />

                        <div className="admin-product-badges">
                          <span
                            className={`admin-status-badge ${
                              product.activo
                                ? "is-active"
                                : "is-disabled"
                            }`}
                          >
                            {product.activo
                              ? "Activo"
                              : "Inactivo"}
                          </span>

                          {product.requiereReceta && (
                            <span className="admin-recipe-badge">
                              Requiere receta
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="admin-product-content">
                        <div className="admin-product-title">
                          <div>
                            <span className="admin-product-code">
                              {product.codigo}
                            </span>

                            <h3>{product.nombre}</h3>
                          </div>
                        </div>

                        <p className="admin-product-description">
                          {product.descripcion ||
                            "Sin descripción disponible."}
                        </p>

                        <div className="admin-product-details">
                          <div>
                            <span>Categoría</span>
                            <strong>
                              {product.categoria || "No informada"}
                            </strong>
                          </div>

                          <div>
                            <span>Laboratorio</span>
                            <strong>
                              {product.laboratorio ||
                                "No informado"}
                            </strong>
                          </div>

                          <div>
                            <span>Precio</span>
                            <strong className="admin-price-value">
                              {formatCurrency(product.precio)}
                            </strong>
                          </div>

                          <div>
                            <span>Stock</span>
                            <strong
                              className={
                                Number(product.stock) <= 0
                                  ? "admin-stock-empty"
                                  : ""
                              }
                            >
                              {product.stock} unidades
                            </strong>
                          </div>
                        </div>

                        <div className="admin-product-actions">
                          <button
                            type="button"
                            className="admin-button admin-button-edit"
                            onClick={() => handleEdit(product)}
                            disabled={isProcessing}
                          >
                            Editar producto
                          </button>

                          {product.activo ? (
                            <button
                              type="button"
                              className="admin-button admin-button-danger"
                              onClick={() => {
                                handleDeactivate(product);
                              }}
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? "Procesando..."
                                : "Desactivar"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="admin-button admin-button-activate"
                              onClick={() => {
                                handleActivate(product);
                              }}
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? "Procesando..."
                                : "Activar"}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;