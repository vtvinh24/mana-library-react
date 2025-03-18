import { Link } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { FaBars } from "react-icons/fa";

const Header = ({ user, toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none mr-4"
          aria-label="Toggle sidebar"
        >
          <FaBars size={20} />
        </button>
        <Link
          to="/"
          className="text-2xl font-bold"
        >
          Mana Library
        </Link>
      </div>
      <UserMenu user={user} />
    </header>
  );
};

export default Header;
