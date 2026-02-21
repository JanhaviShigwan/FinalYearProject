import { Mail, Phone, MapPin, Github, Linkedin, Instagram } from "lucide-react";
import logo from "../assets/logoo.png"; 

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">

        {/* Left */}
        <div className="footer-about">
          <div className="footer-logo">
             <img src={logo} alt="CampusVibe Logo" className="footer-logo-image" />
            <span className="brand-name">
              Event<span className="brand-highlight">Sphere</span>
            </span>
          </div>

          <p>
            The premier platform for discovering and managing college events.
            Connect, collaborate, and celebrate.
          </p>
        </div>

        {/* Middle */}
        <div className="footer-links">
          <h4>QUICK LINKS</h4>
          <a href="#">Home</a>
          <a href="#">Events</a>
          <a href="#">Categories</a>
          <a href="#">About</a>
        </div>

        {/* Right */}
        <div className="footer-contact">
          <h4>CONTACT US</h4>

          <div className="footer-contact-item">
            <Mail size={18} />
            <span>hello@campusvibe.com</span>
          </div>

          <div className="footer-contact-item">
            <Phone size={18} />
            <span>+1 (555) 123-4567</span>
          </div>

          <div className="footer-contact-item">
            <MapPin size={18} />
            <span>San Francisco, CA</span>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 CampusVibe. All rights reserved.</p>

        <div className="footer-socials">
          <Github size={20} />
          <Linkedin size={20} />
          <Instagram size={20} />
        </div>
      </div>
    </footer>
  );
}