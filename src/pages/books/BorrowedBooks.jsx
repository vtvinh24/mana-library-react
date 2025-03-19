import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaArrowLeft, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useBook } from "../../context/BookProvider";

const BorrowedBooks = () => {
  const { borrowedBooks, loading, error, getBorrowedBooks, returnBook } = useBook();
  const [returningBook, setReturningBook] = useState(null);
  const [returnMessage, setReturnMessage] = useState(null);
  const [returnedBooks, setReturnedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      await getBorrowedBooks();
    };

    fetchBooks();
  }, [getBorrowedBooks]);

  // Check if a book is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Format the due date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle book return
  const handleReturnBook = async (bookId) => {
    setReturningBook(bookId);
    try {
      const result = await returnBook(bookId);
      if (result.success) {
        setReturnedBooks((prev) => [...prev, bookId]);
        setReturnMessage({
          type: "success",
          text: result.lateFee > 0 ? `Book returned successfully. Late fee: $${result.lateFee.toFixed(2)}` : "Book returned successfully.",
        });
      } else {
        setReturnMessage({
          type: "error",
          text: result.error || "Failed to return book.",
        });
      }
    } catch (err) {
      setReturnMessage({
        type: "error",
        text: "An error occurred while returning the book.",
      });
    } finally {
      setReturningBook(null);
      // Clear message after 5 seconds
      setTimeout(() => {
        setReturnMessage(null);
      }, 5000);
    }
  };

  if (loading && borrowedBooks.length === 0) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Borrowed Books</h1>
        <Link
          to="/my-books"
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaArrowLeft className="mr-1" /> Back to My Books
        </Link>
      </div>

      {/* Error display */}
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{error}</div>}

      {/* Return message */}
      {returnMessage && (
        <div
          className={`p-4 mb-4 rounded-md ${
            returnMessage.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
          }`}
        >
          {returnMessage.text}
        </div>
      )}

      {borrowedBooks && borrowedBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {borrowedBooks.map((item) => (
            <div
              key={item && item.book ? item.book._id : `item-${Math.random()}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 md:p-6 flex flex-col md:flex-row">
                {/* Book cover image */}
                <div className="w-full md:w-32 h-48 md:h-auto mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                  {item && item.book && item.book.coverImage ? (
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item && item.book ? item.book.title : "Loading book title..."}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">by {item && item.book ? item.book.author : "Loading author..."}</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-2">Borrowed on:</span>
                      <span className="font-medium">{item && item.borrowDate ? formatDate(item.borrowDate) : "Loading..."}</span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-2">Due date:</span>
                      <span className={`font-medium flex items-center ${item && item.dueDate && isOverdue(item.dueDate) ? "text-red-600 dark:text-red-400" : ""}`}>
                        {item && item.dueDate ? formatDate(item.dueDate) : "Loading..."}
                        {item && item.dueDate && isOverdue(item.dueDate) && (
                          <FaExclamationCircle
                            className="ml-1 text-red-600 dark:text-red-400"
                            title="Overdue"
                          />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item && item.dueDate
                        ? isOverdue(item.dueDate)
                          ? `Overdue by ${Math.ceil((new Date() - new Date(item.dueDate)) / (1000 * 60 * 60 * 24))} days`
                          : `${Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining`
                        : "Calculating days..."}
                    </span>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => item && item.book && handleReturnBook(item.book._id)}
                      disabled={!item || !item.book || returningBook === (item.book && item.book._id) || (item.book && returnedBooks.includes(item.book._id))}
                      className={`px-4 py-2 rounded-md text-white ${
                        !item || !item.book || returningBook === (item.book && item.book._id) || (item.book && returnedBooks.includes(item.book._id))
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      }`}
                    >
                      {!item || !item.book ? "Loading..." : returningBook === item.book._id ? "Processing..." : returnedBooks.includes(item.book._id) ? "Returned" : "Return Book"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <FaBook className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Borrowed Books</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have any books borrowed at the moment.</p>
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

export default BorrowedBooks;
