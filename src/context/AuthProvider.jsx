import { useCallback, useContext, useEffect, useState } from "react";
import authService, { tokenManager } from "../services/authService";
import { AuthContext } from "./AppContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if token exists and is valid
        const token = authService.getToken();
        if (!token || tokenManager.isTokenExpired()) {
          // If token doesn't exist or is expired, try to refresh
          if (!tokenManager.isRefreshTokenExpired()) {
            try {
              await authService.refreshToken();
              // If refresh successful, continue with getting user data
            } catch (refreshErr) {
              // If refresh failed, user is not authenticated
              console.error("Token refresh failed:", refreshErr);
              authService.logout();
              setIsAuthenticated(false);
              setUser(null);
              setLoading(false);
              return;
            }
          } else {
            // Both tokens are expired, user is not authenticated
            authService.logout();
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            return;
          }
        }

        // At this point we have a valid token, get user data
        const userData = await authService.getProfile();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // If somehow we have a token but no user data
          console.error("Valid token but no user data found");
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
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

      const response = await authService.login(credentials, rememberMe);

      if (response.requireTwoFactor) {
        return { requireTwoFactor: true, token: response.token, email: response.email };
      }

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
      setLoading(true);
      await authService.logout();
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      // Local logout
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      window.location.href = "/login";
    }
  }, []);

  // Update user profile data
  const updateUserData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (err) {
      console.error("Failed to update user data:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easier context use
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
