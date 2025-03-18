import { NavLink } from "react-router-dom";
import { FaBook, FaUser, FaExchangeAlt, FaChartBar, FaCog, FaSearch, FaBookmark, FaHeart, FaBell, FaUserCircle, FaFileImport, FaFileExport, FaClipboardList, FaHistory } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";

// const Sidebar = ({ role: propRole }) => {
const Sidebar = ({ isOpen }) => {
  // Get user role from auth context if not provided as prop
  const { user } = useAuth();
  // const role = propRole || user?.auth?.role || "user";
  const role = "admin";

  if (!isOpen) {
    return <aside className="w-16 bg-white dark:bg-gray-800 shadow-lg p-2 h-full transition-all duration-300"></aside>;
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 h-full transition-all duration-300 overflow-y-auto">
      <nav className="space-y-2">
        {/* Common links for all users */}
        <div className="sidebar-heading">Books</div>
        <NavLink
          to="/books"
          end
          className="sidebar-link"
        >
          <FaBook className="mr-2" /> Browse Books
        </NavLink>

        {/* User specific links */}
        <div className="sidebar-heading">My Library</div>
        <NavLink
          to="/my-books"
          end
          className="sidebar-link"
        >
          <FaBook className="mr-2" /> My Books
        </NavLink>
        <NavLink
          to="/my-books/borrowed"
          className="sidebar-link"
        >
          <FaBook className="mr-2" /> Borrowed Books
        </NavLink>
        <NavLink
          to="/my-books/reserved"
          className="sidebar-link"
        >
          <FaBookmark className="mr-2" /> Reserved Books
        </NavLink>
        <NavLink
          to="/my-books/favorites"
          className="sidebar-link"
        >
          <FaHeart className="mr-2" /> Favorites
        </NavLink>
        <NavLink
          to="/my-books/history"
          className="sidebar-link"
        >
          <FaHistory className="mr-2" /> History
        </NavLink>

        {/* User profile links */}
        <div className="sidebar-heading">Account</div>
        <NavLink
          to="/profile"
          className="sidebar-link"
        >
          <FaUserCircle className="mr-2" /> Profile
        </NavLink>
        <NavLink
          to="/notifications"
          className="sidebar-link"
        >
          <FaBell className="mr-2" /> Notifications
        </NavLink>

        {/* Librarian links */}
        {(role === "librarian" || role === "admin") && (
          <>
            <div className="sidebar-heading">Librarian</div>
            <NavLink
              to="/manage-books"
              className="sidebar-link"
            >
              <FaBook className="mr-2" /> Manage Books
            </NavLink>
            <NavLink
              to="/transactions"
              className="sidebar-link"
            >
              <FaExchangeAlt className="mr-2" /> Transactions
            </NavLink>
            <NavLink
              to="/user-management"
              className="sidebar-link"
            >
              <FaUser className="mr-2" /> Users
            </NavLink>
            <NavLink
              to="/reservations"
              className="sidebar-link"
            >
              <FaBookmark className="mr-2" /> Reservations
            </NavLink>
          </>
        )}

        {/* Admin links */}
        {role === "admin" && (
          <>
            <div className="sidebar-heading">Admin</div>
            <NavLink
              to="/dashboard"
              className="sidebar-link"
            >
              <FaChartBar className="mr-2" /> Dashboard
            </NavLink>
            <NavLink
              to="/books/import"
              className="sidebar-link"
            >
              <FaFileImport className="mr-2" /> Import Books
            </NavLink>
            <NavLink
              to="/books/export"
              className="sidebar-link"
            >
              <FaFileExport className="mr-2" /> Export Books
            </NavLink>
            <NavLink
              to="/system-metrics"
              className="sidebar-link"
            >
              <FaClipboardList className="mr-2" /> System Metrics
            </NavLink>
            <NavLink
              to="/settings"
              className="sidebar-link"
            >
              <FaCog className="mr-2" /> Settings
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
