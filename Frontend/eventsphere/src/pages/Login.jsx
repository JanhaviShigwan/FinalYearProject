import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
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

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <Navbar />

      <div className="login-wrapper">

        {/* Floating Background Blobs */}
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
          <p className="login-subtitle">
            Login to manage and explore events
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-box">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div
                  className="cursor-pointer ml-2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Remember me
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