import axios from "axios";
import authService, { tokenManager } from "./authService";

// Environment variable for server URL (should ideally come from .env)
const SERVER_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        isNetworkError: true,
      });
    }

    // Handle unauthorized errors - try to refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Check if refresh token is expired
        if (authService.isRefreshTokenExpired()) {
          authService.logout();
          return Promise.reject({
            message: "Your session has expired. Please log in again.",
            isAuthError: true,
          });
        }

        // If refresh token is valid, get a new access token
        const response = await authService.refreshToken();
        authService.tokenManager.setToken(response.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${response.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Only logout if refresh token is invalid
        if (refreshError.response?.status === 401) {
          authService.logout();
          return Promise.reject({
            message: "Your session has expired. Please log in again.",
            isAuthError: true,
          });
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject({
        message: "Server error. Please try again later.",
        isServerError: true,
        status: error.response.status,
        data: error.response.data,
      });
    }

    // Handle client errors
    return Promise.reject({
      message: error.response.data?.message || "Request failed.",
      status: error.response.status,
      data: error.response.data,
    });
  }
);

export default api;
export { SERVER_URL };
