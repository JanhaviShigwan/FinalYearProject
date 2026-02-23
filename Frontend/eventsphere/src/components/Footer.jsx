import { Mail, Phone, MapPin, Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logoo.png";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">

        {/* LEFT SECTION */}
        <div className="footer-about">

          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="EventSphere Logo"
              className="footer-logo-image"
            />
            <span className="brand-name">
              Event<span className="brand-highlight">Sphere</span>
            </span>
          </div>

          <p>
            The premier platform for discovering and managing college events.
            Connect, collaborate, and celebrate.
          </p>
        </div>

        {/* MIDDLE SECTION */}
        <div className="footer-links">
          <h4>QUICK LINKS</h4>

          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
        </div>

        {/* RIGHT SECTION */}
        <div className="footer-contact">
          <h4>CONTACT US</h4>

          <div className="footer-contact-item">
            <Mail size={18} />
            <a href="mailto:eventsphere@gmail.com">
              eventsphere@gmail.com
            </a>
          </div>

          <div className="footer-contact-item">
            <MapPin size={18} />
            <span>Mumbai, India</span>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="footer-bottom">
        <p>© 2026 EventSphere. All rights reserved.</p>

        <div className="footer-socials">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>

          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}