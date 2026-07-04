import { useCart } from "../context/CartContext";

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
        <p>
          Revisa los productos seleccionados antes de generar el pedido simulado.
        </p>
      </div>

      <div className="cart-list">
        {cartItems.map((item) => {
          const productId = getProductId(item);

          return (
            <article className="cart-item" key={productId}>
              <div>
                <h3>{item.nombre}</h3>
                <p>Precio unitario: ${item.precio.toLocaleString("es-CL")}</p>
                <p>Stock disponible: {item.stock}</p>
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

      <div className="cart-summary">
        <h3>Total: ${totalPrice.toLocaleString("es-CL")}</h3>

        <div className="cart-actions">
          <button className="btn-secondary" onClick={clearCart}>
            Vaciar carrito
          </button>

          <button className="btn-primary">Generar pedido simulado</button>
        </div>
      </div>
    </section>
  );
};

export default Cart;