import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import ThemeButton from "../components/ThemeButton";

const Nav = ({ dark, setDark }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const formattedPath =
    pathSegments.length === 0
      ? [{ name: "Home (You are here!)", path: "/" }]
      : pathSegments.map((segment, index) => {
          if (index === 0) return { name: "Home", path: "/" };
          if (segment.startsWith("day")) return { name: `Day ${segment.replace("day", "")}`, path: `/day/${segment.replace("day", "")}` };
          if (segment.startsWith("assignment")) return { name: `Assignment ${segment.replace("assignment", "")}`, path: `/day/${pathSegments[1]}/assignment/${segment.replace("assignment", "")}` };
          return { name: segment, path: `/${pathSegments.slice(0, index + 1).join("/")}` };
        });

  return (
    <div className="flex justify-between items-center p-4 dark:bg-gray-800 bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white">
      <div className="text-lg">
        {formattedPath.map((segment, index) => (
          <span key={index}>
            <Link
              to={segment.path}
              className="transition-colors duration-300 dark:text-white dark:hover:text-gray-400 text-white hover:text-gray-200"
            >
              {index == 1 && "Day "} {index == 2 && "Assignment #"}
              {segment.name}
            </Link>
            {index < formattedPath.length - 1 && "  /  "}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        <ThemeButton
          dark={dark}
          setDark={setDark}
        />
      </div>
    </div>
  );
};

Nav.propTypes = {
  dark: PropTypes.bool.isRequired,
  setDark: PropTypes.func.isRequired,
};

export default Nav;
