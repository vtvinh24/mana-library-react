// src/components/BookCard.jsx
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const BookCard = ({ book, isFavorite, onToggleFavorite, isAdminView = false }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="relative h-60">
        <img
          src={book.coverImage || "/placeholder-cover.jpg"}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        {!isAdminView && (
          <button
            className="absolute top-2 right-2 text-2xl text-red-500"
            onClick={() => onToggleFavorite(book._id)}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>

        <div className="flex justify-between mt-2">
          <span
            className={`px-2 py-1 text-xs rounded ${
              book.status === "available"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : book.status === "borrowed"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {book.status}
          </span>

          <Link
            to={`/books/${book._id}`}
            className="text-blue-500 hover:underline"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
