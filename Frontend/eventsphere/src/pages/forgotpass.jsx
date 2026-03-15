import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_URL from "../api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(300);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  // timer for OTP
  useEffect(() => {
    if (step !== 2) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (timer <= 0) {
      setError("OTP expired");
    }
  }, [timer]);

  // ================= SEND OTP =================

  const sendOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!emailRegex.test(email)) {
      setError(
        "Email must be a valid @somaiya.edu address"
      );
      return;
    }

    try {
      await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
      );

      setStep(2);
      setTimer(300);

      setMessage("OTP sent to email");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Error sending OTP"
      );
    }
  };

  // ================= VERIFY OTP =================

  const verifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      await axios.post(
        `${API_URL}/auth/verify-otp`,
        { email, otp }
      );

      setStep(3);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid OTP"
      );
    }
  };

  // ================= RESET PASSWORD =================

  const resetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          email,
          otp,
          newPassword: password,
        }
      );

      setMessage("Password updated");
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Error resetting password"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="forgot-wrapper relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-10 bg-[#F6F1EB]">

        {/* blobs */}
        <div className="absolute rounded-full blur-3xl opacity-25 w-64 h-64 bg-[#9B96E5] top-[-30px] left-[-30px]" />
        <div className="absolute rounded-full blur-3xl opacity-25 w-64 h-64 bg-[#F08A6C] bottom-[-30px] right-[-30px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-xl bg-white"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-[#3F3D56]">
            Forgot Password
            <Lock size={25} className="inline-block ml-2 text-[#9B96E5]" />
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-2">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-500 text-center mb-2">
              {message}
            </p>
          )}

          {/* ================= STEP 1 EMAIL ================= */}

          {step === 1 && (
            <form onSubmit={sendOTP}>
              <label>Email</label>

              <div className="flex items-center border rounded-lg px-3 py-2  mb-4">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full ml-2  outline-none"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <button className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-[#9B96E5] to-[#F08A6C]">
                Send OTP
              </button>
            </form>
          )}

          {/* ================= STEP 2 OTP ================= */}

          {step === 2 && (
            <form onSubmit={verifyOTP}>
              <label>Enter OTP</label>

              <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
                <KeyRound size={18} />
                <input
                  type="text"
                  className="w-full ml-2 outline-none"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                />
              </div>

              <p className="text-sm text-center mb-2">
                Time left: {timer}s
              </p>

              <button className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-[#9B96E5] to-[#F08A6C]">
                Verify OTP
              </button>
            </form>
          )}

          {/* ================= STEP 3 PASSWORD ================= */}

          {step === 3 && (
            <form onSubmit={resetPassword}>
              <label>New Password</label>

              <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
                <Lock size={18} />

                <input
                  type={showPass ? "text" : "password"}
                  className="w-full ml-2 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {showPass ? (
                  <EyeOff onClick={() => setShowPass(false)} />
                ) : (
                  <Eye onClick={() => setShowPass(true)} />
                )}
              </div>

              <label>Confirm Password</label>

              <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
                <Lock size={18} />

                <input
                  type={showConfirmPass ? "text" : "password"}
                  className="w-full ml-2 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {showConfirmPass ? (
                  <EyeOff onClick={() => setShowConfirmPass(false)} />
                ) : (
                  <Eye onClick={() => setShowConfirmPass(true)} />
                )}
              </div>

              <button className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-[#9B96E5] to-[#F08A6C]">
                Reset Password
              </button>
            </form>
          )}

          <p className="text-center mt-5">
            <Link to="/login">
              Back to Login
            </Link>
          </p>
        </motion.div>
      </div>

      <Footer />
    </>
  );
} 