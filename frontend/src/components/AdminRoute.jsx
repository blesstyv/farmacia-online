import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <section className="panel">
        <h2>Verificando sesión...</h2>
        <p>Estamos comprobando tus permisos de acceso.</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
};

export default AdminRoute;