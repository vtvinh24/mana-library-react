import { useState, useEffect } from "react";
import { useBook } from "../../context/BookContext";
import BookCard from "../../components/BookCard";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/common/Pagination";
import { FaHeart } from "react-icons/fa";

const Favorites = () => {
  const { books, loading, error, getBooks } = useBook();
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);

  useEffect(() => {
    // In a real implementation, you would fetch favorites from an API
    // For now, we'll simulate with localStorage
    const fetchFavorites = async () => {
      // This would come from your backend in a real app
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      // If we have books loaded already, filter them by favorites
      if (books && books.length > 0) {
        const favoriteBooks = books.filter((book) => storedFavorites.includes(book._id));
        setFavorites(favoriteBooks);
      } else {
        // Otherwise, load all books first
        await getBooks();
      }
    };

    fetchFavorites();
  }, [books, getBooks]);

  const handleToggleFavorite = (bookId) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    // Remove from favorites
    const updatedFavorites = storedFavorites.filter((id) => id !== bookId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Update the UI
    setFavorites((prev) => prev.filter((book) => book._id !== bookId));
  };

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = favorites.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(favorites.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && favorites.length === 0) {
    return (
      <div className="flex justify-center my-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Favorite Books</h1>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {favorites.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <div
                key={book._id}
                className="relative"
              >
                <BookCard
                  book={book}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
                  <FaHeart className="mr-1" /> Favorite
                </div>
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
          <p className="text-gray-500 dark:text-gray-400">You haven't added any favorite books yet.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
