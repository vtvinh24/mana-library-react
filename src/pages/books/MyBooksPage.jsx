import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaBookmark, FaHistory, FaClock, FaHeart } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useBook } from "../../context/BookProvider";
import { useUser } from "../../context/UserProvider";

const MyBooksPage = () => {
  const { borrowedBooks, reservedBooks, loading, error, getBorrowedBooks, getReservedBooks, getBookHistory } = useBook();
  const { favorites, getFavorites, loading: userLoading } = useUser();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load borrowed and reserved books
        await Promise.all([getBorrowedBooks(), getReservedBooks()]);

        // Get favorites from API
        await getFavorites();

        // Fetch transaction history
        setLoadingActivity(true);
        setActivityError(null);
        try {
          const history = await getBookHistory({ limit: 5 });
          if (history && history.transactions) {
            setRecentActivity(history.transactions);
          }
        } catch (err) {
          console.error("Error fetching activity:", err);
          setActivityError("Failed to load recent activity. Please try again later.");
        } finally {
          setLoadingActivity(false);
        }
      } catch (err) {
        console.error("Error loading user books data:", err);
      }
    };

    fetchData();
  }, [getBorrowedBooks, getReservedBooks, getBookHistory, getFavorites]);

  if (loading || userLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Books Dashboard</h1>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{error}</div>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/my-books/borrowed"
          className="block"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                <FaBook size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Currently Borrowed</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{borrowedBooks?.length || 0} books</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/my-books/reserved"
          className="block"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mr-4">
                <FaClock size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reserved</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{reservedBooks?.length || 0} books</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/my-books/favorites"
          className="block"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mr-4">
                <FaHeart size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Favorites</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{favorites?.length || 0} books</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/my-books/borrowed"
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaBook className="mr-2" /> My Borrowed Books
          </Link>
          <Link
            to="/my-books/reserved"
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaClock className="mr-2" /> My Reserved Books
          </Link>
          <Link
            to="/my-books/favorites"
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaHeart className="mr-2" /> My Favorites
          </Link>
          <Link
            to="/my-books/history"
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaHistory className="mr-2" /> Borrowing History
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        {loadingActivity ? (
          <div className="flex justify-center py-4">
            <Spinner size="md" />
          </div>
        ) : activityError ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{activityError}</div>
        ) : recentActivity && recentActivity.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity, index) => (
              <li
                key={index}
                className="py-3"
              >
                <div className="flex items-center">
                  {activity.type === "borrowed" && <span className="inline-flex bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded mr-3">Borrowed</span>}
                  {activity.type === "returned" && <span className="inline-flex bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded mr-3">Returned</span>}
                  {activity.type === "favorite" && <span className="inline-flex bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2 py-1 rounded mr-3">Favorited</span>}
                  {activity.type === "reserved" && <span className="inline-flex bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded mr-3">Reserved</span>}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{activity.book?.title || activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString()} · {new Date(activity.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent activity found.</p>
        )}
      </div>
    </div>
  );
};

export default MyBooksPage;
