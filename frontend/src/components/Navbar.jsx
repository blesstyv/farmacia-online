import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="top-bar">
        <span>Farmacia online académica</span>
        <span>Venta simulada para fines educativos</span>
      </div>

      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✚</span>
          <div>
            <strong>Farmacia Online</strong>
            <small>Salud y bienestar</small>
          </div>
        </Link>

        <div className="navbar-links">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>

          <NavLink to="/carrito" className="cart-link">
            Carrito
            <span className="cart-badge">{totalItems}</span>
          </NavLink>

          {isAuthenticated && <NavLink to="/perfil">Mi cuenta</NavLink>}

          {isAdmin && <NavLink to="/admin">Admin</NavLink>}

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