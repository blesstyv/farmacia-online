import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        Farmacia Online
      </Link>

      <nav className="navbar-links">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/catalogo">Catálogo</NavLink>
        <NavLink to="/carrito">Carrito ({totalItems})</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/registro">Registro</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;