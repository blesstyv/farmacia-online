import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!formData.nombre.trim()) {
        setError("El nombre es obligatorio.");
        return;
      }

      if (!formData.email.trim()) {
        setError("El email es obligatorio.");
        return;
      }

      if (!formData.password.trim()) {
        setError("La contraseña es obligatoria.");
        return;
      }

      if (formData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      setSuccess("Cuenta creada correctamente.");

      setTimeout(() => {
        navigate("/perfil");
      }, 800);
    } catch (error) {
      setError(error.message || "No se pudo crear la cuenta.");
    } finally {
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