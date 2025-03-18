import React, { createContext, useState, useCallback, useContext } from "react";
import bookService from "../services/bookService";
import { useAuth } from "./AuthContext";

export const BookContext = createContext(null);

export const BookProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Get all books with filtering
  const getBooks = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getAllBooks(page, limit, filters);
      setBooks(response.books);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch books";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get specific book details
  const getBook = useCallback(async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBook(bookId);
      setBook(response);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch book details";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new book (admin/librarian)
  const createBook = useCallback(
    async (bookData) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await bookService.createBook(bookData);
        setBooks((prevBooks) => [...prevBooks, response]);
        return { success: true, book: response };
      } catch (err) {
        const message = err.message || "Failed to create book";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Update a book (admin/librarian)
  const updateBook = useCallback(
    async (bookId, bookData) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await bookService.updateBook(bookId, bookData);
        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? response : book)));
        if (book && book._id === bookId) {
          setBook(response);
        }
        return { success: true, book: response };
      } catch (err) {
        const message = err.message || "Failed to update book";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, book]
  );

  // Delete a book (admin/librarian)
  const deleteBook = useCallback(
    async (bookId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        await bookService.deleteBook(bookId);
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
        if (book && book._id === bookId) {
          setBook(null);
        }
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to delete book";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, book]
  );

  // Search for books
  const searchBooks = useCallback(async (query, page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.searchBooks(query, page, limit);
      setBooks(response.books);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
      return response;
    } catch (err) {
      const message = err.message || "Failed to search books";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Borrow a book
  const borrowBook = useCallback(
    async (bookId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await bookService.borrowBook(bookId);
        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, available: false, borrowedBy: response.userId } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, available: false, borrowedBy: response.userId });
        }
        setBorrowedBooks((prev) => [...prev, response.book]);
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to borrow book";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, book]
  );

  // Return a book
  const returnBook = useCallback(
    async (bookId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await bookService.returnBook(bookId);
        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, available: true, borrowedBy: null } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, available: true, borrowedBy: null });
        }
        setBorrowedBooks((prev) => prev.filter((book) => book._id !== bookId));
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to return book";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, book]
  );

  // Reserve a book
  const reserveBook = useCallback(
    async (bookId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await bookService.reserveBook(bookId);
        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, reserved: true, reservedBy: response.userId } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, reserved: true, reservedBy: response.userId });
        }
        setReservedBooks((prev) => [...prev, response.book]);
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to reserve book";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, book]
  );

  // Cancel reservation
  const cancelReservation = useCallback(
    async (bookId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        await bookService.cancelReservation(bookId);
        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, reserved: false, reservedBy: null } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, reserved: false, reservedBy: null });
        }
        setReservedBooks((prev) => prev.filter((book) => book._id !== bookId));
        return { success: true };
      } catch (err) {
        const message = err.message || "Failed to cancel reservation";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, book]
  );

  // Get user's borrowed books
  const getBorrowedBooks = useCallback(async () => {
    if (!isAuthenticated) return { error: "Not authenticated" };

    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBorrowedBooks();
      setBorrowedBooks(response.books);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch borrowed books";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get user's reserved books
  const getReservedBooks = useCallback(async () => {
    if (!isAuthenticated) return { error: "Not authenticated" };

    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getReservedBooks();
      setReservedBooks(response.books);
      return response;
    } catch (err) {
      const message = err.message || "Failed to fetch reserved books";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get books borrowed by specific user (admin/librarian)
  const getUserBorrowedBooks = useCallback(
    async (userId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await bookService.getUserBorrowedBooks(userId);
        return response;
      } catch (err) {
        const message = err.message || "Failed to fetch user's borrowed books";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Get books reserved by specific user (admin/librarian)
  const getUserReservedBooks = useCallback(
    async (userId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        const response = await bookService.getUserReservedBooks(userId);
        return response;
      } catch (err) {
        const message = err.message || "Failed to fetch user's reserved books";
        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const value = {
    // State
    books,
    book,
    loading,
    error,
    borrowedBooks,
    reservedBooks,
    pagination,

    // Methods
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    borrowBook,
    returnBook,
    reserveBook,
    cancelReservation,
    getBorrowedBooks,
    getReservedBooks,
    getUserBorrowedBooks,
    getUserReservedBooks,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

// Custom hook for easier context use
export const useBook = () => useContext(BookContext);
export default BookProvider;
