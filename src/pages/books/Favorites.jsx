import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaArrowLeft, FaHeart, FaClock } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useBook } from "../../context/BookProvider";
import { useAuth } from "../../context/AuthProvider";

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const { books, loading: booksLoading, getBooks } = useBook();
  const [favorites, setFavorites] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [removing, setRemoving] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all books and filter by favorites from localStorage
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Get favorite IDs from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(storedFavorites);

        if (storedFavorites.length > 0) {
          // Fetch all books to get details for favorites
          await getBooks();
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setMessage({
          type: "error",
          text: "Failed to load favorite books. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [getBooks]);

  // Match favorite IDs with book details
  useEffect(() => {
    if (books && books.length > 0 && favorites.length > 0) {
      const bookDetails = books.filter((book) => favorites.includes(book._id));
      setFavoriteBooks(bookDetails);
    } else {
      setFavoriteBooks([]);
    }
  }, [books, favorites]);

  // Handle removing a book from favorites
  const handleRemoveFromFavorites = (bookId) => {
    setRemoving(bookId);
    try {
      // Get current favorites from localStorage
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      // Remove the book ID from favorites
      const updatedFavorites = storedFavorites.filter((id) => id !== bookId);

      // Update localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      // Update state
      setFavorites(updatedFavorites);

      setMessage({
        type: "success",
        text: "Book removed from favorites.",
      });
    } catch (err) {
      console.error("Failed to remove from favorites:", err);
      setMessage({
        type: "error",
        text: "Failed to remove book from favorites.",
      });
    } finally {
      setRemoving(null);
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const isLoading = loading || booksLoading;

  // Show loading spinner when initially loading
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorite Books</h1>
        <Link
          to="/my-books"
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaArrowLeft className="mr-1" /> Back to My Books
        </Link>
      </div>

      {/* Message display */}
      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {favoriteBooks && favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {favoriteBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 md:p-6 flex flex-col md:flex-row">
                {/* Book cover image */}
                <div className="flex-shrink-0 w-full md:w-48 h-48 mb-4 md:mb-0 md:mr-6 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBook
                        size={48}
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* Book details */}
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Author:</span> {book.author}
                  </p>
                  {book.isbn && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <span className="font-semibold">ISBN:</span> {book.isbn}
                    </p>
                  )}

                  {/* Additional details and badges */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-2">Status:</span>
                      <span
                        className={`font-medium px-2 py-0.5 rounded-full text-sm ${
                          book.status === "available"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : book.status === "borrowed"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {book.status ? book.status.charAt(0).toUpperCase() + book.status.slice(1) : "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-2">Added to favorites:</span>
                      <span className="font-medium flex items-center">
                        <FaHeart className="text-red-500 mr-1" />
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleRemoveFromFavorites(book._id)}
                      disabled={removing === book._id}
                      className={`px-4 py-2 rounded-md text-white ${removing === book._id ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"}`}
                    >
                      {removing === book._id ? "Removing..." : "Remove from Favorites"}
                    </button>

                    {/* {book.status === "available" && (
                      <Link
                        to={`/books?reserve=${book._id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Reserve
                      </Link>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <FaHeart className="mx-auto text-5xl text-red-400 dark:text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Favorite Books</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't added any books to your favorites yet.</p>
          <Link
            to="/books"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
          >
            Browse Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
