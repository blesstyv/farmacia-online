/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: api.js
 * Descripción:
 * Centraliza las solicitudes HTTP realizadas desde el frontend
 * hacia la API de Farmacia Online VidaSalud.
 *
 * Funcionalidades:
 * - Registro e inicio de sesión.
 * - Obtención del perfil del usuario.
 * - Consulta y administración de productos.
 * - Creación de pedidos.
 *
 * Configuración:
 * - Utiliza la variable de entorno VITE_API_URL para definir
 *   la dirección del backend.
 * - Si no existe, utiliza la URL pública desplegada.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/**
 * Dirección base de la API.
 *
 * Se obtiene desde las variables de entorno y, en caso de no
 * existir, utiliza la URL del servidor desplegado.
 */
const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://farmacia-online-backend-tjwc.onrender.com/api"
).replace(/\/$/, "");

console.log("API conectada a:", API_URL);

export const apiConfig = {
  API_URL
};

/**
 * Genera los encabezados HTTP necesarios para las solicitudes.
 *
 * Si existe un token de autenticación almacenado en localStorage,
 * lo incorpora como encabezado Authorization.
 *
 * @returns {Object} Encabezados HTTP.
 */
const getAuthHeaders = () => {
  // Obtiene el token almacenado durante el inicio de sesión.
  const token = localStorage.getItem("farmacia_token");

  // Si no existe token, solo envía el tipo de contenido.
  if (!token) {
    return {
      "Content-Type": "application/json"
    };
  }

  // Agrega el token JWT para acceder a rutas protegidas.
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

/**
 * Procesa la respuesta obtenida desde la API.
 *
 * Convierte la respuesta a formato JSON y lanza un error si
 * la solicitud no fue exitosa.
 *
 * @async
 * @param {Response} response Respuesta del servidor.
 * @param {string} defaultErrorMessage Mensaje de error por defecto.
 *
 * @returns {Promise<Object>}
 */
const handleResponse = async (response, defaultErrorMessage) => {
  let data = null;

  // Intenta convertir la respuesta del servidor a formato JSON.
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  // Si la solicitud falló, genera una excepción con el mensaje recibido.
  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        defaultErrorMessage ||
        "Error en la solicitud al servidor"
    );
  }

  // Devuelve la información obtenida desde la API.
  return data;
};

// ==========================
// AUTENTICACIÓN
// ==========================

/**
 * Registra un nuevo usuario.
 *
 * @async
 * @param {Object} userData Información del usuario.
 * @returns {Promise<Object>}
 */
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

/**
 * Inicia sesión de un usuario registrado.
 *
 * @async
 * @param {Object} credentials Credenciales del usuario.
 * @returns {Promise<Object>}
 */
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

/**
 * Obtiene el perfil del usuario autenticado.
 *
 * @async
 * @returns {Promise<Object>}
 */
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

/**
 * Obtiene el catálogo público de productos.
 *
 * @async
 * @returns {Promise<Object>}
 */
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return handleResponse(response, "Error al obtener productos");
};

/**
 * Obtiene la información de un producto específico.
 *
 * @async
 * @param {string} productId Identificador del producto.
 * @returns {Promise<Object>}
 */
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

/**
 * Obtiene el listado completo de productos para el administrador.
 *
 * @async
 * @returns {Promise<Object>}
 */
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

/**
 * Registra un nuevo producto.
 *
 * @async
 * @param {Object} productData Información del producto.
 * @returns {Promise<Object>}
 */
export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(), //Tokens del JWT
    body: JSON.stringify(productData)
  });

  return handleResponse(response, "Error al crear producto");
};

/**
 * Actualiza la información de un producto.
 *
 * @async
 * @param {string} productId Identificador del producto.
 * @param {Object} productData Datos actualizados.
 * @returns {Promise<Object>}
 */
export const updateProduct = async (productId, productData) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });

  return handleResponse(response, "Error al actualizar producto");
};

/**
 * Actualiza el stock de un producto.
 *
 * @async
 * @param {string} productId Identificador del producto.
 * @param {Object} stockData Nuevo stock.
 * @returns {Promise<Object>}
 */
export const updateProductStock = async (productId, stockData) => {
  const response = await fetch(`${API_URL}/products/${productId}/stock`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(stockData)
  });

  return handleResponse(response, "Error al actualizar stock del producto");
};

/**
 * Desactiva un producto del catálogo.
 *
 * @async
 * @param {string} productId Identificador del producto.
 * @returns {Promise<Object>}
 */
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

/**
 * Envía un nuevo pedido al servidor.
 *
 * @async
 * @param {Object} orderData Información del pedido.
 * @returns {Promise<Object>}
 */
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });

  return handleResponse(response, "Error al generar pedido");
};

/**
 * Obtiene los pedidos asociados al usuario autenticado.
 *
 * @async
 * @returns {Promise<Object>}
 */
export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  return handleResponse(response, "Error al obtener pedidos del usuario");
};