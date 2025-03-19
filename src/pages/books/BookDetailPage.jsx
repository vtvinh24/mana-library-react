import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBook, FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useBook } from "../../context/BookProvider";
import { useAuth } from "../../context/AuthProvider";

const BookDetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { book, loading, error, getBook, borrowBook, reserveBook, borrowedBooks, reservedBooks } = useBook();
  const { isAuthenticated } = useAuth();

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get book details on mount
  useEffect(() => {
    const fetchBookDetails = async () => {
      await getBook(bookId);
    };

    fetchBookDetails();

    // Check if this book is in favorites
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(storedFavorites.includes(bookId));

    // Reset image error state when book ID changes
    setImageError(false);
  }, [bookId, getBook]);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle borrow action
  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/books/${bookId}`);
      return;
    }

    setActionLoading(true);
    try {
      const result = await borrowBook(bookId);
      if (result.success) {
        setMessage({
          type: "success",
          text: `Book borrowed successfully! Due date: ${new Date(result.dueDate).toLocaleDateString()}`,
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to borrow book.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred while processing your request.",
      });
    } finally {
      setActionLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Handle reserve action
  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/books/${bookId}`);
      return;
    }

    setActionLoading(true);
    try {
      const result = await reserveBook(bookId);
      if (result.success) {
        setMessage({
          type: "success",
          text: `Book reserved successfully! Reservation expires on: ${new Date(result.expiresAt).toLocaleDateString()}`,
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to reserve book.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred while processing your request.",
      });
    } finally {
      setActionLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/books/${bookId}`);
      return;
    }

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updatedFavorites;

    if (isFavorite) {
      // Remove from favorites
      updatedFavorites = storedFavorites.filter((id) => id !== bookId);
      setMessage({ type: "success", text: "Removed from favorites" });
    } else {
      // Add to favorites
      updatedFavorites = [...storedFavorites, bookId];
      setMessage({ type: "success", text: "Added to favorites" });
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  // Check if book is already borrowed by user
  const isBookBorrowed = () => {
    return borrowedBooks.some((item) => item.book && item.book._id === bookId);
  };

  // Check if book is already reserved by user
  const isBookReserved = () => {
    return reservedBooks.some((item) => item.book && item.book._id === bookId);
  };

  // Get action button based on book status and user's actions
  const getActionButton = () => {
    if (isBookBorrowed()) {
      return (
        <Link
          to="/my-books/borrowed"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View My Borrowed Books
        </Link>
      );
    }

    if (isBookReserved()) {
      return (
        <Link
          to="/my-books/reserved"
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          View My Reserved Books
        </Link>
      );
    }

    if (book?.status === "available") {
      return (
        <button
          onClick={handleBorrow}
          disabled={actionLoading}
          className={`px-4 py-2 rounded-md text-white ${actionLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {actionLoading ? "Processing..." : "Borrow Book"}
        </button>
      );
    }

    if (book?.status === "borrowed") {
      return (
        <button
          onClick={handleReserve}
          disabled={actionLoading}
          className={`px-4 py-2 rounded-md text-white ${actionLoading ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}`}
        >
          {actionLoading ? "Processing..." : "Reserve Book"}
        </button>
      );
    }

    return (
      <button
        disabled={true}
        className="px-4 py-2 bg-gray-500 text-white rounded-md cursor-not-allowed"
      >
        Not Available
      </button>
    );
  };

  if (loading && !book) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <Link
          to="/books"
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaArrowLeft className="mr-1" /> Back to Books
        </Link>

        {isAuthenticated && (
          <button
            onClick={handleToggleFavorite}
            className="flex items-center px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isFavorite ? (
              <>
                <FaHeart className="text-red-500 mr-2" /> Favorited
              </>
            ) : (
              <>
                <FaRegHeart className="mr-2" /> Add to Favorites
              </>
            )}
          </button>
        )}
      </div>

      {/* Error display */}
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{error}</div>}

      {/* Action message */}
      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {book && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book cover */}
            <div className="md:w-1/3 p-6 flex justify-center">
              {book.coverImage && !imageError ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full max-w-xs object-cover rounded-md shadow-md"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full max-w-xs h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md shadow-md">
                  <FaBook
                    size={64}
                    className="text-gray-400"
                  />
                </div>
              )}
            </div>

            {/* Book details */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">by {book.author}</p>

              <div className="flex flex-wrap items-center mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 ${
                    book.status === "available"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : book.status === "borrowed"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </span>

                {book.genre &&
                  book.genre.map((g, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                    >
                      {g}
                    </span>
                  ))}
              </div>

              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">{book.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Details</h3>
                  <dl>
                    {book.ISBN && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.ISBN}</dd>
                      </>
                    )}

                    {book.publisher && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Publisher</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.publisher}</dd>
                      </>
                    )}

                    {book.publicationYear && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Publication Year</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.publicationYear}</dd>
                      </>
                    )}

                    {book.pages && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pages</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.pages}</dd>
                      </>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Library Info</h3>
                  <dl>
                    {book.language && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.language}</dd>
                      </>
                    )}

                    {book.location && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.location}</dd>
                      </>
                    )}

                    {book.deweyDecimal && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dewey Decimal</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.deweyDecimal}</dd>
                      </>
                    )}

                    {book.condition && (
                      <>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Condition</dt>
                        <dd className="mb-2 text-gray-700 dark:text-gray-300">{book.condition}</dd>
                      </>
                    )}
                  </dl>
                </div>
              </div>

              {book.tags && book.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Tags</h3>
                  <div className="flex flex-wrap">
                    {book.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded text-sm mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">{getActionButton()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
