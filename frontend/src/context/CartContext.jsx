/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: CartContext.jsx
 * Descripción:
 * Implementa el contexto global del carrito de compras de la
 * aplicación. Gestiona los productos agregados por el usuario,
 * permitiendo añadir, eliminar, modificar cantidades y calcular
 * el total de la compra.
 *
 * Funcionalidades:
 * - Agregar productos al carrito.
 * - Eliminar productos.
 * - Incrementar y disminuir cantidades.
 * - Vaciar el carrito.
 * - Persistir la información mediante localStorage.
 * - Calcular el total de productos y el monto total.
 *
 * Dependencias:
 * - React Context API.
 * - Hooks useState, useEffect y useContext.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Contexto global del carrito de compras.
 */
const CartContext = createContext();

/**
 * Clave utilizada para almacenar el carrito
 * en el almacenamiento local del navegador.
 */
const CART_STORAGE_KEY = "farmacia_online_cart";

/**
 * Obtiene el identificador único de un producto.
 *
 * Permite trabajar tanto con productos provenientes
 * de MongoDB (_id) como con otros formatos (id).
 *
 * @param {Object} product Producto.
 *
 * @returns {string} Identificador del producto.
 */
const getProductId = (product) => {
  return product._id || product.id;
};

/**
 * Proveedor del contexto del carrito de compras.
 *
 * Gestiona el estado global del carrito y expone
 * las funciones necesarias para manipularlo.
 *
 * @param {Object} props Propiedades del componente.
 * @param {React.ReactNode} props.children Componentes hijos.
 *
 * @returns {JSX.Element}
 */
export const CartProvider = ({ children }) => {
  // Recupera el carrito almacenado para mantener la compra entre sesiones.
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      // Convierte la información almacenada en un arreglo de productos.
      return JSON.parse(savedCart);
    }

    return [];
  });

  /**
 * Guarda automáticamente el carrito cada vez
 * que su contenido cambia.
 */
  useEffect(() => {
    // Sincroniza el carrito con el almacenamiento local.
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /**
 * Agrega un producto al carrito.
 *
 * Si el producto ya existe, incrementa su cantidad
 * respetando el stock disponible.
 *
 * @param {Object} product Producto a agregar.
 */
  const addToCart = (product) => {
    // Obtiene el identificador único del producto.
    const productId = getProductId(product);

    const existingProduct = cartItems.find((item) => {
      // Comprueba si el producto ya existe en el carrito.
      return getProductId(item) === productId;
    });

    if (existingProduct) {
      // Incrementa la cantidad si el producto ya estaba agregado.
      const updatedCart = cartItems.map((item) => {
        if (getProductId(item) === productId) {
          // Evita superar el stock disponible.
          if (item.cantidad >= item.stock) {
            return item;
          }

          return {
            ...item,
            cantidad: item.cantidad + 1
          };
        }

        return item;
      });

      setCartItems(updatedCart);
      return;
    }

    // Agrega un nuevo producto con cantidad inicial igual a uno.
    const newItem = {
      ...product,
      cantidad: 1
    };

    setCartItems([...cartItems, newItem]);
  };

  /**
 * Elimina un producto del carrito.
 *
 * @param {string} productId Identificador del producto.
 */
  const removeFromCart = (productId) => {
    // Elimina el producto seleccionado del carrito.
    const updatedCart = cartItems.filter((item) => {
      return getProductId(item) !== productId;
    });

    setCartItems(updatedCart);
  };

  /**
 * Incrementa la cantidad de un producto.
 *
 * Respeta el límite de stock disponible.
 *
 * @param {string} productId Identificador del producto.
 */
  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) => {
      // Aumenta la cantidad del producto seleccionado.
      if (getProductId(item) === productId) {
        // Impide superar el stock disponible.
        if (item.cantidad >= item.stock) {
          return item;
        }

        return {
          ...item,
          cantidad: item.cantidad + 1
        };
      }

      return item;
    });

    setCartItems(updatedCart);
  };

  /**
 * Disminuye la cantidad de un producto.
 *
 * Si la cantidad llega a cero, el producto
 * se elimina automáticamente del carrito.
 *
 * @param {string} productId Identificador del producto.
 */
  const decreaseQuantity = (productId) => {
    // Genera una nueva lista con la cantidad del producto actualizada.
    const updatedCart = cartItems
      .map((item) => {
        if (getProductId(item) === productId) {
          return {
            ...item,
            cantidad: item.cantidad - 1
          };
        }

        return item;
      })
      // Elimina los productos cuya cantidad sea menor o igual a cero.
      .filter((item) => item.cantidad > 0);

      // Actualiza el estado del carrito.
    setCartItems(updatedCart);
  };

  /**
 * Vacía completamente el carrito de compras.
 */
  const clearCart = () => {
    // Elimina todos los productos del estado.
    setCartItems([]);
    // Elimina el carrito almacenado localmente.
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Calcula la cantidad total de productos del carrito.
  const totalItems = cartItems.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  // Calcula el monto total de la compra.
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);

  /**
 * Proporciona el contexto del carrito
 * a todos los componentes hijos.
 */
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getProductId
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook personalizado para acceder
 * al contexto del carrito de compras.
 *
 * @returns {Object} Contexto del carrito.
 */
export const useCart = () => {
  return useContext(CartContext);
};