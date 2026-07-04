import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import { useCart } from "../context/CartContext";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data.products || []);
      } catch (error) {
        setError(error.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = products.map((product) => product.categoria);
    return ["Todas", ...new Set(uniqueCategories)];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "Todas" || product.categoria === category;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage(`${product.nombre} agregado al carrito`);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  if (loading) {
    return (
      <section className="panel">
        <h2>Catálogo de medicamentos</h2>
        <p>Cargando productos desde MongoDB Atlas...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <h2>Catálogo de medicamentos</h2>
        <p className="alert-error">{error}</p>
        <p>
          Verifica que el backend esté ejecutándose en{" "}
          <strong>http://localhost:3000</strong>.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="section-header">
        <h2>Catálogo de medicamentos</h2>
        <p>
          Productos obtenidos desde MongoDB Atlas mediante el backend de la
          farmacia online. Venta simulada para fines académicos.
        </p>
      </div>

      {message && <p className="alert-success">{message}</p>}

      <div className="filters">
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

      {filteredProducts.length === 0 ? (
        <div className="panel">
          <p>No hay productos disponibles con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product._id}>
              <img
                src={product.imagen}
                alt={product.nombre}
                onError={(event) => {
                  event.currentTarget.src =
                    "https://placehold.co/400x300?text=Medicamento";
                }}
              />

              <div className="product-card-body">
                <span className="tag">{product.categoria}</span>

                <h3>{product.nombre}</h3>

                <p>{product.descripcion}</p>

                <div className="product-info">
                  <strong>${product.precio.toLocaleString("es-CL")}</strong>
                  <span>Stock: {product.stock}</span>
                </div>

                <button
                  className="btn-primary full"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Catalog;