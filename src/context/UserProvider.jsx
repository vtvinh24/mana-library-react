import { useCallback, useContext, useState } from "react";
import userService from "../services/userService";
import { useAuth } from "./AuthProvider";
import { UserContext } from "./AppContext";

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Get all users (admin/librarian)
  const getUsers = useCallback(
    async (page = 1, limit = 10, filters = {}) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await userService.getAllUsers(page, limit, filters);
        setUsers(response.users);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
        return response;
      } catch (err) {
        const message = err.message || "Failed to fetch users";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Get specific user (admin/librarian)
  const getUser = useCallback(
    async (id) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await userService.getUser(id);
        setUser(response);
        return response;
      } catch (err) {
        const message = err.message || "Failed to fetch user details";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Create a new user (admin)
  const createUser = useCallback(
    async (userData) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await userService.createUser(userData);
        setUsers((prevUsers) => [...prevUsers, response]);
        return { success: true, user: response };
      } catch (err) {
        const message = err.message || "Failed to create user";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Update a user (admin/librarian)
  const updateUser = useCallback(
    async (id, userData) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await userService.updateUser(id, userData);
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === id ? response : user)));
        if (user && user._id === id) {
          setUser(response);
        }
        return { success: true, user: response };
      } catch (err) {
        const message = err.message || "Failed to update user";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  // Delete a user (admin)
  const deleteUser = useCallback(
    async (id) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        await userService.deleteUser(id);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        if (user && user._id === id) {
          setUser(null);
        }
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to delete user";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  // Get current user profile
  const getProfile = useCallback(async () => {
    if (!isAuthenticated) return { error: "Not authenticated" };

    try {
      setLoading(true);
      setError(null);
      const response = await userService.getProfile();
      setUser(response);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch profile";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update current user profile
  const updateProfile = useCallback(
    async (userData) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await userService.updateProfile(userData);
        setUser(response);
        return { success: true, user: response };
      } catch (err) {
        const message = err.message || "Failed to update profile";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Get user's favorite books
  const getFavorites = useCallback(async () => {
    if (!isAuthenticated) return { error: "Not authenticated" };

    try {
      setLoading(true);
      setError(null);
      const response = await userService.getFavorites();
      setFavorites(response.favorites);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch favorites";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add book to favorites
  const addFavorite = useCallback(
    async (bookId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await userService.addFavorite(bookId);
        setFavorites((prev) => [...prev, response.book]);
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to add to favorites";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Remove book from favorites
  const removeFavorite = useCallback(
    async (bookId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        await userService.removeFavorite(bookId);
        setFavorites((prev) => prev.filter((book) => book._id !== bookId));
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to remove from favorites";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Get user notifications
  const getNotifications = useCallback(async () => {
    if (!isAuthenticated) return { error: "Not authenticated" };

    try {
      setLoading(true);
      setError(null);
      const response = await userService.getNotifications();
      setNotifications(response.notifications);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch notifications";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markNotificationRead = useCallback(
    async (notificationId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        await userService.markNotificationRead(notificationId);
        setNotifications((prev) => prev.map((notification) => (notification._id === notificationId ? { ...notification, read: true } : notification)));
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to mark notification as read";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Mark all notifications as read
  const markAllNotificationsRead = useCallback(async () => {
    if (!isAuthenticated) return { error: "Not authenticated" };

    try {
      setLoading(true);
      setError(null);
      await userService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
      return { success: true };
    } catch (err) {
      const message = err.message || "Failed to mark all notifications as read";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Provide all functions and state through context
  const value = {
    // State
    users,
    user,
    loading,
    error,
    favorites,
    notifications,
    pagination,

    // Admin/Librarian user management
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,

    // Profile management
    getProfile,
    updateProfile,

    // Favorites management
    getFavorites,
    addFavorite,
    removeFavorite,

    // Notifications management
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for easier context use
export const useUser = () => useContext(UserContext);
export default UserProvider;
