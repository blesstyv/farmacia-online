import { useState } from "react";
import { mockProducts } from "../data/products.mock";
import { useCart } from "../context/CartContext";

const Catalog = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const { addToCart } = useCart();

  const categories = ["Todas", ...new Set(mockProducts.map((product) => product.categoria))];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "Todas" || product.categoria === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section>
      <div className="section-header">
        <h2>Catálogo de medicamentos</h2>
        <p>
          Productos simulados para fines académicos. No corresponde a una venta
          real de medicamentos.
        </p>
      </div>

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

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <img src={product.imagen} alt={product.nombre} />

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
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
              >
                Agregar al carrito
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Catalog;