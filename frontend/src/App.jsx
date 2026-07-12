/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: App.jsx
 * Descripción:
 * Componente principal de la aplicación Frontend de Farmacia Online
 * VidaSalud. Define la estructura general del sitio, configura los
 * proveedores de contexto global y establece las rutas disponibles
 * mediante React Router.
 *
 * Funcionalidades:
 * - Provee autenticación global mediante AuthProvider.
 * - Provee el carrito de compras mediante CartProvider.
 * - Muestra la barra de navegación en todas las páginas.
 * - Configura rutas públicas y protegidas.
 * - Restringe el acceso al panel administrativo.
 *
 * Dependencias:
 * - React Router: Gestión de navegación.
 * - AuthContext: Manejo de autenticación.
 * - CartContext: Manejo del carrito de compras.
 * - Navbar: Barra de navegación principal.
 * - ProtectedRoute: Protección de rutas para usuarios autenticados.
 * - AdminRoute: Protección de rutas exclusivas para administradores.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { Routes, Route } from "react-router-dom";

// Componentes de navegación y protección de rutas.
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Páginas de la aplicación.
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

// Contextos globales de la aplicación.
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

/**
 * Componente principal de la aplicación.
 *
 * Inicializa los contextos globales y define todas las rutas
 * disponibles para los usuarios y administradores.
 *
 * @returns {JSX.Element} Estructura principal de la aplicación.
 */
function App() {
  return (
    // Proporciona el contexto de autenticación a toda la aplicación.
    <AuthProvider>
      {/* Proporciona el contexto del carrito de compras. */}
      <CartProvider>
        {/* Barra de navegación visible en todas las páginas. */}
        <Navbar />

        <main className="main-container">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Ruta protegida para usuarios autenticados */}
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Ruta exclusiva para administradores */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;