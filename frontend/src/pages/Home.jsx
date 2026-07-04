import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home-page">
      <div className="hero-store">
        <div className="hero-text">
          <span className="hero-label">Proyecto académico</span>

          <h1>Tu farmacia online simulada</h1>

          <p>
            Plataforma web para consultar medicamentos, agregarlos al carrito y
            generar pedidos con boleta digital simulada.
          </p>

          <div className="hero-actions">
            <Link to="/catalogo" className="btn-primary">
              Ver medicamentos
            </Link>

            <Link to="/registro" className="btn-secondary">
              Crear cuenta
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-icon">💊</div>
          <h3>Catálogo conectado a MongoDB Atlas</h3>
          <p>
            Productos, stock y precios administrados desde el backend del
            sistema.
          </p>
        </div>
      </div>

      <div className="benefits-grid">
        <article>
          <span>🚚</span>
          <h3>Pedido simulado</h3>
          <p>Generación académica de pedidos desde el carrito.</p>
        </article>

        <article>
          <span>🔒</span>
          <h3>Usuarios seguros</h3>
          <p>Registro, login y roles con token JWT.</p>
        </article>

        <article>
          <span>📦</span>
          <h3>Control de stock</h3>
          <p>Productos administrados desde MongoDB Atlas.</p>
        </article>
      </div>
    </section>
  );
};

export default Home;