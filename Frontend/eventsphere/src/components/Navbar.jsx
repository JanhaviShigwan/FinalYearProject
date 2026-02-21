import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-primary dark:text-white">
          EventHub
        </h1>

        <div className="flex gap-6 items-center">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Events</a>
          <a href="#" className="nav-link">Categories</a>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}