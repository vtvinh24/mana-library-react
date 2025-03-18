import { useCallback, useContext, useState } from "react";
import adminService from "../services/adminService";
import { useAuth } from "./AuthProvider";
import { AdminContext } from "./AppContext";

export const AdminProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookStats, setBookStats] = useState(null);

  const isAdmin = user?.role === "admin";

  // Get system metrics and dashboard data
  const getMetrics = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return { error: "Not authorized" };

    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getMetrics();
      setMetrics(response);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch metrics";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  // Get borrowing statistics
  const getBookStats = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return { error: "Not authorized" };

    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getBookStats();
      setBookStats(response);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch book statistics";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  // Import books from file
  const importBooks = useCallback(
    async (fileData) => {
      if (!isAuthenticated || !isAdmin) return { error: "Not authorized" };

      try {
        setLoading(true);
        setError(null);
        const response = await adminService.importBooks(fileData);
        return { success: true, imported: response.imported };
      } catch (err) {
        const message = err.message || "Failed to import books";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, isAdmin]
  );

  // Export books catalog
  const exportBooks = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return { error: "Not authorized" };

    try {
      setLoading(true);
      setError(null);
      const response = await adminService.exportBooks();
      return { success: true, url: response.url };
    } catch (err) {
      const message = err.message || "Failed to export books";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const value = {
    // State
    metrics,
    loading,
    error,
    bookStats,
    isAdmin,

    // Methods
    getMetrics,
    getBookStats,
    importBooks,
    exportBooks,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
export default AdminProvider;
