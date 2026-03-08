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

export default function Register() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

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
    setSuccess("");

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
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setSuccess(`Registration successful! Your Student ID: ${res.data.student.studentId}`);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 1500);
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
      <Navbar />

      {/* Page background */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-12"
           style={{ background: "linear-gradient(to bottom right, #FFFFFF, #F6F1EB, #F9F5FF)", color: "#3F3D56" }}>

        {/* Blobs */}
        <div className="absolute top-[40%] left-[20%] w-[260px] h-[260px] rounded-full opacity-35 z-0 animate-[floatBlob_12s_ease-in-out_infinite]"
             style={{ background: "radial-gradient(circle, rgba(155,150,229,0.5), transparent 70%)", filter: "blur(120px)" }} />
        <div className="absolute bottom-[20%] right-[20%] w-[260px] h-[260px] rounded-full opacity-35 z-0 animate-[floatBlob_12s_ease-in-out_infinite]"
             style={{ background: "radial-gradient(circle, rgba(240,138,108,0.5), transparent 70%)", filter: "blur(120px)" }} />

        {/* Animated grid — keyframes in index.css */}
        <div className="animated-grid" />

        {/* Main card */}
        <div className="relative w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden flex z-10"
             style={{ minHeight: "720px" }}>

          {/* ── LEFT: Image panel ── */}
          <div className="w-1/2 relative flex items-center justify-center overflow-hidden rounded-tl-[40px] rounded-bl-[40px]"
               style={{
                 backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop')",
                 backgroundSize: "cover",
                 backgroundPosition: "center",
                 backgroundRepeat: "no-repeat",
               }}>

            {/* Overlay */}
            <div className="absolute inset-0"
                 style={{ background: "linear-gradient(135deg, rgba(155,150,229,0.75), rgba(240,138,108,0.65))" }} />

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg px-8 text-white flex flex-col items-center justify-center">
              <h1 className="text-4xl xl:text-5xl font-bold mb-4 text-white">
                Why Register for EventSphere?
              </h1>
              <p className="text-base opacity-90 mb-10 text-white">
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
          <div className="w-1/2 px-16 py-16 flex items-center bg-white rounded-tr-[40px] rounded-br-[40px]">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-auto"
            >
              <h2 className="text-3xl font-bold mb-8 text-[#3F3D56]">Create Account</h2>

              {error   && <p className="text-sm mb-4 text-[#F08A6C]">{error}</p>}
              {success && <p className="text-sm mb-4 font-medium text-green-600">{success}</p>}

              <form onSubmit={handleSubmit} className="space-y-5">

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
                  <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
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
                  <div onClick={() => setShowConfirm(!showConfirm)} className="cursor-pointer">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: "linear-gradient(90deg, #9B96E5, #F08A6C)" }}
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-sm text-[#3F3D56]">
                  Already have an account?
                  <Link to="/login" className="ml-1 text-[#9B96E5] hover:underline">Login</Link>
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