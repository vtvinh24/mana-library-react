import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useBook } from "../../context/BookProvider";

const ReservedBooks = () => {
  const { reservedBooks, loading, error, getReservedBooks, cancelReservation } = useBook();
  const [cancellingReservation, setCancellingReservation] = useState(null);
  const [cancelMessage, setCancelMessage] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      await getReservedBooks();
    };

    fetchBooks();
  }, [getReservedBooks]);

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days until expiration
  const daysUntilExpiration = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Handle reservation cancellation
  const handleCancelReservation = async (bookId) => {
    setCancellingReservation(bookId);
    try {
      const result = await cancelReservation(bookId);
      if (result.success) {
        setCancelMessage({
          type: "success",
          text: "Reservation canceled successfully.",
        });
      } else {
        setCancelMessage({
          type: "error",
          text: result.error || "Failed to cancel reservation.",
        });
      }
    } catch (err) {
      setCancelMessage({
        type: "error",
        text: "An error occurred while canceling the reservation.",
      });
    } finally {
      setCancellingReservation(null);
      // Clear message after 5 seconds
      setTimeout(() => {
        setCancelMessage(null);
      }, 5000);
    }
  };

  if (loading && reservedBooks.length === 0) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reserved Books</h1>
        <Link
          to="/my-books"
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaArrowLeft className="mr-1" /> Back to My Books
        </Link>
      </div>

      {/* Error display */}
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{error}</div>}

      {/* Cancellation message */}
      {cancelMessage && (
        <div
          className={`p-4 mb-4 rounded-md ${
            cancelMessage.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
          }`}
        >
          {cancelMessage.text}
        </div>
      )}

      {reservedBooks && reservedBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {reservedBooks.map((item) => (
            <div
              key={item.book._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 md:p-6 flex flex-col md:flex-row">
                {/* Book cover image */}
                <div className="w-full md:w-32 h-48 md:h-auto mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                  {item.book.coverImage ? (
                    <img
                      src={item.book.coverImage}
                      alt={`Cover of ${item.book.title}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
                      <FaBook
                        size={32}
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* Book details */}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.book.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">by {item.book.author}</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-2">Reserved on:</span>
                      <span className="font-medium">{formatDate(item.reservedAt)}</span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-2">Expires on:</span>
                      <span className="font-medium">{formatDate(item.expiresAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {daysUntilExpiration(item.expiresAt) <= 0 ? `Expired ${Math.abs(daysUntilExpiration(item.expiresAt))} days ago` : `Expires in ${daysUntilExpiration(item.expiresAt)} days`}
                    </span>
                  </div>

                  <div className="flex items-center mt-2">
                    <FaClock className="text-blue-500 dark:text-blue-400 mr-2" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">{item.availableForPickup ? "Available for pickup now!" : "You will be notified when the book is available"}</span>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => handleCancelReservation(item.book._id)}
                      disabled={cancellingReservation === item.book._id}
                      className={`px-4 py-2 rounded-md text-white ${
                        cancellingReservation === item.book._id ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                      }`}
                    >
                      {cancellingReservation === item.book._id ? "Cancelling..." : "Cancel Reservation"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <FaClock className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Reserved Books</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have any books reserved at the moment.</p>
          <Link
            to="/books"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
          >
            Browse Available Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReservedBooks;
