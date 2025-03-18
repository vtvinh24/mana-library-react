import { useState, useEffect, useCallback, useContext } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import BookCard from "../../components/BookCard";
import Pagination from "../../components/common/Pagination";
import Spinner from "../../components/Spinner";
import BookFilters from "../../components/books/BooksFilters";
import { BookContext } from "../../context/AppContext";

const BooksPage = () => {
  const { books, loading, error, pagination, getBooks, searchBooks } = useContext(BookContext);
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    genre: "",
    status: "",
    language: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [actionRequested, setActionRequested] = useState(null);

  // Function to fetch books based on current state
  const fetchBooks = useCallback(async () => {
    console.log("fetchBooks called with:", {
      isSearchMode,
      searchQuery,
      currentPage,
      filters,
    });

    try {
      if (isSearchMode && searchQuery) {
        console.log("Executing search with query:", searchQuery);
        await searchBooks(searchQuery, currentPage, 10);
      } else {
        console.log("Fetching books with filters:", filters);
        await getBooks(currentPage, 10, filters);
      }
    } catch (err) {
      console.error("Error in fetchBooks:", err);
    }
  }, [isSearchMode, searchQuery, currentPage, filters, getBooks, searchBooks]);

  // Initial data load
  useEffect(() => {
    console.log("BooksPage mounted, fetching initial data");
    getBooks(1, 10, {});
  }, [getBooks]);

  // Fetch books when page changes
  useEffect(() => {
    console.log("Page changed to:", currentPage);
    fetchBooks();
  }, [currentPage, fetchBooks]);

  // Load user favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, loading favorites");
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(storedFavorites);
    } else {
      console.log("User is not authenticated, clearing favorites");
      setFavorites([]);
    }
  }, [isAuthenticated]);

  // Handle search form submission
  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("Search form submitted with query:", searchQuery);

      setCurrentPage(1);
      setIsSearchMode(!!searchQuery);

      if (searchQuery) {
        await searchBooks(searchQuery, 1, 10);
      } else {
        await getBooks(1, 10, filters);
      }
    },
    [searchQuery, searchBooks, getBooks, filters]
  );

  const handleFilterChange = (name, value) => {
    console.log("Filter changed:", name, "=", value);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    console.log("Applying filters:", filters);
    setCurrentPage(1);
    setIsSearchMode(false);
    await getBooks(1, 10, filters);
    setShowFilters(false);
  };

  const clearFilters = async () => {
    console.log("Clearing filters");
    setFilters({
      title: "",
      author: "",
      genre: "",
      status: "",
      language: "",
    });
    setCurrentPage(1);
    setIsSearchMode(false);
    await getBooks(1, 10, {});
  };

  const handlePageChange = (page) => {
    console.log("Changing page to:", page);
    setCurrentPage(page);
  };

  const handleToggleFavorite = (bookId) => {
    console.log("Toggle favorite for book:", bookId);
    if (!isAuthenticated) {
      setActionRequested("favorite");
      setShowLoginPrompt(true);
      return;
    }

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updatedFavorites;

    if (favorites.includes(bookId)) {
      // Remove from favorites
      updatedFavorites = storedFavorites.filter((id) => id !== bookId);
      setFavorites((prev) => prev.filter((id) => id !== bookId));
    } else {
      // Add to favorites
      updatedFavorites = [...storedFavorites, bookId];
      setFavorites((prev) => [...prev, bookId]);
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleReserveBook = async (bookId) => {
    console.log("Attempting to reserve book:", bookId);
    if (!isAuthenticated) {
      setActionRequested("reserve");
      setShowLoginPrompt(true);
      return;
    }

    try {
      const result = await reserveBook(bookId);
      if (result.success) {
        alert(`Book reserved successfully! ${result.message}`);
      } else {
        alert(`Failed to reserve book: ${result.error}`);
      }
    } catch (err) {
      console.error("Error reserving book:", err);
      alert("Failed to reserve book. Please try again later.");
    }
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
    setActionRequested(null);
  };

  console.log("BooksPage render state:", {
    booksCount: books?.length,
    loading,
    error,
    pagination,
    currentPage,
    books,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isSearchMode ? "Search Results" : "Browse Books"}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaFilter className="mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-6"
      >
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-700 text-white rounded-r-md hover:bg-blue-700"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <BookFilters
            filters={filters}
            onChange={handleFilterChange}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Sign in Required</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Please sign in to {actionRequested === "favorite" ? "add books to your favorites" : "reserve books"}.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeLoginPrompt}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Books grid */}
          {books && books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  isFavorite={favorites.includes(book._id)}
                  onToggleFavorite={() => handleToggleFavorite(book._id)}
                  onReserve={() => handleReserveBook(book._id)}
                  isAvailable={book.status === "available"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">{isSearchMode ? "No books match your search criteria." : "No books found. The library shelves are empty!"}</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BooksPage;
