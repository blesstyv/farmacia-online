import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="panel">
        <h2>Carrito de compras</h2>
        <p>Tu carrito está vacío.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="section-header">
        <h2>Carrito de compras</h2>
        <p>Revisa los productos antes de generar el pedido simulado.</p>
      </div>

      <div className="cart-list">
        {cartItems.map((item) => (
          <article className="cart-item" key={item.id}>
            <div>
              <h3>{item.nombre}</h3>
              <p>Precio unitario: ${item.precio.toLocaleString("es-CL")}</p>
              <p>Stock disponible: {item.stock}</p>
            </div>

            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.cantidad}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
            </div>

            <strong>
              ${(item.precio * item.cantidad).toLocaleString("es-CL")}
            </strong>

            <button
              className="btn-danger"
              onClick={() => removeFromCart(item.id)}
            >
              Eliminar
            </button>
          </article>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ${totalPrice.toLocaleString("es-CL")}</h3>

        <div className="cart-actions">
          <button className="btn-secondary" onClick={clearCart}>
            Vaciar carrito
          </button>

          <button className="btn-primary">
            Generar pedido simulado
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;