import { useState, useCallback, useEffect, useContext } from "react";
import bookService from "../services/bookService";
import { useAuth } from "./AuthProvider";
import { BookContext } from "./AppContext";

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

  // Initial load of books on provider mount
  useEffect(() => {
    getBooks(1, 10);
  }, []);

  // Get all books with filtering
  const getBooks = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookService.getAllBooks(page, limit, filters);
      if (!response || !response.books) {
        throw new Error("Invalid response from books API");
      }

      // Set the books from the data array from the server
      setBooks(response.books);

      // Set pagination data
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });

      return response;
    } catch (err) {
      console.error("Error fetching books:", err);
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
      console.log("Fetching book details for:", bookId);

      const response = await bookService.getBook(bookId);
      console.log("Book details response:", response);

      setBook(response);
      return response;
    } catch (err) {
      console.error("Error fetching book details:", err);
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
        console.log("Creating book with data:", bookData);

        const response = await bookService.createBook(bookData);
        console.log("Create book response:", response);

        setBooks((prevBooks) => [...prevBooks, response]);
        return { success: true, book: response };
      } catch (err) {
        console.error("Error creating book:", err);
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
        console.log("Updating book:", bookId, "with data:", bookData);

        const response = await bookService.updateBook(bookId, bookData);
        console.log("Update book response:", response);

        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? response : book)));
        if (book && book._id === bookId) {
          setBook(response);
        }
        return { success: true, book: response };
      } catch (err) {
        console.error("Error updating book:", err);
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
        console.log("Deleting book:", bookId);

        await bookService.deleteBook(bookId);
        console.log("Book deleted successfully");

        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
        if (book && book._id === bookId) {
          setBook(null);
        }
        return { success: true };
      } catch (err) {
        console.error("Error deleting book:", err);
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
      console.log("Searching books with query:", query, "page:", page, "limit:", limit);

      const response = await bookService.searchBooks(query, page, limit);
      console.log("Search books response:", response);

      setBooks(response.books);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
      return response;
    } catch (err) {
      console.error("Error searching books:", err);
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
        console.log("Borrowing book:", bookId);

        const response = await bookService.borrowBook(bookId);
        console.log("Borrow book response:", response);

        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, status: "borrowed" } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, status: "borrowed" });
        }
        setBorrowedBooks((prev) => [...prev, response.book]);
        return { success: true, dueDate: response.dueDate };
      } catch (err) {
        console.error("Error borrowing book:", err);
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
        console.log("Returning book:", bookId);

        const response = await bookService.returnBook(bookId);
        console.log("Return book response:", response);

        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, status: "available" } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, status: "available" });
        }
        setBorrowedBooks((prev) => prev.filter((book) => book._id !== bookId));
        return { success: true, lateFee: response.lateFee };
      } catch (err) {
        console.error("Error returning book:", err);
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
        console.log("Reserving book:", bookId);

        const response = await bookService.reserveBook(bookId);
        console.log("Reserve book response:", response);

        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, status: "reserved" } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, status: "reserved" });
        }
        setReservedBooks((prev) => [...prev, response.book]);
        return { success: true, expiresAt: response.expiresAt };
      } catch (err) {
        console.error("Error reserving book:", err);
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
        console.log("Cancelling reservation for book:", bookId);

        await bookService.cancelReservation(bookId);
        console.log("Reservation cancelled successfully");

        setBooks((prevBooks) => prevBooks.map((book) => (book._id === bookId ? { ...book, status: "available" } : book)));
        if (book && book._id === bookId) {
          setBook({ ...book, status: "available" });
        }
        setReservedBooks((prev) => prev.filter((book) => book._id !== bookId));
        return { success: true };
      } catch (err) {
        console.error("Error cancelling reservation:", err);
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
      console.log("Fetching borrowed books");

      const response = await bookService.getBorrowedBooks();
      console.log("Borrowed books response:", response);

      setBorrowedBooks(response.books);
      return response;
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
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
      console.log("Fetching reserved books");

      const response = await bookService.getReservedBooks();
      console.log("Reserved books response:", response);

      setReservedBooks(response.books);
      return response;
    } catch (err) {
      console.error("Error fetching reserved books:", err);
      const message = err.message || "Failed to fetch reserved books";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get book transaction history
  const getBookHistory = useCallback(
    async (filters = {}, page = 1, limit = 20) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setError(null);
        console.log("Fetching book history with filters:", filters);

        const response = await bookService.getBookHistory(filters, page, limit);
        console.log("Book history response:", response);

        return response;
      } catch (err) {
        console.error("Error fetching book history:", err);
        const message = err.message || "Failed to fetch book history";
        setError(message);
        return { error: message, transactions: [] };
      }
    },
    [isAuthenticated]
  );

  // Get books borrowed by specific user (admin/librarian)
  const getUserBorrowedBooks = useCallback(
    async (userId) => {
      if (!isAuthenticated) return { error: "Not authenticated" };

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching borrowed books for user:", userId);

        const response = await bookService.getUserBorrowedBooks(userId);
        console.log("User borrowed books response:", response);

        return response;
      } catch (err) {
        console.error("Error fetching user's borrowed books:", err);
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
        console.log("Fetching reserved books for user:", userId);

        const response = await bookService.getUserReservedBooks(userId);
        console.log("User reserved books response:", response);

        return response;
      } catch (err) {
        console.error("Error fetching user's reserved books:", err);
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
    getBookHistory,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = () => useContext(BookContext);
export default BookProvider;
