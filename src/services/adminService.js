import api from "./api";

const adminService = {
  // Get system metrics and dashboard data
  getMetrics: async () => {
    try {
      const response = await api.get("/api/v1/admin/metrics");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get borrowing statistics
  getBookStats: async () => {
    try {
      const response = await api.get("/api/v1/books/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Import books from file
  importBooks: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append("file", fileData);

      const response = await api.post("/api/v1/books/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Export books catalog
  exportBooks: async () => {
    try {
      const response = await api.get("/api/v1/books/export");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },
};

export default adminService;
