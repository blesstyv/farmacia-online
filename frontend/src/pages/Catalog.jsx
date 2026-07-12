/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Catalog.jsx
 * Descripción:
 * Página encargada de mostrar el catálogo de medicamentos
 * disponibles en la farmacia online VidaSalud.
 * Obtiene los productos desde el backend mediante la API,
 * permitiendo al usuario buscar, filtrar por categoría y agregar
 * medicamentos al carrito de compras.
 *
 * Funcionalidades:
 * - Carga de productos desde el backend.
 * - Visualización del catálogo de medicamentos.
 * - Búsqueda por nombre de producto.
 * - Filtrado por categoría.
 * - Validación de disponibilidad de stock.
 * - Agregar productos al carrito.
 * - Manejo de estados de carga y errores.
 *
 * Dependencias:
 * - React: Manejo de estados y efectos del componente.
 * - api service: Comunicación con el backend.
 * - CartContext: Gestión del carrito de compras.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import { useCart } from "../context/CartContext";

/**
 * Renderiza el catálogo de medicamentos.
 *
 * Obtiene la información de productos desde la API,
 * aplica filtros de búsqueda y categoría, y permite
 * agregar medicamentos disponibles al carrito.
 *
 * @returns {JSX.Element}
 */
const Catalog = () => {
  // Almacena la lista de productos obtenidos desde el backend.
  const [products, setProducts] = useState([]);
  // Guarda el texto ingresado en el buscador.
  const [search, setSearch] = useState("");
  // Controla la categoría seleccionada para filtrar productos.
  const [category, setCategory] = useState("Todas");
  // Indica si la información aún se encuentra cargando.
  const [loading, setLoading] = useState(true);
  // Almacena mensajes de error durante la carga de productos.
  const [error, setError] = useState("");
  // Muestra mensajes temporales al agregar productos al carrito.
  const [message, setMessage] = useState("");

  // Obtiene la función para agregar productos al carrito.
  const { addToCart } = useCart();

  /**
   * Obtiene los productos registrados en el sistema.
   *
   * Ejecuta una petición al backend al cargar la página
   * y almacena los productos recibidos.
   *
   * @async
   */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Activa estado de carga y limpia errores anteriores.
        setLoading(true);
        setError("");

        // Solicita los productos mediante el servicio de API.
        const data = await getProducts();
        // Guarda la lista de productos obtenidos.
        setProducts(data.products || []);
      } catch (error) {
        // Guarda el mensaje de error si falla la petición.
        setError(error.message || "Error al cargar productos");
      } finally {
        // Finaliza el estado de carga.
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /**
  * Genera dinámicamente la lista de categorías disponibles.
  *
  * Obtiene las categorías existentes en los productos
  * eliminando valores repetidos.
  *
  * @returns {Array<string>}
  */
  const categories = useMemo(() => {
    const uniqueCategories = products.map((product) => product.categoria);
    return ["Todas", ...new Set(uniqueCategories)];
  }, [products]);

  /**
   * Filtra los productos según los criterios seleccionados.
   *
   * Permite realizar búsquedas por nombre y aplicar filtros
   * según la categoría del medicamento.
   */
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "Todas" || product.categoria === category;

    return matchesSearch && matchesCategory;
  });

  /**
   * Agrega un producto seleccionado al carrito.
   *
   * También muestra un mensaje temporal confirmando
   * la acción realizada.
   *
   * @param {Object} product Producto seleccionado.
   */
  const handleAddToCart = (product) => {
    // Agrega el producto mediante el contexto del carrito.
    addToCart(product);
    // Muestra confirmación al usuario.
    setMessage(`${product.nombre} agregado al carrito`);

    // Limpia el mensaje después de unos segundos.
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // Muestra mensaje mientras se cargan los productos.
  if (loading) {
    return (
      <section className="panel">
        <h2>Catálogo de medicamentos</h2>
        <p>Cargando productos desde MongoDB Atlas...</p>
      </section>
    );
  }

  // Muestra mensaje cuando ocurre un error en la carga.
  if (error) {
    return (
      <section className="panel">
        <h2>Catálogo de medicamentos</h2>
        <p className="alert-error">{error}</p>
        <p>
          Verifica que el backend esté ejecutándose en{" "}
          <strong>Backend online en render</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="catalog-page">
      {/* Presentación general del catálogo */}
      <div className="catalog-hero">
        <div>
          <span className="hero-label">Medicamentos disponibles</span>
          <h2>Catálogo de farmacia</h2>
          <p>
            Productos obtenidos desde MongoDB Atlas mediante el backend de la
            farmacia online. Venta simulada para fines académicos.
          </p>
        </div>

        {/* Cantidad total de productos registrados */}
        <div className="catalog-summary">
          <strong>{products.length}</strong>
          <span>productos registrados</span>
        </div>
      </div>

      {/* Mensaje de confirmación al agregar productos */}
      {message && <p className="alert-success">{message}</p>}

      {/* Herramientas de búsqueda y filtrado */}
      <div className="catalog-toolbar">
        <input
          type="text"
          placeholder="Buscar medicamento..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Muestra productos filtrados o mensaje sin resultados */}
      {filteredProducts.length === 0 ? (
        <div className="panel">
          <p>No hay productos disponibles con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product._id}>
              {/* Información visual del producto */}
              <div className="product-image-wrapper">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://placehold.co/400x300?text=Medicamento";
                  }}
                />

                {/* Estado de disponibilidad según stock */}
                {product.stock > 0 ? (
                  <span className="stock-chip available">Disponible</span>
                ) : (
                  <span className="stock-chip unavailable">Sin stock</span>
                )}
              </div>

              <div className="product-card-body">
                <span className="tag">{product.categoria}</span>

                <h3>{product.nombre}</h3>

                <p>{product.descripcion}</p>

                <div className="product-meta">
                  <span>Stock: {product.stock}</span>

                  {product.requiereReceta && (
                    <span className="recipe-chip">Requiere receta</span>
                  )}
                </div>

                <div className="product-footer">
                  <strong>${product.precio.toLocaleString("es-CL")}</strong>

                  <button
                    className="btn-primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Catalog;