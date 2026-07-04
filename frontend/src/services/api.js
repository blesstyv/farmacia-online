const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiConfig = {
  API_URL
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron obtener los productos");
  }

  return data;
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo generar el pedido");
  }

  return data;
};