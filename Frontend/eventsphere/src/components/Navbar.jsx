import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logoo.png";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <nav className="navbar-main">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="EventSphere Logo" className="logo-image" />
          <span className="brand-text">
            Event<span className="brand-accent">Sphere</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ? "nav-active" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">

          {/* Desktop Auth */}
          <div className="auth-desktop">
            <Link to="/login" className="nav-login-btn">
              Log in
            </Link>
            <Link to="/register" className="nav-register-btn">
              Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "mobile-open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={`mobile-link ${
              location.pathname === link.path ? "mobile-active" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}

        <div className="mobile-auth">
          <Link to="/login" onClick={() => setIsOpen(false)}>
            Log in
          </Link>
          <Link to="/register" onClick={() => setIsOpen(false)}>
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}