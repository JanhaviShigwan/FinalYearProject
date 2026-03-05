import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/EventSphereLogo.png";
import "../styles/navbar.css";

export default function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState(null);

  // ✅ Check login status whenever route changes
  useEffect(() => {
    const storedStudent = localStorage.getItem("eventSphereStudent");
    setStudent(storedStudent ? JSON.parse(storedStudent) : null);
  }, [location.pathname]);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("eventSphereStudent");

    setStudent(null);
    setIsOpen(false);

    navigate("/", { replace: true });
  };

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
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
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
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            >
              {link.name}
            </Link>
          ))}

        </div>

        {/* Right Section */}
        <div className="navbar-actions">

          {/* Desktop Auth */}
          <div className="auth-desktop">

            {!student ? (
              <>
                <Link
                  to="/login"
                  className="nav-login-btn"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="nav-register-btn"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="nav-login-btn"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="nav-register-btn"
                >
                  Logout
                </button>
              </>
            )}

          </div>

          {/* Mobile Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => {
              setIsOpen(!isOpen);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
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
            className={`mobile-link ${
              location.pathname === link.path ? "mobile-active" : ""
            }`}
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {link.name}
          </Link>
        ))}

        <div className="mobile-auth">

          {!student ? (
            <>
              <Link
                to="/login"
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="mobile-logout-btn"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}