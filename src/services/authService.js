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

// Add auth header to requests if token exists
authApi.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  login: async (credentials, rememberMe = false) => {
    try {
      const response = await authApi.post("/api/v1/auth/login", credentials);
      const { token, refreshToken, user } = response.data;

      // Store tokens based on remember me preference
      tokenManager.setToken(token, rememberMe);
      tokenManager.setRefreshToken(refreshToken, rememberMe);
      tokenManager.setRememberMe(rememberMe);

      return { success: true, user };
    } catch (error) {
      switch (error.response?.status) {
        case 429:
          throw new Error("Too many login attempts. Try again later.");
        case 401:
          // Check if 2FA is required
          if (error.response?.data?.message === "Two-factor authentication code required") {
            return {
              requireTwoFactor: true,
              token: error.response.data.token,
              email: credentials.email,
            };
          }
          throw new Error("Invalid credentials");
        case 403:
          throw new Error("Account is suspended");
        default:
          throw new Error(error.response?.data?.message || "Login failed");
      }
    }
  },

  // Server-side logout
  logout: async () => {
    try {
      // Call server to blacklist the token
      if (tokenManager.getToken()) {
        await authApi.post("/api/v1/auth/logout");
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear tokens locally
      tokenManager.clearTokens();
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
      tokenManager.setToken(response.data.token, rememberMe);
      tokenManager.setRefreshToken(response.data.refreshToken, rememberMe);

      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear tokens if refresh fails with 401
      if (error.response?.status === 401) {
        tokenManager.clearTokens();
      }
      throw error;
    }
  },

  // Register new account
  register: async (userData) => {
    try {
      const response = await authApi.post("/api/v1/auth/register", userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error("Email already in use");
      }
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await authApi.post("/api/v1/auth/reset-request", { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to request password reset");
    }
  },

  // Reset password with verification code
  resetPassword: async (resetData) => {
    try {
      const response = await authApi.post("/api/v1/auth/reset", resetData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to reset password");
    }
  },

  // Get 2FA setup
  get2FASetup: async () => {
    try {
      const response = await authApi.get("/api/v1/auth/2fa");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate 2FA setup");
    }
  },

  // Enable/disable 2FA
  enable2FA: async (data) => {
    try {
      const response = await authApi.put("/api/v1/auth/2fa", data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to enable 2FA");
    }
  },

  // Verify 2FA during login
  verify2FA: async (verificationData) => {
    try {
      const { email, code, token } = verificationData;
      const response = await authApi.post("/api/v1/auth/login", { email, code, token });

      const { token: newToken, refreshToken, user } = response.data;
      const rememberMe = tokenManager.getRememberMe();

      tokenManager.setToken(newToken, rememberMe);
      tokenManager.setRefreshToken(refreshToken, rememberMe);

      return { success: true, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid verification code");
    }
  },

  // Request account verification code
  requestVerificationCode: async (contact) => {
    try {
      const response = await authApi.post("/api/v1/auth/send-code", contact);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to send verification code");
    }
  },

  // Verify account
  verifyAccount: async (verificationData) => {
    try {
      const response = await authApi.post("/api/v1/auth/verify", verificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to verify account");
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await authApi.get("/api/v1/users/profile");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get profile");
    }
  },

  // Add these methods to expose tokenManager functionality
  isRefreshTokenExpired: () => tokenManager.isRefreshTokenExpired(),
  getToken: () => tokenManager.getToken(),
};

export default authService;
export { tokenManager };
