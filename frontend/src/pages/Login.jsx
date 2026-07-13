/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Login.jsx
 * Descripción:
 * Página encargada de autenticar a los usuarios en el sistema.
 * Permite ingresar las credenciales, validar los datos
 * ingresados y establecer una sesión mediante el contexto de
 * autenticación.
 *
 * Funcionalidades:
 * - Inicio de sesión.
 * - Validación de campos obligatorios.
 * - Redirección según el rol del usuario.
 * - Visualización de mensajes de error.
 *
 * Dependencias:
 * - react-router-dom: Navegación entre páginas.
 * - AuthContext: Gestión de la autenticación.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Renderiza la página de inicio de sesión.
 *
 * Permite al usuario ingresar sus credenciales y acceder
 * al sistema según los permisos asignados.
 *
 * @returns {JSX.Element}
 */

const Login = () => {
  // Permite realizar redirecciones después del inicio de sesión.
  const navigate = useNavigate();
  // Obtiene la función de autenticación desde el contexto.
  const { login } = useAuth();

  // Almacena las credenciales ingresadas por el usuario.
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  // Almacena mensajes de error.
  const [error, setError] = useState("");
  // Controla el estado de carga durante el inicio de sesión.
  const [loading, setLoading] = useState(false);

  /**
   * Actualiza el valor de los campos del formulario.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Evento del formulario.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  /**
   * Procesa el envío del formulario de inicio de sesión.
   *
   * Valida los datos ingresados, autentica al usuario y
   * redirige según el rol asignado.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} event Evento del formulario.
   */
  const handleSubmit = async (event) => {
    // Evita la recarga de la página al enviar el formulario.
    event.preventDefault();

    try {
      // Activa el indicador de carga y limpia errores previos.
      setLoading(true);
      setError("");

      // Verifica que el correo electrónico haya sido ingresado.
      if (!credentials.email.trim()) {
        setError("El email es obligatorio.");
        return;
      }

      // Verifica que la contraseña haya sido ingresada.
      if (!credentials.password.trim()) {
        setError("La contraseña es obligatoria.");
        return;
      }

      // Solicita la autenticación del usuario.
      const data = await login(credentials);

      // Redirige al panel administrativo si el usuario es administrador.

      if (data.user.role === "admin") {
        navigate("/admin");
        return;
      }

      // Redirige al perfil para usuarios clientes.
      navigate("/perfil");
    } catch (error) {
      // Muestra el mensaje de error recibido.
      setError(error.message || "No se pudo iniciar sesión.");
    } finally {
      // Desactiva el indicador de carga.
      setLoading(false);
    }
  };

  return (
    <section className="form-wrapper">
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <span className="hero-label">Acceso usuarios</span>

        <h2>Iniciar sesión</h2>

        <p className="form-note">
          Ingresa con tu cuenta para acceder a tu perfil.
        </p>

        {/* Muestra el mensaje de error cuando existe */}
        {error && <p className="alert-error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="cliente@test.cl"
          value={credentials.email}
          onChange={handleChange}
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          value={credentials.password}
          onChange={handleChange}
        />

        {/* Botón de envío que se bloquea durante la carga para evitar clics múltiples */}
        <button type="submit" className="btn-primary full" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <p className="form-note">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;