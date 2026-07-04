import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    getProductId
  } = useCart();

  const [cliente, setCliente] = useState({
    nombre: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCliente({
      ...cliente,
      [name]: value
    });
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      setError("");
      setOrderResult(null);

      if (!cliente.nombre.trim() || !cliente.email.trim()) {
        setError("Debes ingresar nombre y email para generar el pedido.");
        return;
      }

      const orderData = {
        cliente,
        items: cartItems.map((item) => {
          return {
            productId: getProductId(item),
            cantidad: item.cantidad
          };
        })
      };

      const data = await createOrder(orderData);

      setOrderResult(data.order);
      clearCart();
    } catch (error) {
      setError(error.message || "No se pudo generar el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <section className="receipt-page">
        <div className="receipt-card">
          <div className="receipt-header">
            <div>
              <span className="hero-label">Boleta simulada</span>
              <h2>Pedido generado correctamente</h2>
              <p>
                Documento académico simulado. No corresponde a boleta
                electrónica real del SII.
              </p>
            </div>

            <div className="receipt-number">
              <span>N° Pedido</span>
              <strong>{orderResult.numeroPedido}</strong>
            </div>
          </div>

          <div className="receipt-info">
            <p>
              <strong>Cliente:</strong> {orderResult.cliente.nombre}
            </p>
            <p>
              <strong>Email:</strong> {orderResult.cliente.email}
            </p>
            <p>
              <strong>Boleta:</strong> {orderResult.boleta.numeroBoleta}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(orderResult.boleta.fechaEmision).toLocaleString(
                "es-CL"
              )}
            </p>
          </div>

          <div className="receipt-table">
            <div className="receipt-row header">
              <span>Producto</span>
              <span>Cant.</span>
              <span>Precio</span>
              <span>Subtotal</span>
            </div>

            {orderResult.items.map((item) => (
              <div className="receipt-row" key={item.product}>
                <span>{item.nombre}</span>
                <span>{item.cantidad}</span>
                <span>${item.precioUnitario.toLocaleString("es-CL")}</span>
                <span>${item.subtotal.toLocaleString("es-CL")}</span>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <span>Total pagado simulado</span>
            <strong>${orderResult.total.toLocaleString("es-CL")}</strong>
          </div>

          <p className="form-note">{orderResult.boleta.mensaje}</p>

          <div className="receipt-actions">
            <Link to="/catalogo" className="btn-primary">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="empty-cart panel">
        <h2>Carrito de compras</h2>
        <p>Tu carrito está vacío.</p>

        <Link to="/catalogo" className="btn-primary">
          Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="section-header">
        <h2>Carrito de compras</h2>
        <p>
          Revisa los productos seleccionados antes de generar el pedido simulado.
        </p>
      </div>

      {error && <p className="alert-error">{error}</p>}

      <div className="cart-layout">
        <div className="cart-list">
          {cartItems.map((item) => {
            const productId = getProductId(item);

            return (
              <article className="cart-item" key={productId}>
                <div className="cart-product">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.co/120x120?text=Med";
                    }}
                  />

                  <div>
                    <h3>{item.nombre}</h3>
                    <p>
                      Precio unitario: ${item.precio.toLocaleString("es-CL")}
                    </p>
                    <p>Stock disponible: {item.stock}</p>
                  </div>
                </div>

                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(productId)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => increaseQuantity(productId)}>+</button>
                </div>

                <strong>
                  ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                </strong>

                <button
                  className="btn-danger"
                  onClick={() => removeFromCart(productId)}
                >
                  Eliminar
                </button>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h3>Resumen del pedido</h3>

          <div className="customer-form">
            <label>Nombre cliente</label>
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              placeholder="Nombre completo"
            />

            <label>Email cliente</label>
            <input
              type="email"
              name="email"
              value={cliente.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.cl"
            />
          </div>

          <div className="summary-row">
            <span>Productos</span>
            <strong>{cartItems.length}</strong>
          </div>

          <div className="summary-row">
            <span>Total</span>
            <strong>${totalPrice.toLocaleString("es-CL")}</strong>
          </div>

          <button
            className="btn-primary full"
            onClick={handleCreateOrder}
            disabled={loading}
          >
            {loading ? "Generando pedido..." : "Generar pedido simulado"}
          </button>

          <button className="btn-secondary full" onClick={clearCart}>
            Vaciar carrito
          </button>

          <p className="form-note">
            La boleta será simulada para fines académicos.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Cart;