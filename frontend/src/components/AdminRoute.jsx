/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: AdminRoute.jsx
 * Descripción:
 * Componente encargado de proteger las rutas exclusivas para
 * administradores. Verifica que el usuario haya iniciado sesión
 * y que posea el rol de administrador antes de permitir el acceso
 * al contenido solicitado.
 *
 * Dependencias:
 * - react-router-dom: Redirección de usuarios mediante Navigate.
 * - AuthContext: Proporciona el estado de autenticación y el rol
 *   del usuario.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege las rutas reservadas para administradores.
 *
 * Mientras se valida la sesión muestra un mensaje de espera.
 * Si el usuario no está autenticado lo redirige al inicio de
 * sesión y, si no posee permisos de administrador, lo envía
 * a su perfil.
 *
 * @param {Object} props Propiedades del componente.
 * @param {React.ReactNode} props.children Contenido protegido.
 *
 * @returns {JSX.Element}
 */
const AdminRoute = ({ children }) => {
  // Obtiene el estado de autenticación y los permisos del usuario.
  const { isAuthenticated, isAdmin, loadingAuth } = useAuth();

  // Muestra un mensaje mientras se verifica la sesión del usuario.
  if (loadingAuth) {
    return (
      <section className="panel">
        <h2>Verificando sesión...</h2>
        <p>Estamos comprobando tus permisos de acceso.</p>
      </section>
    );
  }

  // Redirige al inicio de sesión si el usuario no está autenticado.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Impide el acceso a usuarios que no poseen rol de administrador.
  if (!isAdmin) {
    return <Navigate to="/perfil" replace />;
  }

  // Renderiza el contenido protegido cuando el usuario tiene permisos.
  return children;
};

export default AdminRoute;