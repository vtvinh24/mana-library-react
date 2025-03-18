import { useState, useEffect, useContext } from "react";
import BookCard from "../../components/BookCard";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/common/Pagination";
import { FaTimes } from "react-icons/fa";
import BookContext from "../../context/BookProvider";

const ReservedBooks = () => {
  const { reservedBooks, loading, error, getReservedBooks, cancelReservation } = useContext(BookContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);

  useEffect(() => {
    const fetchReservedBooks = async () => {
      await getReservedBooks();
    };

    fetchReservedBooks();
  }, [getReservedBooks]);

  const handleCancelReservation = async (bookId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      const result = await cancelReservation(bookId);
      if (result.success) {
        // Success notification could be added here
      }
    }
  };

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = reservedBooks?.slice(indexOfFirstBook, indexOfLastBook) || [];
  const totalPages = Math.ceil((reservedBooks?.length || 0) / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && reservedBooks.length === 0) {
    return (
      <div className="flex justify-center my-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Reserved Books</h1>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {reservedBooks && reservedBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <div
                key={book._id}
                className="relative"
              >
                <BookCard book={book} />
                <button
                  onClick={() => handleCancelReservation(book._id)}
                  className="absolute bottom-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  title="Cancel Reservation"
                >
                  <FaTimes />
                </button>
                <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">Expires: {new Date(book.expirationDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-500 dark:text-gray-400">You have no reserved books at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default ReservedBooks;
