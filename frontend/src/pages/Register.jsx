const Register = () => {
  return (
    <section className="form-wrapper">
      <form className="form-card">
        <h2>Crear cuenta</h2>

        <label>Nombre</label>
        <input type="text" placeholder="Nombre completo" />

        <label>Email</label>
        <input type="email" placeholder="correo@ejemplo.cl" />

        <label>Contraseña</label>
        <input type="password" placeholder="Mínimo 6 caracteres" />

        <button type="button" className="btn-primary full">
          Registrarme
        </button>

        <p className="form-note">
          El registro será conectado luego con MongoDB Atlas mediante el backend.
        </p>
      </form>
    </section>
  );
};

export default Register;