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
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  // ✅ Somaiya email restriction
  const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  // ✅ Password rules
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(formData.email)) {
      setError("Email must be a valid @somaiya.edu address.");
      return;
    }

    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      setError("Password does not meet required criteria.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Register Success:", formData);
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
          className="register-card"
        >
          <h2 className="register-title">Create Account 🎓</h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-box">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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

              {formData.email && (
                <p
                  className={`text-sm mt-1 ${
                    emailRegex.test(formData.email)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {emailRegex.test(formData.email)
                    ? "Valid Somaiya email ✔"
                    : "Email must end with @somaiya.edu"}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-box">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div
                  className="cursor-pointer ml-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Checklist */}
              <div className="mt-3 space-y-1 text-sm">
                {Object.entries(passwordValidation).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-2 ${
                      value ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {value ? <Check size={16} /> : <X size={16} />}
                    {key === "minLength" && "Minimum 8 characters"}
                    {key === "upperCase" && "At least 1 uppercase letter"}
                    {key === "lowerCase" && "At least 1 lowercase letter"}
                    {key === "number" && "At least 1 number"}
                    {key === "specialChar" && "At least 1 special character"}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-box">
                <Lock size={18} className="input-icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div
                  className="cursor-pointer ml-2"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {formData.confirmPassword && (
                <p
                  className={`text-sm mt-1 ${
                    formData.password === formData.confirmPassword
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "Passwords match ✔"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>

            <p className="register-text">
              Already have an account?
              <Link to="/login"> Login</Link>
            </p>
          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}