import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import logo from "../assets/EventSphere.png";

export default function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <nav className="navbar-container">
      <div className="navbar-wrapper">

        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="CampusVibe Logo" className="logo-image" />
          <span className="brand-name">
            Event<span className="brand-highlight">Sphere</span>
          </span>
        </div>

        {/* Center Links */}
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Events</a>
          <a href="#">Categories</a>
          <a href="#">About</a>
        </div>

        {/* Right Section */}
        <div className="nav-actions">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a href="#" className="login-text">Log in</a>

          <button className="register-btn">
            Register
          </button>
        </div>

      </div>
    </nav>
  );
}