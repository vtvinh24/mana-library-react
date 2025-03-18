// src/components/UserMenu.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="relative">
      <button
        className="flex items-center"
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
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
          <div className="py-1">
            <a
              href="/profile"
              className="menu-item"
            >
              <FaUser className="mr-2" /> Profile
            </a>
            <a
              href="/settings"
              className="menu-item"
            >
              <FaCog className="mr-2" /> Settings
            </a>
            <button
              onClick={logout}
              className="menu-item text-red-600 dark:text-red-400"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
