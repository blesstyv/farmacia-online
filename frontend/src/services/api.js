const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://farmacia-online-backend-tjwc.onrender.com/api"
).replace(/\/$/, "");

console.log("API conectada a:", API_URL);

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

const handleResponse = async (response, defaultErrorMessage) => {
  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        defaultErrorMessage ||
        "Error en la solicitud al servidor"
    );
  }

  return data;
};

// ==========================
// AUTENTICACIÓN
// ==========================

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return handleResponse(response, "Error al registrar usuario");
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  return handleResponse(response, "Error al iniciar sesión");
};

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  return handleResponse(response, "Error al obtener el perfil del usuario");
};

// ==========================
// PRODUCTOS PÚBLICOS
// ==========================

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response, "Error al obtener productos");
};

export const getProductById = async (productId) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response, "Error al obtener el producto");
};

// ==========================
// PRODUCTOS ADMIN
// ==========================

export const getAdminProducts = async () => {
  const response = await fetch(`${API_URL}/products/admin/all`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  return handleResponse(
    response,
    "Error al obtener productos del panel administrador"
  );
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });

  return handleResponse(response, "Error al crear producto");
};

export const updateProduct = async (productId, productData) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });

  return handleResponse(response, "Error al actualizar producto");
};

export const updateProductStock = async (productId, stockData) => {
  const response = await fetch(`${API_URL}/products/${productId}/stock`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(stockData)
  });

  return handleResponse(response, "Error al actualizar stock del producto");
};

export const deactivateProduct = async (productId) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  return handleResponse(response, "Error al desactivar producto");
};

// ==========================
// PEDIDOS
// ==========================

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });

  return handleResponse(response, "Error al generar pedido");
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  return handleResponse(response, "Error al obtener pedidos del usuario");
};