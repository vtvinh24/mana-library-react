import { useState, useEffect, useContext } from "react";
import BookCard from "../../components/BookCard";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/common/Pagination";
import { FaUndo } from "react-icons/fa";
import BookContext from "../../context/BookProvider";

const BorrowedBooks = () => {
  const { borrowedBooks, loading, error, getBorrowedBooks, returnBook } = useContext(BookContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      await getBorrowedBooks();
    };

    fetchBorrowedBooks();
  }, [getBorrowedBooks]);

  const handleReturnBook = async (bookId) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      const result = await returnBook(bookId);
      if (result.success) {
        // Success notification could be added here
      }
    }
  };

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = borrowedBooks?.slice(indexOfFirstBook, indexOfLastBook) || [];
  const totalPages = Math.ceil((borrowedBooks?.length || 0) / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render loading spinner if still loading and no books available yet
  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Borrowed Books</h1>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {!borrowedBooks || borrowedBooks.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">You have no borrowed books at the moment.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Books you borrow from the library will appear here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <div
                key={book._id}
                className="relative"
              >
                <BookCard book={book} />
                <button
                  onClick={() => handleReturnBook(book._id)}
                  className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  title="Return Book"
                >
                  <FaUndo />
                </button>
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Due: {new Date(book.dueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default BorrowedBooks;
