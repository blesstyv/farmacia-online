/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: AuthContext.jsx
 * Descripción:
 * Implementa el contexto global de autenticación de la aplicación.
 * Gestiona el inicio y cierre de sesión, el registro de usuarios,
 * el almacenamiento de la sesión y la obtención del perfil del
 * usuario autenticado.
 *
 * Funcionalidades:
 * - Registro de usuarios.
 * - Inicio y cierre de sesión.
 * - Persistencia de la sesión mediante localStorage.
 * - Obtención del perfil del usuario autenticado.
 * - Validación de autenticación y roles.
 *
 * Dependencias:
 * - React Context API.
 * - Hooks useState, useEffect y useContext.
 * - Servicios de autenticación definidos en api.js.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, loginUser, registerUser } from "../services/api";

/**
 * Contexto global de autenticación.
 */
const AuthContext = createContext();

/**
 * Claves utilizadas para almacenar la sesión
 * del usuario en el almacenamiento local.
 */
const TOKEN_KEY = "farmacia_token";
const USER_KEY = "farmacia_user";

/**
 * Proveedor del contexto de autenticación.
 *
 * Envuelve la aplicación y proporciona el estado y las
 * funciones relacionadas con la autenticación.
 *
 * @param {Object} props Propiedades del componente.
 * @param {React.ReactNode} props.children Componentes hijos.
 *
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  // Recupera el token almacenado para mantener la sesión activa.
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  // Recupera la información del usuario almacenada localmente.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedUser) {
      // Convierte la información almacenada en un objeto JavaScript.
      return JSON.parse(savedUser);
    }

    return null;
  });

  // Indica si se está verificando la autenticación del usuario.
  const [loadingAuth, setLoadingAuth] = useState(false);

  /**
 * Guarda la sesión del usuario.
 *
 * Almacena el token y los datos del usuario en localStorage
 * y actualiza el estado global de autenticación.
 *
 * @param {Object} authData Datos de autenticación recibidos desde la API.
 */
  const saveSession = (authData) => {
    // Guarda la sesión en el almacenamiento local.
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));

    // Actualiza el estado global de autenticación.
    setToken(authData.token);
    setUser(authData.user);
  };

  /**
 * Registra un nuevo usuario.
 *
 * @async
 * @param {Object} formData Datos del formulario.
 *
 * @returns {Promise<Object>}
 */
  const register = async (formData) => {
    const data = await registerUser(formData);
    saveSession(data);
    return data;
  };

  /**
 * Inicia sesión con las credenciales del usuario.
 *
 * @async
 * @param {Object} credentials Credenciales del usuario.
 *
 * @returns {Promise<Object>}
 */
  const login = async (credentials) => {
    const data = await loginUser(credentials);
    saveSession(data);
    return data;
  };

  /**
 * Cierra la sesión del usuario.
 *
 * Elimina la información almacenada y restablece
 * el estado de autenticación.
 */
  const logout = () => {
    // Elimina la información de la sesión almacenada.
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Restablece el estado de autenticación.
    setToken(null);
    setUser(null);
  };

  /**
 * Actualiza la información del usuario autenticado.
 *
 * Consulta el perfil mediante la API y sincroniza
 * los datos almacenados localmente.
 *
 * @async
 *
 * @returns {Promise<void>}
 */
  const refreshProfile = async () => {
    // Verifica que exista un token antes de consultar el perfil.
    if (!localStorage.getItem(TOKEN_KEY)) {
      return;
    }

    try {
      // Indica que se está verificando la sesión.
      setLoadingAuth(true);

      // Obtiene el perfil actualizado desde la API.
      const data = await getProfile();

      // Actualiza la información almacenada del usuario.
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      // Si ocurre un error, finaliza la sesión.
      logout();
    } finally {
      // Finaliza el proceso de verificación.
      setLoadingAuth(false);
    }
  };

  /**
 * Verifica automáticamente la sesión al iniciar la aplicación.
 */
  // Se ejecuta una única vez al montar la aplicación para
  // restaurar la sesión del usuario si existe un token válido.
  useEffect(() => {
    refreshProfile();
  }, []);

  // Indica si existe un usuario autenticado.
  const isAuthenticated = Boolean(token && user);

  // Indica si el usuario posee privilegios de administrador.
  const isAdmin = user?.role === "admin";

  /**
 * Proporciona el contexto de autenticación
 * a todos los componentes hijos.
 */
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loadingAuth,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto
 * de autenticación desde cualquier componente.
 *
 * @returns {Object} Contexto de autenticación.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};