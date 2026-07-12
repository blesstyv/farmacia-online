/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: Cart.jsx
 * Descripción:
 * Página encargada de administrar el carrito de compras de la
 * farmacia online VidaSalud. Permite visualizar los productos
 * seleccionados, modificar sus cantidades, eliminar productos,
 * vaciar el carrito y generar un pedido con una boleta digital
 * simulada.
 *
 * Funcionalidades:
 * - Visualización del carrito de compras.
 * - Modificación de cantidades de productos.
 * - Eliminación de productos del carrito.
 * - Vaciado completo del carrito.
 * - Captura de datos del cliente.
 * - Generación de pedidos mediante la API.
 * - Visualización de boleta simulada.
 *
 * Dependencias:
 * - React: Manejo de estados del componente.
 * - react-router-dom: Navegación entre páginas.
 * - CartContext: Gestión del carrito de compras.
 * - api service: Creación de pedidos en el backend.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

/**
 * Renderiza la página del carrito de compras.
 *
 * Permite administrar los productos seleccionados,
 * ingresar los datos del cliente y generar un pedido
 * simulado con su respectiva boleta.
 *
 * @returns {JSX.Element}
 */
const Cart = () => {
  const {
    // Obtiene las funciones y datos del carrito desde el contexto.
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    getProductId
  } = useCart();

  // Almacena la información del cliente.
  const [cliente, setCliente] = useState({
    nombre: "",
    email: ""
  });

  // Controla el estado de carga durante la generación del pedido.
  const [loading, setLoading] = useState(false);
  // Almacena mensajes de error.
  const [error, setError] = useState("");
  // Guarda la información del pedido generado.
  const [orderResult, setOrderResult] = useState(null);

  /**
   * Actualiza los datos ingresados por el cliente.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Evento del formulario.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setCliente({
      ...cliente,
      [name]: value
    });
  };

  /**
   * Genera un pedido utilizando los productos del carrito.
   *
   * Valida los datos del cliente, construye la información
   * requerida por la API y solicita la creación del pedido.
   * Posteriormente limpia el carrito y muestra la boleta
   * simulada generada por el sistema.
   *
   * @async
   */
  const handleCreateOrder = async () => {
    try {
      // Activa el estado de carga y limpia errores anteriores.
      setLoading(true);
      setError("");
      setOrderResult(null);

      // Verifica que el cliente haya ingresado sus datos.
      if (!cliente.nombre.trim() || !cliente.email.trim()) {
        setError("Debes ingresar nombre y email para generar el pedido.");
        return;
      }

      // Construye la información que será enviada al backend.
      const orderData = {
        cliente,
        items: cartItems.map((item) => {
          return {
            productId: getProductId(item),
            cantidad: item.cantidad
          };
        })
      };

      // Solicita la creación del pedido.
      const data = await createOrder(orderData);

      // Guarda la respuesta recibida.
      setOrderResult(data.order);
      // Vacía el carrito después de generar el pedido.
      clearCart();
    } catch (error) {
      // Muestra el mensaje de error recibido.
      setError(error.message || "No se pudo generar el pedido");
    } finally {
      // Finaliza el estado de carga.
      setLoading(false);
    }
  };

  /**
   * Muestra la boleta simulada cuando el pedido
   * fue generado correctamente.
   */
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

  /**
   * Muestra un mensaje cuando el carrito
   * no contiene productos.
   */
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

      {/* Muestra mensajes de error cuando existen */}
      {error && <p className="alert-error">{error}</p>}

      <div className="cart-layout">
        {/* Lista de productos agregados al carrito */}
        <div className="cart-list">
          {cartItems.map((item) => {
            // Obtiene el identificador del producto.
            const productId = getProductId(item);

            return (
              <article className="cart-item" key={productId}>
                {/* Información principal del producto */}
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

                {/* Controles para modificar la cantidad */}
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(productId)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => increaseQuantity(productId)}>+</button>
                </div>

                {/* Subtotal del producto */}
                <strong>
                  ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                </strong>

                {/* Elimina el producto del carrito */}
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

        {/* Resumen del pedido */}
        <aside className="cart-summary">
          <h3>Resumen del pedido</h3>

          {/* Formulario con datos del cliente */}
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

          {/* Cantidad total de productos */}
          <div className="summary-row">
            <span>Productos</span>
            <strong>{cartItems.length}</strong>
          </div>

          {/* Total del pedido */}
          <div className="summary-row">
            <span>Total</span>
            <strong>${totalPrice.toLocaleString("es-CL")}</strong>
          </div>

          {/* Genera el pedido */}
          <button
            className="btn-primary full"
            onClick={handleCreateOrder}
            disabled={loading}
          >
            {loading ? "Generando pedido..." : "Generar pedido simulado"}
          </button>

          {/* Vacía completamente el carrito */}
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