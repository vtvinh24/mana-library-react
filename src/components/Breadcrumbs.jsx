import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map of path segments to friendly names
  const pathMap = {
    "books": "Books",
    "search": "Search",
    "my-books": "My Books",
    "borrowed": "Borrowed",
    "reserved": "Reserved",
    "favorites": "Favorites",
    "profile": "Profile",
    "notifications": "Notifications",
    "manage-books": "Manage Books",
    "transactions": "Transactions",
    "user-management": "User Management",
    "reservations": "Reservations",
    "dashboard": "Dashboard",
    "import": "Import",
    "export": "Export",
    "system-metrics": "System Metrics",
    "settings": "Settings",
    "2fa-setup": "Two-Factor Setup",
  };

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center text-sm py-3 px-4 bg-white dark:bg-gray-800 rounded-md mb-4 shadow-sm">
      <Link
        to="/"
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <FaHome className="mr-1" /> Home
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const name = pathMap[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

        return (
          <div
            key={to}
            className="flex items-center"
          >
            <FaChevronRight
              size={12}
              className="mx-2 text-gray-400"
            />
            {last ? (
              <span className="text-gray-900 dark:text-white font-medium">{name}</span>
            ) : (
              <Link
                to={to}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
