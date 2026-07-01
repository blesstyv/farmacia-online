const Login = () => {
  return (
    <section className="form-wrapper">
      <form className="form-card">
        <h2>Iniciar sesión</h2>

        <label>Email</label>
        <input type="email" placeholder="cliente@test.cl" />

        <label>Contraseña</label>
        <input type="password" placeholder="Ingresa tu contraseña" />

        <button type="button" className="btn-primary full">
          Entrar
        </button>

        <p className="form-note">
          Esta pantalla será conectada posteriormente con el backend JWT.
        </p>
      </form>
    </section>
  );
};

export default Login;