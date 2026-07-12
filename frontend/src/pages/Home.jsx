/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Home.jsx
 * Descripción:
 * Página principal de la aplicación VidaSalud.
 * Presenta información general de la farmacia online simulada,
 * sus principales funcionalidades y accesos rápidos hacia
 * otras secciones del sistema.
 *
 * Funcionalidades:
 * - Presentación del proyecto.
 * - Navegación hacia el catálogo de medicamentos.
 * - Acceso al registro de usuarios.
 * - Visualización de características principales del sistema.
 *
 * Dependencias:
 * - react-router-dom: Navegación entre páginas mediante Link.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { Link } from "react-router-dom";

/**
 * Renderiza la página principal del sistema.
 *
 * Muestra una introducción de la plataforma, información sobre
 * la conexión con el backend y base de datos, además de
 * accesos directos hacia las funcionalidades principales.
 *
 * @returns {JSX.Element}
 */
const Home = () => {
  return (
    <section className="home-page">
      {/* Sección principal de presentación de la plataforma */}
      <div className="hero-store">
        {/* Contenido informativo principal */}
        <div className="hero-text">
          {/* Identificador del tipo de proyecto */}
          <span className="hero-label">Proyecto académico</span>

          <h1>Tu farmacia online simulada</h1>

          {/* Descripción general de las funcionalidades disponibles */}
          <p>
            Plataforma web para consultar medicamentos, agregarlos al carrito y
            generar pedidos con boleta digital simulada.
          </p>

          <div className="hero-actions">
            {/* Redirección hacia el catálogo de medicamentos */}
            <Link to="/catalogo" className="btn-primary">
              Ver medicamentos
            </Link>

            {/* Redirección hacia el registro de usuarios */}
            <Link to="/registro" className="btn-secondary">
              Crear cuenta
            </Link>
          </div>
        </div>

        {/* Tarjeta informativa sobre la arquitectura del sistema */}
        <div className="hero-card">
          {/* Icono representativo de medicamentos */}
          <div className="hero-card-icon">💊</div>
          <h3>Catálogo conectado a MongoDB Atlas</h3>
          {/* Explicación de la gestión de productos desde backend */}
          <p>
            Productos, stock y precios administrados desde el backend del
            sistema.
          </p>
        </div>
      </div>

      {/* Sección que muestra beneficios principales de la plataforma */}
      <div className="benefits-grid">
        <article>
          {/* Beneficio relacionado con la gestión de pedidos */}
          <span>🚚</span>
          <h3>Pedido simulado</h3>
          <p>Generación académica de pedidos desde el carrito.</p>
        </article>

        <article>
          {/* Beneficio relacionado con autenticación y seguridad */}
          <span>🔒</span>
          <h3>Usuarios seguros</h3>
          <p>Registro, login y roles con token JWT.</p>
        </article>

        <article>
          {/* Beneficio relacionado con administración de productos */}
          <span>📦</span>
          <h3>Control de stock</h3>
          <p>Productos administrados desde MongoDB Atlas.</p>
        </article>
      </div>
    </section>
  );
};

export default Home;