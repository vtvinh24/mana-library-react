import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="relative">
      <button
        className="flex items-center px-3 py-1 rounded-md text-white bg-gradient-to-r from-[#a000c3] to-[#004bc2] hover:shadow-md transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user?.profile?.avatar ? (
          <img
            src={user.profile.avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
        ) : (
          <FaUser className="text-lg mr-2" />
        )}
        <span>{user?.profile?.firstName || "User"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{user?.email || "Signed in user"}</p>
          </div>
          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FaUser className="mr-3 text-gray-500 dark:text-gray-400" /> Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FaCog className="mr-3 text-gray-500 dark:text-gray-400" /> Settings
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={logout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
