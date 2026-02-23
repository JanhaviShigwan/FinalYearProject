import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logoo.png";
import "../styles/navbar.css";

export default function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="EventSphere Logo" className="w-14 h-14 object-contain" />
          <span className="text-xl font-bold text-[#6D28D9] dark:text-purple-400 tracking-wide">
            Event<span className="text-[#0D9488]">Sphere</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex space-x-10 font-medium">

          <Link
            to="/"
            className={`relative transition duration-300 ${location.pathname === "/"
              ? "text-[#6D28D9] dark:text-purple-400"
              : "text-gray-700 dark:text-gray-300 hover:text-[#0D9488]"
              }`}
          >
            Home
            {location.pathname === "/" && (
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#FDBA74] rounded-full"></span>
            )}
          </Link>

          <Link
            to="/events"
            className={`relative transition duration-300 ${location.pathname === "/events"
              ? "text-[#6D28D9] dark:text-purple-400"
              : "text-gray-700 dark:text-gray-300 hover:text-[#0D9488]"
              }`}
          >
            Events
            {location.pathname === "/events" && (
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#FDBA74] rounded-full"></span>
            )}
          </Link>

          <Link
            to="/categories"
            className={`relative transition duration-300 ${location.pathname === "/categories"
              ? "text-[#6D28D9] dark:text-purple-400"
              : "text-gray-700 dark:text-gray-300 hover:text-[#0D9488]"
              }`}
          >
            Categories
            {location.pathname === "/categories" && (
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#FDBA74] rounded-full"></span>
            )}
          </Link>

          <Link
            to="/about"
            className={`relative transition duration-300 ${location.pathname === "/about"
              ? "text-[#6D28D9] dark:text-purple-400"
              : "text-gray-700 dark:text-gray-300 hover:text-[#0D9488]"
              }`}
          >
            About
            {location.pathname === "/about" && (
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#FDBA74] rounded-full"></span>
            )}
          </Link>
          <Link
            to="/faq"
            className={`relative transition duration-300 ${location.pathname === "/faq"
              ? "text-[#6D28D9] dark:text-purple-400"
              : "text-gray-700 dark:text-gray-300 hover:text-[#0D9488]"
              }`}
          >
            FAQ
            {location.pathname === "/faq" && (
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#FDBA74] rounded-full"></span>
            )}
          </Link>

        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-[#F3F4F6] dark:bg-gray-800 hover:bg-[#FDBA74]/30 transition"
          >
            {darkMode ? (
              <Sun size={18} className="text-[#FDBA74]" />
            ) : (
              <Moon size={18} className="text-[#6D28D9]" />
            )}
          </button>

          {/* Login */}
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-[#0D9488] transition"
          >
            Log in
          </Link>

          {/* Register Button */}
          <Link to="/register" className="nav-register-btn">
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}