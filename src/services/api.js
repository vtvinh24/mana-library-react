import axios from "axios";
import authService, { tokenManager } from "./authService";

// should read env instead
const SERVER_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// include token in the request headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // on network error
    if (!error.response) {
      return Promise.reject({
        message: "Network error.",
        isNetworkError: true,
      });
    }

    // 401: Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // avoid infinite loops
      try {
        // if refresh token is expired, logout
        if (authService.isRefreshTokenExpired()) {
          authService.logout();
          return Promise.reject({
            message: "Your session has expired. Please log in again.",
            isAuthError: true,
          });
        } else {
          // if refresh token is valid, get a new access token
          const response = await authService.refreshToken();
          tokenManager.setToken(response.accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${response.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Only logout if the refresh token is invalid or expired
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

    // Handle server errors (5xx)
    else if (error.response.status >= 500) {
      return Promise.reject({
        message: "Server error.",
        isServerError: true,
        status: error.response.status,
        data: error.response.data,
      });
    }

    // Handle other client errors (4xx)
    else if (error.response.status >= 400) {
      return Promise.reject({
        message: error.response.data?.message || "Request failed.",
        status: error.response.status,
        data: error.response.data,
      });
    }

    // Handle all other errors
    return Promise.reject(error);
  }
);

export default api;
export { SERVER_URL };
