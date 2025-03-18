import { useState, useEffect, useCallback } from "react";
import { useBook } from "../../context/BookContext";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import BookCard from "../../components/BookCard";
import Pagination from "../../components/common/Pagination";
import Spinner from "../../components/Spinner";
import BookFilters from "../../components/books/BooksFilters";

const BooksPage = () => {
  const { books, loading, error, pagination, getBooks, searchBooks } = useBook();
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

  // Load books on initial render
  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    if (isSearchMode && searchQuery) {
      await searchBooks(searchQuery, currentPage, 10);
    } else {
      await getBooks(currentPage, 10, filters);
    }
  };

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
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
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    setCurrentPage(1);
    setIsSearchMode(false);
    await getBooks(1, 10, filters);
    setShowFilters(false);
  };

  const clearFilters = async () => {
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
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isSearchMode ? "Search Results" : "Browse Books"}</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaFilter className="mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">{isSearchMode ? "No books match your search criteria." : "No books found with the current filters."}</p>
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
