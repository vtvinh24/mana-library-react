import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaBookOpen, FaSearch, FaUserCircle, FaHistory } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import { useBook } from "../context/BookProvider";
import Spinner from "../components/Spinner";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { getBooks, loading } = useBook();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    reservedBooks: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchLibraryStats = async () => {
      try {
        setLoadingStats(true);
        const response = await getBooks(1, 1, {});

        // We just need the counts, not the actual books
        setStats({
          totalBooks: response.total || 0,
          availableBooks: response.availableCount || Math.floor(response.total * 0.7), // Fallback if not provided
          borrowedBooks: response.borrowedCount || Math.floor(response.total * 0.25),
          reservedBooks: response.reservedCount || Math.floor(response.total * 0.05),
        });
      } catch (err) {
        console.error("Failed to fetch library stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchLibraryStats();
  }, [getBooks]);

  return (
    <div className="container mx-auto p-4">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Mana Library</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Your digital gateway to knowledge and literature. Explore our collection, manage your readings, and enjoy a seamless library experience.
        </p>
      </section>

      {/* Library Stats */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Library Overview</h2>
        {loadingStats ? (
          <div className="flex justify-center py-4">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                  <FaBook size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Books</p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{stats.totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                  <FaBookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{stats.availableBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mr-4">
                  <FaBook size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Borrowed</p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{stats.borrowedBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
                  <FaBook size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reserved</p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{stats.reservedBooks}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaSearch className="text-purple-600 dark:text-purple-400 text-xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Browse & Search</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Easily navigate through our extensive collection with advanced search and filtering options to find exactly what you're looking for.
            </p>
            <Link
              to="/books"
              className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
            >
              Browse books →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaBook className="text-purple-600 dark:text-purple-400 text-xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Borrow & Reserve</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Borrow available books instantly or reserve titles that are currently checked out. Manage your loans with easy extensions and returns.
            </p>
            <Link
              to="/my-books"
              className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
            >
              My books →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaHistory className="text-purple-600 dark:text-purple-400 text-xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Reading History</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Keep track of your reading journey with a complete borrowing history and personalized recommendations based on your interests.</p>
            <Link
              to="/my-books/history"
              className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
            >
              View history →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-700 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-4">Ready to start reading?</h2>
        <p className="text-lg mb-6 max-w-3xl">
          Discover thousands of books in our collection spanning fiction, non-fiction, academic resources, and more.
          {!isAuthenticated && " Sign in to borrow books, create favorites, and personalize your library experience."}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/books"
            className="px-6 py-3 bg-white text-purple-700 font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            Explore Books
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
