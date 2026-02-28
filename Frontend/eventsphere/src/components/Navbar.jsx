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
        <Link to="/" className="navbar-logo" onClick={()=>{window.scrollTo({ top:0,behavior:"smooth" })}}>
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
              }`} onClick={()=>{window.scrollTo({ top:0,behavior:"smooth" })}}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">

          {/* Desktop Auth */}
          <div className="auth-desktop">
            <Link to="/login" className="nav-login-btn" onClick={()=>{window.scrollTo({ top:0,behavior:"smooth" })}}>
              Log in
            </Link>
            <Link to="/register" className="nav-register-btn" onClick={()=>{window.scrollTo({ top:0,behavior:"smooth" })}}>
              Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() =>{ setIsOpen(!isOpen); window.scrollTo({ top:0,behavior:"smooth" })}}
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
            onClick={() =>{ setIsOpen(false); window.scrollTo({ top:0,behavior:"smooth" })}}
            className={`mobile-link ${
              location.pathname === link.path ? "mobile-active" : ""
            }`} 
          >
            {link.name}
          </Link>
        ))}

        <div className="mobile-auth">
          <Link to="/login" onClick={() =>{ setIsOpen(false); window.scrollTo({ top:0,behavior:"smooth" })}}>
            Log in
          </Link>
          <Link to="/register" onClick={() =>{ setIsOpen(false); window.scrollTo({ top:0,behavior:"smooth" })}}>
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}