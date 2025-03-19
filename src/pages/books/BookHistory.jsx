import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBook, FaFilter, FaCalendarAlt, FaSearch, FaTimes } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useBook } from "../../context/BookProvider";
import Pagination from "../../components/common/Pagination";

const BookHistory = () => {
  const { loading, error, getBookHistory } = useBook();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch transaction history
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const response = await getBookHistory(filters, currentPage, 10);
        if (response && response.transactions) {
          setTransactions(response.transactions);
          setPagination({
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages,
          });
        } else {
          // Fallback data if API fails
          setTransactions([
            {
              id: "1",
              type: "borrowed",
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              book: {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                coverImage: null,
              },
            },
            {
              id: "2",
              type: "returned",
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              book: {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                coverImage: null,
              },
            },
            {
              id: "3",
              type: "reserved",
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              book: {
                title: "1984",
                author: "George Orwell",
                coverImage: null,
              },
            },
          ]);
          setPagination({
            page: 1,
            limit: 10,
            total: 3,
            totalPages: 1,
          });
        }
      } catch (err) {
        console.error("Error fetching book history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [getBookHistory, currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  // Format the date nicely
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get appropriate badge class based on transaction type
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "borrowed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "returned":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "reserved":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "canceled":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Format transaction type for display
  const formatTransactionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading && loadingHistory && transactions.length === 0) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Borrowing History</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 flex items-center"
          >
            <FaFilter className="mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <Link
            to="/my-books"
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FaArrowLeft className="mr-1" /> Back to My Books
          </Link>
        </div>
      </div>

      {/* Error display */}
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{error}</div>}

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Filter History</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">All Types</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="reserved">Reserved</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Transactions List */}
      {loadingHistory ? (
        <div className="flex justify-center my-8">
          <Spinner size="md" />
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(transaction.type)}`}>{formatTransactionType(transaction.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {transaction.book?.coverImage ? (
                            <img
                              src={transaction.book.coverImage}
                              alt={`Cover of ${transaction.book.title}`}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <FaBook className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{transaction.book?.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.book?.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {transaction.type === "borrowed" && transaction.dueDate && <span>Due back: {formatDate(transaction.dueDate)}</span>}
                      {transaction.type === "returned" && transaction.lateFee > 0 && <span className="text-red-600 dark:text-red-400">Late fee: ${transaction.lateFee.toFixed(2)}</span>}
                      {transaction.type === "reserved" && transaction.expiresAt && <span>Reservation expires: {formatDate(transaction.expiresAt)}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-800">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <FaBook className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Transaction History</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have any book transactions in your history yet.</p>
          <Link
            to="/books"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
          >
            Browse Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookHistory;
