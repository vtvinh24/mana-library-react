import { useState } from "react";
import { FaBook, FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const BookCard = ({ book, isFavorite, onToggleFavorite, onReserve, isAvailable, availableCopies, totalCopies }) => {
  const [imageError, setImageError] = useState(false);

  // Handle clicking the favorite button without navigating
  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    onToggleFavorite();
  };

  // Handle reserve button click without navigating
  const handleReserve = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    onReserve();
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link
      to={`/books/${book._id}`}
      className="block transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
    >
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 h-full flex flex-col">
        {/* Book Cover Image */}
        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                size={48}
                className="text-gray-400"
              />
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-2 right-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600 dark:text-gray-300" />}
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-2 left-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isAvailable ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Book Information */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{book.author}</p>

          {/* Genre/Tags */}
          {book.genre && book.genre.length > 0 && (
            <div className="mb-3 flex flex-wrap">
              {book.genre.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="mr-1 mb-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full"
                >
                  {genre}
                </span>
              ))}
              {book.genre.length > 2 && <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">+{book.genre.length - 2}</span>}
            </div>
          )}

          {/* Availability */}
          <div className="mt-auto pt-3">
            <div className="w-full text-sm text-gray-600 dark:text-gray-300">
              {availableCopies !== undefined && totalCopies !== undefined && (
                <span>
                  {availableCopies} of {totalCopies} copies available
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-2">
              {isAvailable ? (
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm font-medium transition-colors"
                  onClick={handleReserve}
                >
                  Borrow
                </button>
              ) : (
                <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm font-medium transition-colors">Not available</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
