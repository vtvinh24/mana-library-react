import { FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center text-center justify-center p-4 dark:bg-gray-800 dark:text-white bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white">
      Made with{" "}
      <a
        href="https://reactjs.org/"
        target="_blank"
        rel="noreferrer"
      >
        <FaReact className="text-2xl mx-4 cursor-pointer animate-spin" />{" "}
      </a>
      and{" "}
      <a
        href="https://tailwindcss.com/"
        target="_blank"
        rel="noreferrer"
      >
        <SiTailwindcss className="text-2xl mx-4 cursor-pointer" />
      </a>
    </div>
  );
};

export default Footer;
