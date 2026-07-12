/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: ProtectedRoute.jsx
 * Descripción:
 * Componente encargado de proteger las rutas que requieren
 * autenticación. Verifica que el usuario tenga una sesión
 * válida antes de permitir el acceso al contenido solicitado.
 *
 * Dependencias:
 * - react-router-dom: Redirección mediante Navigate.
 * - AuthContext: Proporciona el estado de autenticación.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege las rutas que requieren un usuario autenticado.
 *
 * Mientras se valida la sesión muestra un mensaje de espera.
 * Si el usuario no ha iniciado sesión, es redirigido a la
 * página de inicio de sesión.
 *
 * @param {Object} props Propiedades del componente.
 * @param {React.ReactNode} props.children Contenido protegido.
 *
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ children }) => {
  // Obtiene el estado actual de autenticación del usuario.
  const { isAuthenticated, loadingAuth } = useAuth();

  // Muestra un mensaje mientras se verifica la sesión.
  if (loadingAuth) {
    return (
      <section className="panel">
        <h2>Cargando sesión...</h2>
        <p>Estamos verificando tu cuenta.</p>
      </section>
    );
  }

  // Redirige al inicio de sesión si el usuario no está autenticado.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza el contenido protegido cuando la sesión es válida.
  return children;
};

export default ProtectedRoute;