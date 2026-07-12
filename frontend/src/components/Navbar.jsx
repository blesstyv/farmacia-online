/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Navbar.jsx
 * Descripción:
 * Componente que renderiza la barra de navegación principal de
 * Farmacia Online VidaSalud. Muestra enlaces de navegación,
 * información del carrito de compras y opciones de autenticación
 * según el estado de la sesión del usuario.
 *
 * Funcionalidades:
 * - Navegación entre las páginas principales.
 * - Visualización de la cantidad de productos en el carrito.
 * - Acceso al perfil del usuario.
 * - Acceso al panel de administración para administradores.
 * - Cierre de sesión.
 *
 * Dependencias:
 * - react-router-dom: Navegación y enlaces.
 * - CartContext: Información del carrito.
 * - AuthContext: Estado de autenticación del usuario.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

/**
 * Barra de navegación principal de la aplicación.
 *
 * Muestra las opciones disponibles según el estado de
 * autenticación y el rol del usuario.
 *
 * @returns {JSX.Element}
 */
const Navbar = () => {
  // Permite realizar redirecciones mediante código.
  const navigate = useNavigate();
  // Obtiene la cantidad total de productos del carrito.
  const { totalItems } = useCart();
  // Obtiene la información y funciones de autenticación.
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  /**
   * Cierra la sesión del usuario y lo redirige a la página principal.
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      {/* Barra superior con información del proyecto */}
      <div className="top-bar">
        <span>Farmacia online académica</span>
        <span>Venta simulada para fines educativos</span>
      </div>

      <nav className="navbar">
        {/* Logo y acceso a la página de inicio */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✚</span>
          <div>
            <strong>Farmacia Online</strong>
            <small>Salud y bienestar</small>
          </div>
        </Link>

        <div className="navbar-links">
          {/* Enlaces públicos */}
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          {/* Acceso al carrito mostrando la cantidad de productos */}
          <NavLink to="/carrito" className="cart-link">
            Carrito
            <span className="cart-badge">{totalItems}</span>
          </NavLink>

          {/* Acceso al perfil para usuarios autenticados */}
          {isAuthenticated && <NavLink to="/perfil">Mi cuenta</NavLink>}

          {/* Acceso al panel administrativo */}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}

          {/* Muestra opciones según el estado de autenticación */}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/registro">Registro</NavLink>
            </>
          ) : (
            <button className="nav-logout" onClick={handleLogout}>
              Salir ({user?.nombre})
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;