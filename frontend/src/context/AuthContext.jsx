import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

const TOKEN_KEY = "farmacia_token";
const USER_KEY = "farmacia_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const [loadingAuth, setLoadingAuth] = useState(false);

  const saveSession = (authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));

    setToken(authData.token);
    setUser(authData.user);
  };

  const register = async (formData) => {
    const data = await registerUser(formData);
    saveSession(data);
    return data;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      return;
    }

    try {
      setLoadingAuth(true);

      const data = await getProfile();

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      logout();
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === "admin";

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

export const useAuth = () => {
  return useContext(AuthContext);
};