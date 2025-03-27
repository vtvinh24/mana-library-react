import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBook } from "../../context/BookProvider";
import { useAuth } from "../../context/AuthProvider";
import { FaArrowLeft, FaCalendarAlt, FaBook, FaHeart, FaRegHeart, FaLanguage } from "react-icons/fa";
import Spinner from "../../components/Spinner";

const BookDetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { book, loading, error, getBook, borrowBook, reserveBook } = useBook();
  const { isAuthenticated } = useAuth();

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get book details on mount
  useEffect(() => {
    if (bookId) {
      getBook(bookId);
    }
  }, [bookId, getBook]);

  // Check if book is in favorites when book data loads
  useEffect(() => {
    if (bookId) {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(storedFavorites.includes(bookId));
    }
  }, [bookId]);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle borrow action
  const handleBorrow = async () => {
    if (!isAuthenticated) {
      setMessage({ text: "Please sign in to borrow books", type: "error" });
      return;
    }

    try {
      setActionLoading(true);
      setMessage(null);

      const result = await borrowBook(bookId);

      if (result.success) {
        // Update book details after successful borrow
        await getBook(bookId);
        setMessage({
          text: `Book borrowed successfully! Due date: ${new Date(result.dueDate).toLocaleDateString()}`,
          type: "success",
        });
      } else {
        setMessage({ text: result.error || "Failed to borrow book", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to borrow book. Please try again.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reserve action
  const handleReserve = async () => {
    if (!isAuthenticated) {
      setMessage({ text: "Please sign in to reserve books", type: "error" });
      return;
    }

    try {
      setActionLoading(true);
      setMessage(null);

      const result = await reserveBook(bookId);

      if (result.success) {
        // Update book details after successful reservation
        await getBook(bookId);
        setMessage({
          text: `Book reserved successfully! Reservation expires on: ${new Date(result.expiresAt).toLocaleDateString()}`,
          type: "success",
        });
      } else {
        setMessage({ text: result.error || "Failed to reserve book", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to reserve book. Please try again.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      favorites = favorites.filter((id) => id !== bookId);
    } else {
      favorites.push(bookId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Get action button based on book status and user's interactions
  const getActionButton = () => {
    if (!book) return null;

    // Use the server-provided user interaction data
    if (book.userInteractions?.isBorrowed) {
      return (
        <button
          disabled
          className="bg-gray-500 text-white py-2 px-4 rounded disabled:opacity-70 cursor-not-allowed"
        >
          Currently Borrowed
        </button>
      );
    }

    if (book.userInteractions?.isReserved) {
      return (
        <button
          disabled
          className="bg-gray-500 text-white py-2 px-4 rounded disabled:opacity-70 cursor-not-allowed"
        >
          Reserved
        </button>
      );
    }

    // Use the server-provided availability information
    if (book.availability?.isAvailable) {
      return (
        <button
          onClick={handleBorrow}
          disabled={actionLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-70"
        >
          {actionLoading ? <Spinner size="sm" /> : "Borrow"}
        </button>
      );
    } else {
      return (
        <button
          onClick={handleReserve}
          disabled={actionLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded disabled:opacity-70"
        >
          {actionLoading ? <Spinner size="sm" /> : "Reserve"}
        </button>
      );
    }
  };

  if (loading && !book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back to Books
      </button>

      {/* Error Message */}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{error}</div>}

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {book && (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 p-6 flex justify-center">
              <div className="w-full max-w-sm aspect-[2/3] bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden shadow">
                {book.coverImage && !imageError ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaBook
                      size={64}
                      className="text-gray-400"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
                  <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-4">{book.author}</h2>
                </div>

                {/* Favorite button */}
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 bg-white/90 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full shadow"
                >
                  {isFavorite ? (
                    <FaHeart
                      className="text-red-500"
                      size={20}
                    />
                  ) : (
                    <FaRegHeart
                      className="text-gray-500 dark:text-gray-400"
                      size={20}
                    />
                  )}
                </button>
              </div>

              {/* Availability Status */}
              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    book.availability?.isAvailable ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {book.availability?.isAvailable ? "Available" : "Not Available"}
                </span>

                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {book.availability?.available} of {book.availability?.total} copies available
                </span>
              </div>

              {/* Reservation Status */}
              {book.userInteractions?.isReserved && book.userInteractions?.reservation && (
                <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">Your Reservation</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Status: <span className="font-medium">{book.userInteractions.reservation.status === "ready" ? "Ready for pickup" : "Pending"}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Expires: <span className="font-medium">{new Date(book.userInteractions.reservation.expiresAt).toLocaleDateString()}</span>
                  </p>
                </div>
              )}

              {/* Book Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FaLanguage className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">Language: </span>
                  <span className="ml-1 text-gray-700 dark:text-gray-300">{book.language || "Unknown"}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white">ISBN: </span>
                  <span className="ml-1 text-gray-700 dark:text-gray-300">{book.ISBN || "N/A"}</span>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">Published: </span>
                  <span className="ml-1 text-gray-700 dark:text-gray-300">{book.publicationYear || "Unknown"}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white">Publisher: </span>
                  <span className="ml-1 text-gray-700 dark:text-gray-300">{book.publisher || "Unknown"}</span>
                </div>
              </div>

              {/* Genre Tags */}
              {book.genre && book.genre.length > 0 && (
                <div className="mb-6">
                  <span className="text-gray-900 dark:text-white font-medium">Genres: </span>
                  <div className="flex flex-wrap mt-1">
                    {book.genre.map((genre, index) => (
                      <span
                        key={index}
                        className="mr-2 mb-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Synopsis */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Synopsis</h3>
                <p className="text-gray-700 dark:text-gray-300">{book.description || "No description available."}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">{getActionButton()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
