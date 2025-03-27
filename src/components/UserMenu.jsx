import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useUser } from "../context/UserProvider";
import { FaUser, FaSignOutAlt, FaCog, FaSignInAlt, FaBars } from "react-icons/fa";
import ThemeButton from "./ThemeButton";
import { useTheme } from "../hooks/useTheme";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dark, setDark } = useTheme();
  const { logout } = useAuth();
  const { user, loading } = useUser();

  // Close menu when clicked outside
  const handleClose = () => setIsOpen(false);

  // Use useEffect to add event listener for closing menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (e) => {
        if (!e.target.closest(".user-menu-container")) {
          setIsOpen(false);
        }
      };

      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [isOpen]);

  // For debugging - log the user object structure
  useEffect(() => {
    console.log("Current user in UserMenu:", user);
  }, [user]);

  if (loading) {
    return <Spinner size="sm" />;
  }

  // Helper function to safely get display name
  const getDisplayName = () => {
    if (!user) return null;

    if (user.profile?.firstName) {
      return user.profile.firstName;
    } else if (user.auth?.email) {
      return user.auth.email.split("@")[0];
    } else if (typeof user === "object") {
      // Fallback if the structure is different
      const email = user.email || user.auth?.email;
      if (email) return email.split("@")[0];

      const name = user.firstName || user.profile?.firstName || user.name;
      if (name) return name;
    }

    return "User";
  };

  const displayName = getDisplayName();
  const isAuthenticated = !!user;

  return (
    <div className="relative user-menu-container">
      <button
        className="flex items-center px-3 py-1 rounded-md text-white bg-gradient-to-r from-[#a000c3] to-[#004bc2] hover:shadow-md transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isAuthenticated ? (
          <>
            {user.profile?.avatar ? (
              <img
                src={user.profile.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <FaUser className="text-lg mr-2" />
            )}
            <span>{displayName}</span>
          </>
        ) : (
          <>
            <FaBars className="text-lg mr-2" />
            <span>Menu</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
          {isAuthenticated ? (
            <>
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  {user.profile?.firstName || ""} {user.profile?.lastName || ""}
                </p>
                {(user.auth?.email || user.email) && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.auth?.email || user.email}</p>}
                <div className="mt-1">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {((user.role || user.userRole || "USER") + "").charAt(0) + ((user.role || user.userRole || "USER") + "").slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors duration-150"
                  onClick={handleClose}
                >
                  <FaCog className="mr-3" /> Profile Settings
                </Link>

                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{dark ? "Dark Mode" : "Light Mode"}</span>
                  <ThemeButton
                    dark={dark}
                    setDark={setDark}
                  />
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    logout();
                    handleClose();
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                >
                  <FaSignOutAlt className="mr-3" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                to="/login"
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors duration-150"
                onClick={handleClose}
              >
                <FaSignInAlt className="mr-3" /> Login
              </Link>

              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{dark ? "Dark Mode" : "Light Mode"}</span>
                <ThemeButton
                  dark={dark}
                  setDark={setDark}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
