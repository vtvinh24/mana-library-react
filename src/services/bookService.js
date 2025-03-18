import api from "./api";

/**
 * Book service for all book-related API operations
 */
const bookService = {
  /**
   * Get all books with filtering, pagination and sorting
   * @param {Number} page - Page number
   * @param {Number} limit - Number of books per page
   * @param {Object} filters - Optional filters (title, author, genre, status, language)
   * @param {String} sortBy - Field to sort by
   * @param {String} sortOrder - Sort direction (asc or desc)
   * @returns {Promise} - Books data with pagination
   */
  getAllBooks: async (page = 1, limit = 10, filters = {}, sortBy = "title", sortOrder = "asc") => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        sortBy,
        sortOrder,
        ...filters,
      });
      const response = await api.get(`/api/v1/books?${queryParams}`);
      alert(1);

      return {
        books: response.data.data,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.pages,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Get specific book details
   * @param {String} bookId - Book ID
   * @returns {Promise} - Book details
   */
  getBook: async (bookId) => {
    try {
      const response = await api.get(`/api/v1/books/${bookId}`);
      return response.data.book;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Create a new book (admin/librarian)
   * @param {Object} bookData - Book data
   * @returns {Promise} - Created book
   */
  createBook: async (bookData) => {
    try {
      const response = await api.post("/api/v1/books", bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Update a book (admin/librarian)
   * @param {String} bookId - Book ID
   * @param {Object} bookData - Updated book data
   * @returns {Promise} - Updated book
   */
  updateBook: async (bookId, bookData) => {
    try {
      const response = await api.patch(`/api/v1/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Delete a book (admin/librarian)
   * @param {String} bookId - Book ID
   * @returns {Promise} - Success message
   */
  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/api/v1/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Search for books
   * @param {String} query - Search query
   * @param {Number} page - Page number
   * @param {Number} limit - Number of books per page
   * @param {String} sortBy - Field to sort by
   * @param {String} sortOrder - Sort direction (asc or desc)
   * @returns {Promise} - Search results with pagination
   */
  searchBooks: async (query, page = 1, limit = 10, sortBy = "title", sortOrder = "asc") => {
    try {
      const queryParams = new URLSearchParams({
        q: query,
        page,
        limit,
        sortBy,
        sortOrder,
      });
      const response = await api.get(`/api/v1/books/search?${queryParams}`);
      return {
        books: response.data.data,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.pages,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Borrow a book
   * @param {String} bookId - Book ID
   * @returns {Promise} - Success message and due date
   */
  borrowBook: async (bookId) => {
    try {
      // Server extracts userId from JWT token via requireAuth middleware
      const response = await api.post(`/api/v1/books/${bookId}/borrow`);
      return {
        success: true,
        message: response.data.message,
        dueDate: response.data.dueDate,
        book: response.data.book || { _id: bookId, status: "borrowed" },
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Return a book
   * @param {String} bookId - Book ID
   * @returns {Promise} - Success message and late fee if applicable
   */
  returnBook: async (bookId) => {
    try {
      // Server extracts userId from JWT token via requireAuth middleware
      const response = await api.post(`/api/v1/books/${bookId}/return`);
      return {
        success: true,
        message: response.data.message,
        lateFee: response.data.lateFee,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Reserve a book
   * @param {String} bookId - Book ID
   * @returns {Promise} - Success message and reservation details
   */
  reserveBook: async (bookId) => {
    try {
      // Server extracts userId from JWT token via requireAuth middleware
      const response = await api.post(`/api/v1/books/${bookId}/reserve`);
      return {
        success: true,
        message: response.data.message,
        status: response.data.status,
        expiresAt: response.data.expiresAt,
        book: response.data.book || { _id: bookId, status: "reserved" },
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Cancel reservation
   * @param {String} bookId - Book ID
   * @returns {Promise} - Success message
   */
  cancelReservation: async (bookId) => {
    try {
      // Server extracts userId from JWT token via requireAuth middleware
      const response = await api.delete(`/api/v1/books/${bookId}/reservation`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Get user's borrowed books
   * @returns {Promise} - Borrowed books
   */
  getBorrowedBooks: async () => {
    try {
      const response = await api.get("/api/v1/books/borrowed");
      return {
        books: response.data.data || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Get user's reserved books
   * @returns {Promise} - Reserved books
   */
  getReservedBooks: async () => {
    try {
      const response = await api.get("/api/v1/books/reserved");
      return {
        books: response.data.data || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Get books borrowed by specific user (admin/librarian)
   * @param {String} userId - User ID
   * @returns {Promise} - User borrowed books
   */
  getUserBorrowedBooks: async (userId) => {
    try {
      const response = await api.get(`/api/v1/books/borrowed/${userId}`);
      return {
        user: response.data.user,
        books: response.data.data || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Get books reserved by specific user (admin/librarian)
   * @param {String} userId - User ID
   * @returns {Promise} - User reserved books
   */
  getUserReservedBooks: async (userId) => {
    try {
      const response = await api.get(`/api/v1/books/reserved/${userId}`);
      return {
        user: response.data.user,
        books: response.data.data || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Get borrowing statistics (admin)
   * @returns {Promise} - Book statistics
   */
  getBookStats: async () => {
    try {
      const response = await api.get("/api/v1/books/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Export books catalog (admin)
   * @param {Object} filters - Optional filters (genre, author, status, language)
   * @returns {Promise} - Exported books data
   */
  exportBooks: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`/api/v1/books/export?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },

  /**
   * Import books from file (admin)
   * @param {File} file - JSON file containing books data
   * @returns {Promise} - Import results
   */
  importBooks: async (file) => {
    try {
      const formData = new FormData();
      formData.append("booksFile", file); // Note: Server expects "booksFile" as file field name

      const response = await api.post("/api/v1/books/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        message: response.data.message,
        imported: parseInt(response.data.message.match(/\d+/)[0]),
        errors: response.data.errors,
      };
    } catch (error) {
      throw error.response?.data || new Error("Network error");
    }
  },
};

export default bookService;
