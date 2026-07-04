import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!credentials.email.trim()) {
        setError("El email es obligatorio.");
        return;
      }

      if (!credentials.password.trim()) {
        setError("La contraseña es obligatoria.");
        return;
      }

      const data = await login(credentials);

      if (data.user.role === "admin") {
        navigate("/admin");
        return;
      }

      navigate("/perfil");
    } catch (error) {
      setError(error.message || "No se pudo iniciar sesión.");
    } finally {
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