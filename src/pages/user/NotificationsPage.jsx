import { useState, useEffect } from "react";
import { FaBell, FaCheck, FaCheckDouble, FaTrash, FaSort } from "react-icons/fa";
import Breadcrumbs from "../../components/Breadcrumbs";
import Spinner from "../../components/Spinner";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call in real implementation
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        const mockNotifications = [
          {
            _id: "1",
            message: "Your reserved book 'The Design of Everyday Things' is now available for pickup.",
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            type: "reservation",
          },
          {
            _id: "2",
            message: "You have a book due tomorrow: 'Clean Code'",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            read: false,
            type: "due-date",
          },
          {
            _id: "3",
            message: "Your book 'Design Patterns' is now overdue. Please return it as soon as possible.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            read: true,
            type: "overdue",
          },
          {
            _id: "4",
            message: "New book recommendations based on your reading preferences are available.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
            read: true,
            type: "recommendation",
          },
          {
            _id: "5",
            message: "Your account was successfully updated.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
            read: true,
            type: "account",
          },
        ];

        setNotifications(mockNotifications);
        setLoading(false);
      } catch (err) {
        setError("Failed to load notifications");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    // In a real app, this would call an API
    setNotifications(notifications.map((notif) => (notif._id === id ? { ...notif, read: true } : notif)));
  };

  const handleMarkAllAsRead = async () => {
    // In a real app, this would call an API
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const handleDelete = async (id) => {
    // In a real app, this would call an API
    setNotifications(notifications.filter((notif) => notif._id !== id));
  };

  const handleClearAll = async () => {
    // In a real app, this would call an API
    setNotifications([]);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleToggleSort = () => {
    setSortNewest(!sortNewest);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const sortOrder = sortNewest ? -1 : 1;
    return sortOrder * (new Date(a.createdAt) - new Date(b.createdAt));
  });

  const getNotificationTypeStyles = (type) => {
    switch (type) {
      case "due-date":
        return "border-yellow-500 dark:border-yellow-600";
      case "overdue":
        return "border-red-500 dark:border-red-600";
      case "reservation":
        return "border-green-500 dark:border-green-600";
      case "recommendation":
        return "border-blue-500 dark:border-blue-600";
      default:
        return "border-gray-300 dark:border-gray-600";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <FaBell className="mr-2" /> Notifications
        {unreadCount > 0 && <span className="ml-3 bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white text-sm px-2.5 py-0.5 rounded-full">{unreadCount}</span>}
      </h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">{error}</div>}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex flex-wrap justify-between items-center">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "all" ? "bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("unread")}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "unread" ? "bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => handleFilterChange("read")}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "read" ? "bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Read
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleToggleSort}
              className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm"
            >
              <FaSort className="mr-1" />
              {sortNewest ? "Newest" : "Oldest"}
            </button>
            <button
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some((n) => !n.read)}
              className={`px-3 py-1 rounded-md text-sm ${
                notifications.some((n) => !n.read) ? "bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaCheckDouble className="inline mr-1" /> Mark all read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Spinner />
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {filter === "all" ? "You don't have any notifications" : filter === "unread" ? "You don't have any unread notifications" : "You don't have any read notifications"}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedNotifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors border-l-4 ${getNotificationTypeStyles(notification.type)} ${
                  !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-sm text-[#a000c3] dark:text-[#a164d1] hover:text-[#7a009a] dark:hover:text-[#c590eb]"
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-sm text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {notifications.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
            <button
              onClick={handleClearAll}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md text-sm"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
