import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  ArrowRight,
  Clock3,
  CheckCircle2,
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
  const [submitting, setSubmitting] = useState(false);

  const [timer, setTimer] = useState(300);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  // timer for OTP
  useEffect(() => {
    if (step !== 2 || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (step === 2 && timer === 0) {
      setError("OTP expired. Please request a new OTP.");
    }
  }, [timer, step]);

  const formatTimer = (remainingSeconds) => {
    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  // ================= SEND OTP =================

  const sendOTP = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setMessage("");

    if (!emailRegex.test(email)) {
      setError(
        "Email must be a valid @somaiya.edu address"
      );
      return;
    }

    try {
      setSubmitting(true);

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
    } finally {
      setSubmitting(false);
    }
  };

  // ================= VERIFY OTP =================

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setMessage("");

    if (timer <= 0) {
      setError("OTP expired. Please request a new OTP.");
      return;
    }

    try {
      setSubmitting(true);

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
    } finally {
      setSubmitting(false);
    }
  };

  // ================= RESET PASSWORD =================

  const resetPassword = async (e) => {
    e.preventDefault();
    if (submitting) return;

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
      setSubmitting(true);

      await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          email,
          otp,
          newPassword: password,
        }
      );

      setMessage("Password updated successfully. You can sign in now.");
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
    } finally {
      setSubmitting(false);
    }
  };

  const stepMeta = {
    1: {
      title: "Forgot Password",
      subtitle: "Enter your Somaiya email and receive an OTP to continue.",
      icon: Mail,
    },
    2: {
      title: "Verify OTP",
      subtitle: "Enter the verification code sent to your email inbox.",
      icon: KeyRound,
    },
    3: {
      title: "Create New Password",
      subtitle: "Set a secure password and confirm it to finish reset.",
      icon: Lock,
    },
  };

  const ActiveIcon = stepMeta[step].icon;

  return (
    <>
      <div
        className="forgot-wrapper relative min-h-screen flex flex-col overflow-hidden px-4 pt-0 pb-12 bg-[#F6F1EB] sm:px-6"
      >
        <Navbar />

        <div className="animated-grid" />

        <div className="absolute rounded-full blur-3xl opacity-25 h-64 w-64 bg-[#9B96E5] top-[-30px] left-[-30px]" />
        <div className="absolute rounded-full blur-3xl opacity-25 h-64 w-64 bg-[#F08A6C] bottom-[-30px] right-[-30px]" />

        <div className="relative z-10 flex-1 flex items-center justify-center pt-20 pb-10">

          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[34px] border border-white/80 shadow-[0_25px_60px_rgba(51,38,82,0.18)] flex"
            style={{ minHeight: "660px" }}
          >
            <div
              className="auth-image-left-panel w-[45%] relative flex items-center justify-center overflow-hidden rounded-tl-[34px] rounded-bl-[34px]"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(145deg, rgba(155,150,229,0.78), rgba(240,138,108,0.68))",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="relative z-10 max-w-md px-8 text-center text-white"
              >
                <h2 className="text-4xl font-bold leading-tight">
                  Recover Access
                </h2>

                <p className="mt-4 leading-relaxed opacity-90">
                  Secure your account with OTP verification and reset your password in three guided steps.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Verify using your Somaiya email",
                    "OTP-based secure confirmation",
                    "Set a new password instantly",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-white/16 px-4 py-3 text-left backdrop-blur-md"
                    >
                      <CheckCircle2 size={18} className="text-[#FFE0D7]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="auth-form-panel w-[55%] px-8 py-10 flex items-center bg-white/96 rounded-tr-[34px] rounded-br-[34px] sm:px-12 lg:px-14">
              <motion.div
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
                className="w-full max-w-md mx-auto"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F1EDFF] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6C67A8]">
                  <Sparkles size={14} />
                  Account Recovery
                </span>

                <h2 className="mt-4 text-3xl font-bold text-[#2F2C44]">
                  {stepMeta[step].title}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[#6D6A84]">
                  {stepMeta[step].subtitle}
                </p>

                <div className="mt-5 flex gap-2.5">
                  {[1, 2, 3].map((stepIndex) => (
                    <span
                      key={stepIndex}
                      className={`h-2.5 rounded-full transition-all duration-300 ${step >= stepIndex ? "w-8 bg-[#8D88D4]" : "w-2.5 bg-[#D8D4F1]"}`}
                    />
                  ))}
                </div>

                {error && (
                  <p className="mt-5 rounded-xl border border-[#F7D4CB] bg-[#FFF2EE] px-4 py-3 text-sm font-medium text-[#CC6245]">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {message}
                  </p>
                )}

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#6C67A8]">
                  <ActiveIcon size={16} />
                  Step {step} of 3
                </div>

                {/* ================= STEP 1 EMAIL ================= */}

                {step === 1 && (
                  <form onSubmit={sendOTP} className="mt-5 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#595675]">Email</label>

                      <div className="flex items-center rounded-full border border-[#EED8D6] bg-white px-5 py-3 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#9B96E5]">
                        <Mail size={18} className="mr-3 text-[#9B96E5]" />
                        <input
                          type="email"
                          placeholder="Enter your Somaiya email"
                          className="w-full bg-transparent text-sm text-[#3F3D56] outline-none"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(155,150,229,0.28)] sm:text-base"
                      style={{ background: "linear-gradient(90deg, #9B96E5, #F08A6C)" }}
                    >
                      {submitting ? "Sending OTP..." : "Send OTP"}
                      {!submitting && <ArrowRight size={16} />}
                    </button>
                  </form>
                )}

                {/* ================= STEP 2 OTP ================= */}

                {step === 2 && (
                  <form onSubmit={verifyOTP} className="mt-5 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#595675]">Enter OTP</label>

                      <div className="flex items-center rounded-full border border-[#EED8D6] bg-white px-5 py-3 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#9B96E5]">
                        <KeyRound size={18} className="mr-3 text-[#9B96E5]" />
                        <input
                          type="text"
                          className="w-full bg-transparent text-sm text-[#3F3D56] outline-none"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F2FF] px-4 py-2 text-sm font-semibold text-[#6B67A5]">
                      <Clock3 size={15} />
                      Time left: {formatTimer(timer)}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || timer <= 0}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(155,150,229,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                      style={{ background: "linear-gradient(90deg, #9B96E5, #F08A6C)" }}
                    >
                      {submitting ? "Verifying..." : "Verify OTP"}
                      {!submitting && <ArrowRight size={16} />}
                    </button>
                  </form>
                )}

                {/* ================= STEP 3 PASSWORD ================= */}

                {step === 3 && (
                  <form onSubmit={resetPassword} className="mt-5 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#595675]">New Password</label>

                      <div className="flex items-center rounded-full border border-[#EED8D6] bg-white px-5 py-3 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#9B96E5]">
                        <Lock size={18} className="mr-3 text-[#9B96E5]" />

                        <input
                          type={showPass ? "text" : "password"}
                          className="w-full bg-transparent text-sm text-[#3F3D56] outline-none"
                          placeholder="Create a new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />

                        <button
                          type="button"
                          className="cursor-pointer text-[#6F6A8D]"
                          onClick={() => setShowPass(!showPass)}
                          aria-label={showPass ? "Hide password" : "Show password"}
                        >
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#595675]">Confirm Password</label>

                      <div className="flex items-center rounded-full border border-[#EED8D6] bg-white px-5 py-3 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#9B96E5]">
                        <Lock size={18} className="mr-3 text-[#9B96E5]" />

                        <input
                          type={showConfirmPass ? "text" : "password"}
                          className="w-full bg-transparent text-sm text-[#3F3D56] outline-none"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />

                        <button
                          type="button"
                          className="cursor-pointer text-[#6F6A8D]"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          aria-label={showConfirmPass ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(155,150,229,0.28)] sm:text-base"
                      style={{ background: "linear-gradient(90deg, #9B96E5, #F08A6C)" }}
                    >
                      {submitting ? "Updating..." : "Reset Password"}
                      {!submitting && <ArrowRight size={16} />}
                    </button>
                  </form>
                )}

                <p className="pt-6 text-center text-sm text-[#605D78]">
                  <Link to="/login" className="font-semibold text-[#8A86D2] hover:underline">
                    Back to Login
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
} 