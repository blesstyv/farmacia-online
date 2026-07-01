import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      const updatedCart = cartItems.map((item) => {
        if (item.id === product.id) {
          if (item.cantidad >= product.stock) {
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

    setCartItems([
      ...cartItems,
      {
        ...product,
        cantidad: 1
      }
    ]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
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

  const decreaseQuantity = (productId) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            cantidad: item.cantidad - 1
          };
        }

        return item;
      })
      .filter((item) => item.cantidad > 0);

    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);

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
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};