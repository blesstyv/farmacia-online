/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Profile.jsx
 * Descripción:
 * Página encargada de mostrar la información del perfil del usuario
 * autenticado dentro del sistema VidaSalud.
 * Permite visualizar los datos principales de la cuenta, el rol
 * asignado y gestionar el cierre de sesión.
 *
 * Funcionalidades:
 * - Visualización de datos del usuario autenticado.
 * - Muestra del rol y tipo de cuenta.
 * - Acceso al catálogo de medicamentos.
 * - Acceso al panel administrativo según el rol.
 * - Cierre de sesión del usuario.
 *
 * Dependencias:
 * - react-router-dom: Navegación entre páginas.
 * - AuthContext: Obtención de información del usuario y gestión
 *   de autenticación.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Renderiza la página de perfil del usuario.
 *
 * Permite consultar la información de la cuenta actualmente
 * autenticada y ejecutar acciones dependiendo del rol asignado.
 *
 * @returns {JSX.Element}
 */
const Profile = () => {
  // Permite realizar redirecciones después del cierre de sesión.
  const navigate = useNavigate();
  // Obtiene los datos del usuario autenticado y la función de logout.
  const { user, logout } = useAuth();

  /**
   * Cierra la sesión del usuario actual.
   *
   * Ejecuta la función logout del contexto de autenticación
   * y redirige al usuario hacia la página principal.
   */
  const handleLogout = () => {
    // Elimina la sesión activa del usuario.
    logout();
    // Redirige hacia la página inicial.
    navigate("/");
  };

  return (
    <section className="profile-page">
      {/* Contenedor principal de información del perfil */}
      <div className="profile-card">
        {/* Encabezado con información básica del usuario */}
        <div className="profile-header">
          {/* Genera un avatar utilizando la primera letra del nombre */}
          <div className="profile-avatar">
            {user?.nombre?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            {/* Etiqueta identificadora de la sección */}
            <span className="hero-label">Mi cuenta</span>
            {/* Muestra nombre y correo del usuario autenticado */}
            <h2>{user?.nombre}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Información adicional de la cuenta */}
        <div className="profile-grid">
          {/* Muestra el rol asignado al usuario */}
          <article>
            <span>Rol</span>
            <strong>{user?.role}</strong>
          </article>

          {/* Indica el estado actual de la sesión */}
          <article>
            <span>Estado</span>
            <strong>Sesión activa</strong>
          </article>

          {/* Determina el tipo de cuenta según el rol */}
          <article>
            <span>Tipo de cuenta</span>
            <strong>
              {user?.role === "admin" ? "Administrador" : "Cliente"}
            </strong>
          </article>
        </div>

        {/* Acciones disponibles para el usuario */}
        <div className="profile-actions">
          {/* Acceso al catálogo de productos */}
          <Link to="/catalogo" className="btn-primary">
            Ir al catálogo
          </Link>

          {/* Muestra el acceso administrativo únicamente para usuarios admin */}
          {user?.role === "admin" && (
            <Link to="/admin" className="btn-secondary">
              Panel administrador
            </Link>
          )}

          {/* Botón para finalizar la sesión actual */}
          <button className="btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;