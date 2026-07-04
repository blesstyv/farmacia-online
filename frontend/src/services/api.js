const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiConfig = {
  API_URL
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("farmacia_token");

  if (!token) {
    return {
      "Content-Type": "application/json"
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo registrar el usuario");
  }

  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar sesión");
  }

  return data;
};

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener el perfil");
  }

  return data;
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