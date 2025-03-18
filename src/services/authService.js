import axios from "axios";
import { SERVER_URL } from "./api";

const tokenManager = {
  // authentication token
  setToken: (token, remember = false) => {
    if (remember) {
      localStorage.setItem("token", token);
      return;
    }
    sessionStorage.setItem("token", token);
  },
  getToken: () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  },

  removeToken: () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  },
  isTokenExpired: () => {
    const token = tokenManager.getToken();
    if (!token) return true;

    const [, payload] = token.split(".");
    const data = JSON.parse(atob(payload));
    return data.exp * 1000 < Date.now();
  },

  // refresh token
  setRefreshToken: (token, remember = false) => {
    if (remember) {
      localStorage.setItem("refreshToken", token);
      return;
    }
    sessionStorage.setItem("refreshToken", token);
  },
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
  },
  removeRefreshToken: () => {
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");
  },
  isRefreshTokenExpired: () => {
    const token = tokenManager.getRefreshToken();
    if (!token) return true;

    const [, payload] = token.split(".");
    const data = JSON.parse(atob(payload));
    return data.exp * 1000 < Date.now();
  },

  // clear all tokens
  clearTokens: () => {
    tokenManager.removeToken();
    tokenManager.removeRefreshToken();
  },

  // with Remember me
  setRememberMe: (remember) => {
    if (remember) {
      localStorage.setItem("rememberMe", "true");
      return;
    }
    localStorage.removeItem("rememberMe");
  },
  getRememberMe: () => {
    return localStorage.getItem("rememberMe") === "true";
  },
};

// to prevent circular dependencies
const authApi = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const authService = {
  login: async (credentials, rememberMe = false) => {
    try {
      const response = await authApi.post("/api/v1/auth/login", credentials);
      const { token, refreshToken } = response.data;

      // Store tokens based on remember me preference
      tokenManager.setToken(token, rememberMe);
      tokenManager.setRefreshToken(refreshToken, rememberMe);
      tokenManager.setRememberMe(rememberMe);

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to login";
      switch (error.response?.status) {
        case 429:
          throw new Error("Too many requests. Try again later.");
        case 401:
          throw new Error("Invalid credentials");
        default:
          throw new Error(error.response?.data?.message || "Failed to login");
      }
    }
  },

  // Method to refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authApi.post("/api/v1/auth/refresh", {
        refreshToken,
      });

      const rememberMe = tokenManager.getRememberMe();
      tokenManager.setToken(response.data.accessToken, rememberMe);

      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  },

  // Logout method
  logout: () => {
    tokenManager.clearTokens();
    // You could also call a logout endpoint here if needed
    return { success: true };
  },

  // Add these methods to expose tokenManager functionality
  isRefreshTokenExpired: () => tokenManager.isRefreshTokenExpired(),
  getToken: () => tokenManager.getToken(),
};

export default authService;
export { tokenManager };
