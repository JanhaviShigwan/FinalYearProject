import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarCheck,
  Users,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(formData.email)) {
      setError("Only @somaiya.edu emails are allowed.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    console.log("Login Success:", formData);
  };

  return (
    <>
      <Navbar />

      <div className="auth-wrapper">

        {/* BLOBS */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

         {/* NEW GRID */}
        <div className="animated-grid"></div>

        <div className="auth-main-card">

          {/* LEFT SIDE - LOGIN */}
          <div className="auth-left">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="auth-form-card"
            >
              <h2 className="auth-title">Sign In</h2>

              {error && (
                <p className="auth-error">{error}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="input-box">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Somaiya Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-box">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <div className="login-options">
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="auth-btn">
                  Sign In
                </button>

                <p className="register-text">
                  Don’t have an account?
                  <Link to="/register"> Register</Link>
                </p>

              </form>
            </motion.div>
          </div>

          {/* RIGHT SIDE - IMAGE */}
          <div className="auth-right">
            <div className="auth-overlay"></div>

            <div className="auth-image-content">
              <h1 className="hero-title">
                EventSphere Platform
              </h1>

              <p className="hero-subtitle">
                A smarter way to manage and experience college events.
              </p>

              <div className="auth-features">
                <div className="feature-item">
                  <CalendarCheck size={22} />
                  <span>Plan & Schedule Events</span>
                </div>

                <div className="feature-item">
                  <Users size={22} />
                  <span>Manage Participants</span>
                </div>

                <div className="feature-item">
                  <Ticket size={22} />
                  <span>Digital Ticketing System</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}