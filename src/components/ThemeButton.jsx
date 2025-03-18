import { FaMoon, FaSun } from "react-icons/fa";
import PropTypes from "prop-types";

const ThemeButton = ({ dark, setDark }) => {
  const handleClick = () => {
    setDark(!dark);
  };

  return (
    <div
      onClick={handleClick}
      className="w-16 h-8 flex items-center bg-gray-800 dark:bg-gray-200 rounded-full p-1 cursor-pointer transition-colors duration-300"
    >
      <div className={`w-6 h-6 bg-white dark:bg-gray-400 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${dark ? "translate-x-8" : ""}`}>
        {dark ? <FaMoon className="transition-colors duration-300" /> : <FaSun className="transition-colors duration-300" />}
      </div>
    </div>
  );
};

ThemeButton.propTypes = {
  dark: PropTypes.bool.isRequired,
  setDark: PropTypes.func.isRequired,
};

export default ThemeButton;
