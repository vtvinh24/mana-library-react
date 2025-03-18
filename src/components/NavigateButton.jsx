import PropTypes from "prop-types";

const NavigateButton = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`dark:bg-gray-800 dark:border-white border dark:text-white dark:hover:bg-gray-700 bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

NavigateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default NavigateButton;
