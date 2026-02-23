import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");

  // Somaiya email restriction
  const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

    /*
      Later when backend added:
      - If remember = true → store token in localStorage
      - Else → store in sessionStorage
    */
  };

  return (
    <>
      <Navbar />

      <div className="login-wrapper">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="login-card"
        >
          <h2 className="login-title">Welcome Back 👋</h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-box">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-box">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Remember Me
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="register-text">
              Don’t have an account?
              <Link to="/register"> Register</Link>
            </p>
          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}