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
 *  * - Carga los productos desde el backend mediante la función getProducts().
 * - Muestra los medicamentos obtenidos desde MongoDB Atlas.
 * - Permite buscar medicamentos por nombre, descripción, categoría o laboratorio.
 * - Permite filtrar medicamentos por categoría.
 * - Permite agregar productos al carrito.
 * - Muestra una imagen real si el producto la tiene.
 * - Genera una imagen visual de respaldo si el producto no tiene foto válida.
 *
 * Dependencias:
 * - React: Manejo de estados y efectos del componente.
 * - api service: Comunicación con el backend.
 * - CartContext: Gestión del carrito de compras.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
 

// Importa hooks de React para manejar estado, efectos y cálculos memorizados.
import { useEffect, useMemo, useState } from "react";

// Importa la función que consulta los productos desde el backend.
import { getProducts } from "../services/api";

// Importa el contexto del carrito para poder agregar productos.
import { useCart } from "../context/CartContext";

/**
 * Normaliza textos para realizar búsquedas y comparaciones.
 *
 * Esta función sirve para:
 * - Convertir texto a minúsculas.
 * - Quitar tildes.
 * - Eliminar espacios innecesarios.
 *
 * Ejemplo:
 * "Psicofármacos" pasa a "psicofarmacos".
 */
const normalizeText = (text = "") => {
  // Convierte el valor recibido a texto para evitar errores si viene undefined o null.
  return text
    .toString()
    // Convierte todo el texto a minúsculas.
    .toLowerCase()
    // Separa letras de sus acentos.
    .normalize("NFD")
    // Elimina los acentos del texto.
    .replace(/[\u0300-\u036f]/g, "")
    // Elimina espacios al inicio y al final.
    .trim();
};

/**
 * Crea una imagen SVG de respaldo para productos sin fotografía real.
 *
 * Esto se usa cuando:
 * - El producto no trae imagen desde MongoDB.
 * - La imagen viene vacía.
 * - La imagen es un placeholder gris.
 * - La imagen externa falla al cargar.
 * 
 */
