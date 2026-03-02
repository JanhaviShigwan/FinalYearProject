import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  CalendarCheck,
  Users,
  Ticket,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://eventsphere-8sgd.onrender.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  const passwordRules = {
    minLength: /.{8,}/,
    upperCase: /[A-Z]/,
    lowerCase: /[a-z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const validatePassword = (password) => ({
    minLength: passwordRules.minLength.test(password),
    upperCase: passwordRules.upperCase.test(password),
    lowerCase: passwordRules.lowerCase.test(password),
    number: passwordRules.number.test(password),
    specialChar: passwordRules.specialChar.test(password),
  });

  const passwordValidation = validatePassword(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    // Email validation
    if (!emailRegex.test(formData.email)) {
      setError("Email must be a valid @somaiya.edu address.");
      return;
    }

    // Password validation
    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      setError("Password does not meet required criteria.");
      return;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Save token securely
      setSuccess(
        `Registration successful! Your Student ID: ${res.data.student.studentId}`
      );

      setSuccess(
        `Registration successful! Your Student ID: ${res.data.student.studentId}`
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect manually if needed
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Register error:", err);

      if (err.response) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Server not responding. Is backend running?");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-wrapper">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="animated-grid"></div>

        <div className="auth-main-card">
          {/* LEFT SIDE */}
          <div className="auth-image-left">
            <div className="auth-overlay"></div>
            <div className="auth-image-content">
              <h1 className="hero-title">
                Why Register for EventSphere?
              </h1>

              <p className="hero-subtitle">
                Unlock exclusive access to college events and competitions.
              </p>

              <div className="auth-features">
                <div className="feature-item">
                  <CalendarCheck size={22} />
                  <span>Early Access to Events</span>
                </div>

                <div className="feature-item">
                  <Users size={22} />
                  <span>Connect with Students</span>
                </div>

                <div className="feature-item">
                  <Ticket size={22} />
                  <span>Instant Digital Tickets</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="auth-form-right">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="auth-form-card"
            >
              <h2 className="auth-title">Create Account</h2>

              {error && <p className="auth-error">{error}</p>}
              {success && <p className="auth-success">{success}</p>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="input-box">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-box">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Somaiya Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    required
                  />
                  <div onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  {Object.entries(passwordValidation).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 ${value ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {value ? <Check size={14} /> : <X size={14} />}
                      {key === "minLength" && "Minimum 8 characters"}
                      {key === "upperCase" && "Uppercase letter"}
                      {key === "lowerCase" && "Lowercase letter"}
                      {key === "number" && "Number"}
                      {key === "specialChar" && "Special character"}
                    </div>
                  ))}
                </div>

                <div className="input-box">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <div onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>

                <p className="register-text">
                  Already have an account?
                  <Link to="/login"> Login</Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}