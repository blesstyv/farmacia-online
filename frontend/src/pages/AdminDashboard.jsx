import { mockProducts } from "../data/products.mock";

const AdminDashboard = () => {
  return (
    <section>
      <div className="section-header">
        <h2>Panel administrativo</h2>
        <p>
          Vista simulada para gestión de medicamentos. Más adelante se conectará
          con rutas protegidas del backend.
        </p>
      </div>

      <div className="admin-grid">
        <div className="stat-card">
          <span>Productos</span>
          <strong>{mockProducts.length}</strong>
        </div>

        <div className="stat-card">
          <span>Stock total</span>
          <strong>
            {mockProducts.reduce((total, product) => total + product.stock, 0)}
          </strong>
        </div>

        <div className="stat-card">
          <span>Pedidos</span>
          <strong>0</strong>
        </div>
      </div>

      <div className="panel">
        <h3>Medicamentos registrados</h3>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {mockProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.nombre}</td>
                <td>{product.categoria}</td>
                <td>${product.precio.toLocaleString("es-CL")}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminDashboard;