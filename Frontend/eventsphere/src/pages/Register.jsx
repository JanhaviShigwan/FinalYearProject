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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_URL from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  const passwordRules = {
    minLength:   /.{8,}/,
    upperCase:   /[A-Z]/,
    lowerCase:   /[a-z]/,
    number:      /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const validatePassword = (pw) =>
    Object.fromEntries(Object.entries(passwordRules).map(([k, r]) => [k, r.test(pw)]));

  const passwordValidation = validatePassword(formData.password);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!emailRegex.test(formData.email)) {
      setError("Email must be a valid @somaiya.edu address.");
      return;
    }
    if (!Object.values(passwordValidation).every(Boolean)) {
      setError("Password does not meet required criteria.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const studentData = res.data?.student;

      if (!studentData?._id) {
        setError("Registration failed. Invalid student data.");
        return;
      }

      localStorage.setItem(
        "eventSphereStudent",
        JSON.stringify(studentData)
      );

      navigate("/dashboard");
    } catch (err) {
      if (err.response)       setError(err.response.data.message);
      else if (err.request)   setError("Server not responding. Is backend running?");
      else                    setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Input row shared classes
  const inputBox = "flex items-center rounded-full px-5 py-3 transition-all duration-200 border border-[#EED8D6] bg-white focus-within:ring-2 focus-within:ring-[#9B96E5] focus-within:border-transparent";
  const inputField = "w-full outline-none bg-transparent text-sm text-[#3F3D56]";
  const inputIcon = "mr-3 text-[#9B96E5]";

  return (
    <>
      <div
        className="relative min-h-screen flex flex-col overflow-hidden px-4 pt-0 pb-12 sm:px-6"
        style={{ background: "linear-gradient(to bottom right, #FFFFFF, #F6F1EB, #F9F5FF)", color: "#3F3D56" }}
      >
        <Navbar />

        <div className="animated-grid" />

        <div
          className="absolute top-[38%] left-[18%] h-[280px] w-[280px] rounded-full opacity-35 z-0 animate-[floatBlob_12s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle, rgba(155,150,229,0.48), transparent 70%)", filter: "blur(120px)" }}
        />

        <div
          className="absolute bottom-[16%] right-[16%] h-[260px] w-[260px] rounded-full opacity-35 z-0 animate-[floatBlob_12s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle, rgba(240,138,108,0.45), transparent 70%)", filter: "blur(120px)" }}
        />

        <div className="relative z-10 flex-1 flex items-center justify-center pt-20 pb-10">
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-[38px] border border-white/80 shadow-[0_25px_60px_rgba(51,38,82,0.18)] flex"
            style={{ minHeight: "700px" }}
          >

          {/* ── LEFT: Image panel ── */}
          <div className="auth-image-left-panel w-[46%] relative flex items-center justify-center overflow-hidden rounded-tl-[38px] rounded-bl-[38px]"
               style={{
                 backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop')",
                 backgroundSize: "cover",
                 backgroundPosition: "center",
                 backgroundRepeat: "no-repeat",
               }}>

            {/* Overlay */}
            <div className="absolute inset-0"
                 style={{ background: "linear-gradient(145deg, rgba(155,150,229,0.78), rgba(240,138,108,0.68))" }} />

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg px-8 text-white flex flex-col items-center justify-center">
              <h1 className="text-4xl xl:text-5xl font-bold mb-4 text-white">
                Why Register for EventSphere?
              </h1>
              <p className="text-base opacity-90 mb-10 text-white leading-relaxed">
                Unlock exclusive access to college events and competitions.
              </p>

              <div className="space-y-5 w-full">
                {[
                  { icon: <CalendarCheck size={22} />, label: "Early Access to Events"   },
                  { icon: <Users size={22} />,         label: "Connect with Students"    },
                  { icon: <Ticket size={22} />,        label: "Instant Digital Tickets"  },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center justify-center gap-3 bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl transition-all duration-300 cursor-pointer hover:bg-white/25 hover:shadow-xl hover:-translate-y-1"
                  >
                    <span className="text-[#F08A6C]">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="auth-form-panel w-[54%] px-8 py-12 flex items-center bg-white/96 rounded-tr-[38px] rounded-br-[38px] sm:px-12 lg:px-16 lg:py-16">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="w-full max-w-md mx-auto"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F1EDFF] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6C67A8]">
                <Sparkles size={14} />
                Join EventSphere
              </span>

              <h2 className="mt-5 text-4xl font-bold text-[#2F2C44]">Create Account</h2>

              <p className="mt-2 text-sm leading-relaxed text-[#6D6A84]">
                Start discovering and registering for campus events in minutes.
              </p>

              {error && (
                <p className="mt-5 rounded-xl border border-[#F7D4CB] bg-[#FFF2EE] px-4 py-3 text-sm font-medium text-[#CC6245]">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">

                {/* Name */}
                <div className={inputBox}>
                  <User size={18} className={inputIcon} />
                  <input type="text" name="name" placeholder="Full Name"
                    value={formData.name} onChange={handleChange} required className={inputField} />
                </div>

                {/* Email */}
                <div className={inputBox}>
                  <Mail size={18} className={inputIcon} />
                  <input type="email" name="email" placeholder="Somaiya Email"
                    value={formData.email} onChange={handleChange} required className={inputField} />
                </div>

                {/* Password */}
                <div className={inputBox}>
                  <Lock size={18} className={inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" placeholder="Password"
                    value={formData.password} onChange={handleChange} required className={inputField}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-[#6F6A8D]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password rules */}
                <div className="text-sm space-y-1">
                  {Object.entries(passwordValidation).map(([key, valid]) => (
                    <div key={key} className={`flex items-center gap-2 ${valid ? "text-green-500" : "text-red-500"}`}>
                      {valid ? <Check size={14} /> : <X size={14} />}
                      {key === "minLength"   && "Minimum 8 characters"}
                      {key === "upperCase"   && "Uppercase letter"}
                      {key === "lowerCase"   && "Lowercase letter"}
                      {key === "number"      && "Number"}
                      {key === "specialChar" && "Special character"}
                    </div>
                  ))}
                </div>

                {/* Confirm password */}
                <div className={inputBox}>
                  <Lock size={18} className={inputIcon} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword" placeholder="Confirm Password"
                    value={formData.confirmPassword} onChange={handleChange} required className={inputField}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="cursor-pointer text-[#6F6A8D]"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(155,150,229,0.28)] sm:text-base"
                  style={{ background: "linear-gradient(90deg, #9B96E5, #F08A6C)" }}
                >
                  {loading ? "Registering..." : "Register"}
                  {!loading && <ArrowRight size={16} />}
                </button>

                <p className="pt-2 text-sm text-[#605D78]">
                  Already have an account?
                  <Link to="/login" className="ml-1 font-semibold text-[#8A86D2] hover:underline">Login</Link>
                </p>

              </form>
            </motion.div>
          </div>

        </div>
        </div>
      </div>

      <Footer />
    </>
  );
}