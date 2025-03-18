import api from "./api";

const userService = {
  // Get all users (admin/librarian)
  getAllUsers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/api/v1/users?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get specific user (admin/librarian)
  getUser: async (userId) => {
    try {
      const response = await api.get(`/api/v1/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Create a new user (admin)
  createUser: async (userData) => {
    try {
      const response = await api.post("/api/v1/users", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Update user (admin/librarian)
  updateUser: async (userId, userData) => {
    try {
      const response = await api.patch(`/api/v1/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Delete user (admin)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/api/v1/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get("/api/v1/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.patch("/api/v1/users/profile", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get user's favorite books
  getFavorites: async () => {
    try {
      const response = await api.get("/api/v1/users/favorites");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Add book to favorites
  addFavorite: async (bookId) => {
    try {
      const response = await api.post(`/api/v1/users/favorites/${bookId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Remove from favorites
  removeFavorite: async (bookId) => {
    try {
      const response = await api.delete(`/api/v1/users/favorites/${bookId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get user notifications
  getNotifications: async () => {
    try {
      const response = await api.get("/api/v1/users/notifications");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.post(`/api/v1/users/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    try {
      const response = await api.post("/api/v1/users/notifications/read-all");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },
};

export default userService;
