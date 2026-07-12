/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Register.jsx
 * Descripción:
 * Página encargada del registro de nuevos usuarios en el sistema.
 * Permite ingresar los datos personales, validar la información
 * requerida y crear una nueva cuenta mediante el contexto de
 * autenticación.
 *
 * Funcionalidades:
 * - Registro de usuarios.
 * - Validación de campos obligatorios.
 * - Validación de longitud de contraseña.
 * - Visualización de mensajes de error y confirmación.
 * - Redirección posterior al registro exitoso.
 *
 * Dependencias:
 * - react-router-dom: Navegación entre páginas.
 * - AuthContext: Gestión del registro de usuarios.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Renderiza la página de creación de cuenta.
 *
 * Permite al usuario registrarse proporcionando sus datos
 * personales y genera una sesión automáticamente después
 * del registro exitoso.
 *
 * @returns {JSX.Element}
 */

const Register = () => {
  // Permite redirigir al usuario después del registro.
  const navigate = useNavigate();
  // Obtiene la función de registro desde el contexto de autenticación.
  const { register } = useAuth();

  // Almacena los datos ingresados en el formulario.
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  // Almacena mensajes de error del formulario.
  const [error, setError] = useState("");
  // Almacena el mensaje mostrado cuando el registro es exitoso.
  const [success, setSuccess] = useState("");
  // Controla el estado de carga durante el registro.
  const [loading, setLoading] = useState(false);

  /**
   * Actualiza los valores del formulario según el campo modificado.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Evento del formulario.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  /**
   * Procesa el envío del formulario de registro.
   *
   * Valida los datos ingresados, crea la cuenta del usuario
   * y redirige al perfil cuando la operación es exitosa.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} event Evento del formulario.
   */
  const handleSubmit = async (event) => {
    // Evita la recarga automática de la página.
    event.preventDefault();

    try {
      // Activa la carga y limpia mensajes anteriores.
      setLoading(true);
      setError("");
      setSuccess("");

      // Verifica que el nombre sea ingresado.
      if (!formData.nombre.trim()) {
        setError("El nombre es obligatorio.");
        return;
      }

      // Verifica que el correo electrónico sea ingresado.
      if (!formData.email.trim()) {
        setError("El email es obligatorio.");
        return;
      }

      // Verifica que la contraseña sea ingresada.
      if (!formData.password.trim()) {
        setError("La contraseña es obligatoria.");
        return;
      }

      // Valida que la contraseña cumpla la longitud mínima requerida.
      if (formData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      // Envía los datos al backend para crear el usuario.
      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      // Muestra confirmación de registro exitoso.
      setSuccess("Cuenta creada correctamente.");

      // Redirige al perfil después de mostrar el mensaje.
      setTimeout(() => {
        navigate("/perfil");
      }, 800);
    } catch (error) {
      // Muestra el error generado durante el registro.
      setError(error.message || "No se pudo crear la cuenta.");
    } finally {
      // Finaliza el estado de carga.
      setLoading(false);
    }
  };

  return (
    <section className="form-wrapper">
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <span className="hero-label">Nuevo usuario</span>

        <h2>Crear cuenta</h2>

        <p className="form-note">
          Regístrate para acceder a tu cuenta y generar pedidos simulados.
        </p>

        {/* Muestra mensajes según el resultado de la operación */}
        {error && <p className="alert-error">{error}</p>}
        {success && <p className="alert-success">{success}</p>}

        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="correo@ejemplo.cl"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary full" disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </button>

        <p className="form-note">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;