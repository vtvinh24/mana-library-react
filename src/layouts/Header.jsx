import { Link } from "react-router-dom";
import ThemeButton from "../components/ThemeButton";
import UserMenu from "../components/UserMenu";
import { FaBars } from "react-icons/fa";

const Header = ({ user, toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center">
      <button
        onClick={toggleSidebar}
        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <FaBars size={20} />
      </button>
      <div className="container ml-4 mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold"
        >
          Mana Library
        </Link>
        <UserMenu user={user} />
      </div>
    </header>
  );
};

export default Header;
