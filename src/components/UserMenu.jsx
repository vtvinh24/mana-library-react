import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import ThemeButton from "./ThemeButton";
import { useTheme } from "../hooks/useTheme";

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { dark, setDark } = useTheme();
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
        <span>{user?.identifier?.username || "User"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-700 dark:text-gray-300">{user?.fullName || "Signed in user"}</p>
            {user?.email && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>}
            {user?.phone && <p className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</p>}
          </div>
          <div className="py-1">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{dark ? "Dark Mode" : "Light Mode"}</span>
              <ThemeButton
                dark={dark}
                setDark={setDark}
              />
            </div>
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
