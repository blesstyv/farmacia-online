import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { totalItems } = useCart();

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
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/registro">Registro</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;