const createFallbackImage = (
  title = "Medicamento",
  subtitle = "Farmacia Online",
  accentColor = "#14b8a6"
) => {
  // Limita el largo del título para que no se salga de la imagen.
  const safeTitle = title.length > 22 ? `${title.slice(0, 22)}...` : title;

  // Limita el largo del subtítulo o categoría.
  const safeSubtitle =
    subtitle.length > 28 ? `${subtitle.slice(0, 28)}...` : subtitle;

  // Crea una imagen SVG con diseño de medicamento.
  const svg = `
    <svg width="800" height="520" viewBox="0 0 800 520" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="800" y2="520" gradientUnits="userSpaceOnUse">
          <stop stop-color="#f8fafc"/>
          <stop offset="1" stop-color="#dbeafe"/>
        </linearGradient>

        <linearGradient id="pill" x1="260" y1="150" x2="540" y2="370" gradientUnits="userSpaceOnUse">
          <stop stop-color="${accentColor}"/>
          <stop offset="1" stop-color="#0f172a"/>
        </linearGradient>
      </defs>

      <rect width="800" height="520" rx="36" fill="url(#bg)"/>

      <circle cx="130" cy="95" r="70" fill="${accentColor}" opacity="0.15"/>
      <circle cx="700" cy="430" r="95" fill="${accentColor}" opacity="0.12"/>

      <g transform="translate(300 125) rotate(38 100 100)">
        <rect x="20" y="55" width="280" height="130" rx="65" fill="url(#pill)"/>
        <path d="M160 55H235C270.899 55 300 84.1015 300 120C300 155.899 270.899 185 235 185H160V55Z" fill="#fb7185"/>
        <circle cx="235" cy="97" r="16" fill="#fecdd3" opacity="0.75"/>
      </g>

      <text x="400" y="350" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800" fill="#0f172a">
        ${safeTitle}
      </text>

      <text x="400" y="400" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="#475569">
        ${safeSubtitle}
      </text>

      <text x="400" y="452" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="${accentColor}">
        Farmacia online académica
      </text>
    </svg>
  `;

  // Convierte el SVG en una URL que puede usarse dentro de src en una imagen.
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

/**
 * Devuelve un color distinto según la categoría del medicamento.
 *
 * Esto permite que las imágenes generadas no se vean todas iguales.
 */
const getCategoryColor = (category = "") => {
  // Normaliza la categoría para comparar sin tildes ni mayúsculas.
  const normalizedCategory = normalizeText(category);

  // Colores definidos para distintas categorías del catálogo.
  const colors = {
    psicofarmacos: "#7c3aed",
    analgesico: "#0f766e",
    analgesicos: "#0f766e",
    antiinflamatorios: "#2563eb",
    vitaminas: "#ea580c",
    "higiene y prevencion": "#0891b2",
    "cuidado general": "#16a34a",
    dermocosmetica: "#db2777",
    "dispositivos medicos": "#475569",
    antibioticos: "#dc2626",
    "tratamientos cronicos": "#9333ea"
  };

  // Si no encuentra una categoría definida, usa el color principal de la farmacia.
  return colors[normalizedCategory] || "#14b8a6";
};

/**
 * Determina qué imagen debe mostrarse para cada producto.
 *
 * Si el producto tiene una imagen real, la usa.
 * Si no tiene imagen o es un placeholder, genera una imagen de respaldo.
 */
const getProductImage = (product) => {
  // Obtiene la imagen desde los posibles nombres del campo en la base de datos.
  const currentImage = product?.imagen || product?.image || "";

  // Convierte la URL de la imagen a minúsculas para revisarla.
  const normalizedImage = currentImage.toLowerCase();

  // Detecta imágenes inválidas o placeholders.
  const isInvalidImage =
    !currentImage ||
    normalizedImage.includes("placeholder") ||
    normalizedImage.includes("via.placeholder") ||
    normalizedImage.includes("placehold.co") ||
    normalizedImage.includes("text=");

  // Si la imagen es válida, se muestra tal como viene desde MongoDB.
  if (!isInvalidImage) {
    return currentImage;
  }

  // Si la imagen no es válida, se crea una imagen de respaldo.
  return createFallbackImage(
    product?.nombre || "Medicamento",
    product?.categoria || "Producto farmacéutico",
    getCategoryColor(product?.categoria)
  );
};

/**
 * Formatea un número como precio en pesos chilenos.
 */
const formatPrice = (value = 0) => {
  // Usa formato local chileno para que el precio se vea como $2.610.
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
};

/**
 * Componente principal del catálogo de medicamentos.
 */
const Catalog = () => {
  // Guarda la lista completa de productos obtenidos desde el backend.
  const [products, setProducts] = useState([]);

  // Guarda el texto ingresado por el usuario en el buscador.
  const [search, setSearch] = useState("");

  // Guarda la categoría seleccionada para filtrar productos.
  const [category, setCategory] = useState("Todas");

  // Indica si los productos aún se están cargando.
  const [loading, setLoading] = useState(true);

  // Guarda mensajes de error si falla la carga desde la API.
  const [error, setError] = useState("");

  // Guarda mensajes temporales cuando se agrega un producto al carrito.
  const [message, setMessage] = useState("");

  // Obtiene la función para agregar productos al carrito desde el contexto.
  const { addToCart } = useCart();

  /**
   * Carga productos desde el backend cuando se abre el catálogo.
   *
   * Esta llamada usa getProducts(), que ya está conectada a la API.
   * No se modifica la URL de Render ni la conexión con MongoDB Atlas.
   */
  useEffect(() => {
    // Permite evitar actualizar estados si el componente se desmonta.
    let isMounted = true;

    // Función interna para cargar productos desde el backend.
    const loadProducts = async () => {
      try {
        // Activa estado de carga.
        setLoading(true);

        // Limpia errores anteriores.
        setError("");

        // Consulta productos desde la API.
        const response = await getProducts();

        // Soporta distintos formatos de respuesta del backend.
        const productsFromApi = Array.isArray(response)
          ? response
          : response?.products || response?.data || [];

        // Guarda los productos solo si el componente sigue montado.
        if (isMounted) {
          setProducts(productsFromApi);
        }
      } catch (apiError) {
        // Guarda un mensaje de error si falla la consulta.
        if (isMounted) {
          setError(
            apiError?.message ||
              "No se pudieron cargar los medicamentos desde el backend."
          );
        }
      } finally {
        // Finaliza el estado de carga.
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Ejecuta la carga de productos.
    loadProducts();

    // Limpia el montaje del componente.
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Obtiene las categorías disponibles desde los productos cargados.
   *
   * useMemo evita recalcular categorías innecesariamente.
   */
  const categories = useMemo(() => {
    // Extrae categorías existentes.
    const categoryList = products
      .map((product) => product.categoria)
      .filter(Boolean);

    // Agrega "Todas" al inicio y evita categorías repetidas.
    return ["Todas", ...new Set(categoryList)];
  }, [products]);

  /**
   * Filtra los productos según búsqueda y categoría seleccionada.
   */
  const filteredProducts = useMemo(() => {
    // Normaliza el texto ingresado por el usuario.
    const normalizedSearch = normalizeText(search);

    // Filtra cada producto del catálogo.
    return products.filter((product) => {
      // Une varios campos del producto para que la búsqueda sea más completa.
      const productText = normalizeText(
        `${product.nombre || ""} ${product.descripcion || ""} ${
          product.categoria || ""
        } ${product.laboratorio || ""}`
      );

      // Verifica si el producto coincide con la búsqueda.
      const matchesSearch =
        normalizedSearch.length === 0 || productText.includes(normalizedSearch);

      // Verifica si el producto coincide con la categoría seleccionada.
      const matchesCategory =
        category === "Todas" || product.categoria === category;

      // El producto se muestra solo si cumple búsqueda y categoría.
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  /**
   * Agrega un producto al carrito si tiene stock disponible.
   */
  const handleAddToCart = (product) => {
    // Verifica si el producto está activo.
    const productIsActive = product.activo !== false;

    // Verifica si el producto tiene stock.
    const productHasStock = Number(product.stock) > 0;

    // Si no está activo o no tiene stock, no se agrega al carrito.
    if (!productIsActive || !productHasStock) {
      setMessage("Este producto no se encuentra disponible.");

      // Limpia el mensaje después de unos segundos.
      setTimeout(() => {
        setMessage("");
      }, 2500);

      return;
    }

    // Agrega el producto al carrito usando el contexto.
    addToCart(product);

    // Muestra un mensaje visual al usuario.
    setMessage(`${product.nombre} fue agregado al carrito.`);

    // Limpia el mensaje después de unos segundos.
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  /**
   * Muestra mensaje mientras se cargan los productos.
   */
  if (loading) {
    return (
      <main className="catalog-page">
        <section className="panel catalog-state-card">
          <h2>Catálogo de medicamentos</h2>
          <p>Cargando productos desde MongoDB Atlas...</p>
        </section>
      </main>
    );
  }

  /**
   * Muestra mensaje si ocurre un error al cargar productos.
   */
  if (error) {
    return (
      <main className="catalog-page">
        <section className="panel catalog-state-card">
          <h2>Catálogo de medicamentos</h2>
          <p className="alert-error">{error}</p>
          <p>
            Verifica que el backend esté funcionando en{" "}
            <strong>Render</strong> y que la variable{" "}
            <strong>VITE_API_URL</strong> esté correctamente configurada.
          </p>
        </section>
      </main>
    );
  }

  /**
   * Render principal del catálogo.
   */
  return (
    <main className="catalog-page">
      {/* Encabezado del catálogo */}
      <section className="catalog-header">
        <div>
          <span className="hero-label">Catálogo conectado a MongoDB Atlas</span>

          <h1 className="catalog-title">Catálogo de medicamentos</h1>

          <p className="catalog-subtitle">
            Productos disponibles en la farmacia online académica. Puedes buscar,
            filtrar por categoría y agregar medicamentos al carrito para generar
            una compra ficticia.
          </p>
        </div>
      </section>

      {/* Buscador y filtro de categoría */}
      <section className="catalog-toolbar">
        <div className="catalog-search-box">
          <label htmlFor="search-product">Buscar medicamento</label>

          <input
            id="search-product"
            type="text"
            placeholder="Ejemplo: paracetamol, omeprazol, vitaminas..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="catalog-filter-box">
          <label htmlFor="category-filter">Filtrar por categoría</label>

          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((currentCategory) => (
              <option key={currentCategory} value={currentCategory}>
                {currentCategory}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Mensaje temporal cuando se agrega un producto */}
      {message && <p className="catalog-message">{message}</p>}

      {/* Resumen de productos mostrados */}
      <section className="catalog-summary">
        <p>
          Mostrando <strong>{filteredProducts.length}</strong> de{" "}
          <strong>{products.length}</strong> medicamentos registrados.
        </p>
      </section>

      {/* Si no hay productos filtrados, muestra mensaje */}
      {filteredProducts.length === 0 ? (
        <section className="panel catalog-state-card">
          <h2>No se encontraron medicamentos</h2>
          <p>Intenta cambiar el texto de búsqueda o selecciona otra categoría.</p>
        </section>
      ) : (
        /* Grilla de productos */
        <section className="product-grid">
          {filteredProducts.map((product) => {
            // Verifica si el producto está activo.
            const productIsActive = product.activo !== false;

            // Verifica si el producto tiene stock.
            const productHasStock = Number(product.stock) > 0;

            // Define si el producto está disponible para agregar al carrito.
            const isAvailable = productIsActive && productHasStock;

            return (
              <article
                className={`product-card ${
                  !isAvailable ? "product-card-disabled" : ""
                }`}
                key={product._id || product.id || product.codigo}
              >
                {/* Imagen del producto */}
                <div className="product-image-wrapper">
                  <img
                    // Usa imagen real si existe; si no, genera imagen de respaldo.
                    src={getProductImage(product)}
                    // Texto alternativo con el nombre del producto.
                    alt={product.nombre}
                    // Clase para aplicar estilos visuales.
                    className="product-card-image"
                    // Carga diferida para mejorar rendimiento.
                    loading="lazy"
                    // Si la imagen externa falla, usa imagen generada.
                    onError={(event) => {
                      event.currentTarget.src = createFallbackImage(
                        product?.nombre || "Medicamento",
                        product?.categoria || "Producto farmacéutico",
                        getCategoryColor(product?.categoria)
                      );
                    }}
                  />

                  {/* Estado visual de disponibilidad */}
                  {isAvailable ? (
                    <span className="stock-chip available">Disponible</span>
                  ) : (
                    <span className="stock-chip unavailable">Sin stock</span>
                  )}
                </div>

                {/* Información textual del producto */}
                <div className="product-card-body">
                  <span className="tag">
                    {product.categoria || "Sin categoría"}
                  </span>

                  <h3>{product.nombre}</h3>

                  <p>
                    {product.descripcion ||
                      "Producto farmacéutico disponible en catálogo."}
                  </p>

                  <div className="product-meta">
                    <span className="product-stock">
                      Stock: {Number(product.stock) || 0}
                    </span>

                    {/* Etiqueta para productos que requieren receta */}
                    {product.requiereReceta && (
                      <span className="recipe-badge">Requiere receta</span>
                    )}
                  </div>

                  {/* Precio y botón de acción */}
                  <div className="product-actions">
                    <strong className="product-price">
                      {formatPrice(product.precio)}
                    </strong>

                    <button
                      type="button"
                      className="add-to-cart-btn"
                      disabled={!isAvailable}
                      onClick={() => handleAddToCart(product)}
                    >
                      {isAvailable ? "Agregar" : "No disponible"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Catalog;