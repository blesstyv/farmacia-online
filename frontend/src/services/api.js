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

export const getAdminProducts = async () => {
  const response = await fetch(`${API_URL}/products/admin/all`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron obtener los productos del administrador");
  }

  return data;
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo crear el producto");
  }

  return data;
};

export const updateProduct = async (productId, productData) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar el producto");
  }

  return data;
};

export const updateProductStock = async (productId, stock) => {
  const response = await fetch(`${API_URL}/products/${productId}/stock`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ stock })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar el stock");
  }

  return data;
};

export const deactivateProduct = async (productId) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo desactivar el producto");
  }

  return data;
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo generar el pedido");
  }

  return data;
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron obtener tus pedidos");
  }

  return data;
};