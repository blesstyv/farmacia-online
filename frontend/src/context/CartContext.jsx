import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "farmacia_online_cart";

const getProductId = (product) => {
  return product._id || product.id;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const productId = getProductId(product);

    const existingProduct = cartItems.find((item) => {
      return getProductId(item) === productId;
    });

    if (existingProduct) {
      const updatedCart = cartItems.map((item) => {
        if (getProductId(item) === productId) {
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

    const newItem = {
      ...product,
      cantidad: 1
    };

    setCartItems([...cartItems, newItem]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => {
      return getProductId(item) !== productId;
    });

    setCartItems(updatedCart);
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) => {
      if (getProductId(item) === productId) {
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
        if (getProductId(item) === productId) {
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
    localStorage.removeItem(CART_STORAGE_KEY);
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
        totalPrice,
        getProductId
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};