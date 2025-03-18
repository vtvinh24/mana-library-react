import api from "./api";

const bookService = {
  // Get all books with filtering
  getAllBooks: async (page = 1, limit = 10, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/api/v1/books?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get specific book details
  getBook: async (bookId) => {
    try {
      const response = await api.get(`/api/v1/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Create a new book (admin/librarian)
  createBook: async (bookData) => {
    try {
      const response = await api.post("/api/v1/books", bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Update a book (admin/librarian)
  updateBook: async (bookId, bookData) => {
    try {
      const response = await api.patch(`/api/v1/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Delete a book (admin/librarian)
  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/api/v1/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Search for books
  searchBooks: async (query, page = 1, limit = 10) => {
    try {
      const queryParams = new URLSearchParams({
        q: query,
        page,
        limit,
      });
      const response = await api.get(`/api/v1/books/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Borrow a book
  borrowBook: async (bookId) => {
    try {
      const response = await api.post(`/api/v1/books/${bookId}/borrow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Return a book
  returnBook: async (bookId) => {
    try {
      const response = await api.post(`/api/v1/books/${bookId}/return`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Reserve a book
  reserveBook: async (bookId) => {
    try {
      const response = await api.post(`/api/v1/books/${bookId}/reserve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Cancel reservation
  cancelReservation: async (bookId) => {
    try {
      const response = await api.delete(`/api/v1/books/${bookId}/cancel-reservation`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get user's borrowed books
  getBorrowedBooks: async () => {
    try {
      const response = await api.get("/api/v1/books/borrowed");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get user's reserved books
  getReservedBooks: async () => {
    try {
      const response = await api.get("/api/v1/books/reserved");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get books borrowed by specific user (admin/librarian)
  getUserBorrowedBooks: async (userId) => {
    try {
      const response = await api.get(`/api/v1/books/borrowed/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get books reserved by specific user (admin/librarian)
  getUserReservedBooks: async (userId) => {
    try {
      const response = await api.get(`/api/v1/books/reserved/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  // Get borrowing statistics (admin)
  getBookStats: async () => {
    try {
      const response = await api.get("/api/v1/books/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },
};

export default bookService;
