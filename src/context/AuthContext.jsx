import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Validate token and get user data
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);
      // Store remember me preference
      localStorage.setItem("rememberMe", rememberMe.toString());

      const response = await authService.login(credentials, rememberMe);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, role: response.user?.role };
    } catch (err) {
      const message = err.message || "Failed to login";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Any backend logout operations
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      // Local logout
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("rememberMe");
      window.location.href = "/login";
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easier context use
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
