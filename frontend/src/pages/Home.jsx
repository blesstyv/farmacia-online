import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-label">Proyecto académico</span>

        <h1>Farmacia Online</h1>

        <p>
          Sistema web simulado para venta académica de medicamentos, con catálogo,
          carrito de compras, control de stock, roles de usuario y boleta digital
          simulada.
        </p>

        <div className="hero-actions">
          <Link to="/catalogo" className="btn-primary">
            Ver catálogo
          </Link>

          <Link to="/registro" className="btn-secondary">
            Crear cuenta
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;