import { FaHeart, FaRegHeart } from "react-icons/fa";

const BookCard = ({ book, isFavorite, onToggleFavorite, onReserve, isAvailable }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
      <div className="relative h-64 overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No cover image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600 dark:text-gray-300" />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{book.author}</p>

        <div className="flex items-center justify-between mt-4">
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              book.status === "available"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : book.status === "borrowed"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : book.status === "reserved"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
          </span>

          {isAvailable && (
            <button
              onClick={onReserve}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Reserve
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
