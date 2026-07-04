import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.nombre?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <span className="hero-label">Mi cuenta</span>
            <h2>{user?.nombre}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="profile-grid">
          <article>
            <span>Rol</span>
            <strong>{user?.role}</strong>
          </article>

          <article>
            <span>Estado</span>
            <strong>Sesión activa</strong>
          </article>

          <article>
            <span>Tipo de cuenta</span>
            <strong>
              {user?.role === "admin" ? "Administrador" : "Cliente"}
            </strong>
          </article>
        </div>

        <div className="profile-actions">
          <Link to="/catalogo" className="btn-primary">
            Ir al catálogo
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="btn-secondary">
              Panel administrador
            </Link>
          )}

          <button className="btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;