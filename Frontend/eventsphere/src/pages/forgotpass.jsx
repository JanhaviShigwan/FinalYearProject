import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/forgot.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!emailRegex.test(email)) {
      setError("Email must be a valid @somaiya.edu address.");
      return;
    }

    // Later connect backend API here
    setMessage("Password reset link has been sent to your email.");
    console.log("Reset link sent to:", email);
  };

  return (
    <>
      <Navbar />

      <div className="forgot-wrapper">
        <div className="forgot-blob blob-1"></div>
        <div className="forgot-blob blob-2"></div>
        <div className="forgot-blob blob-3"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="forgot-card"
        >
          <h2 className="forgot-title">Forgot Password 🔐</h2>
          <p className="forgot-subtitle">
            Enter your Somaiya email to receive reset instructions
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          {message && (
            <p className="text-green-500 text-sm text-center mb-3">
              {message}
            </p>
          )}

          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-box">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="forgot-btn">
              Send Reset Link
            </button>

            <p className="back-login-text">
              Remember your password?
              <Link to="/login"> Login</Link>
            </p>
          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}