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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@somaiya\.edu$/;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
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

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const studentData = res.data.student;

      if (!studentData || !studentData._id) {
        setError("Login failed. Invalid student data.");
        return;
      }

      // Store student session
      localStorage.setItem(
        "eventSphereStudent",
        JSON.stringify(studentData)
      );

      if (studentData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="relative min-h-screen flex flex-col overflow-hidden px-4 pt-0 pb-12 sm:px-6"
        style={{
          background:
            "linear-gradient(to bottom right, #FFFFFF, #F6F1EB, #F9F5FF)",
          color: "#3F3D56",
        }}
      >
        <Navbar />

        <div className="animated-grid" />

        {/* Background blobs */}

        <div
          className="absolute left-[14%] top-[34%] h-[280px] w-[280px] rounded-full opacity-35 z-0 animate-[floatBlob_12s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(circle, rgba(155,150,229,0.48), transparent 70%)",
            filter: "blur(120px)",
          }}
        />

        <div
          className="absolute bottom-[16%] right-[16%] h-[260px] w-[260px] rounded-full opacity-35 z-0 animate-[floatBlob_12s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(circle, rgba(240,138,108,0.45), transparent 70%)",
            filter: "blur(120px)",
          }}
        />

        <div className="relative z-10 flex-1 flex items-center justify-center pt-20 pb-10">

          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-[38px] border border-white/80 shadow-[0_25px_60px_rgba(51,38,82,0.18)] flex"
            style={{ minHeight: "700px" }}
          >
            {/* LEFT SIDE LOGIN FORM */}

            <div className="auth-form-panel w-[54%] px-8 py-12 flex items-center bg-white/96 rounded-tl-[38px] rounded-bl-[38px] sm:px-12 lg:px-16 lg:py-16">
              <motion.div
                initial={{ opacity: 0, x: -34 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
                className="w-full max-w-md mx-auto"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F1EDFF] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6C67A8]">
                  <Sparkles size={14} />
                  Welcome Back
                </span>

                <h2 className="mt-5 text-4xl font-bold text-[#2F2C44]">
                  Sign In
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[#6D6A84]">
                  Access your event dashboard, registrations, and updates in seconds.
                </p>

                {error && (
                  <p className="mt-5 rounded-xl border border-[#F7D4CB] bg-[#FFF2EE] px-4 py-3 text-sm font-medium text-[#CC6245]">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">

                  <div className="flex items-center rounded-full border border-[#EED8D6] bg-white px-5 py-3 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#9B96E5]">
                    <Mail size={18} className="mr-3 text-[#9B96E5]" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Somaiya Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-[#3F3D56] outline-none"
                    />
                  </div>

                  <div className="flex items-center rounded-full border border-[#EED8D6] bg-white px-5 py-3 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#9B96E5]">
                    <Lock size={18} className="mr-3 text-[#9B96E5]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-[#3F3D56] outline-none"
                    />
                    <button
                      type="button"
                      className="cursor-pointer text-[#6F6A8D]"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="flex justify-end text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-[#F08A6C] transition hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(155,150,229,0.28)] sm:text-base"
                    style={{
                      background:
                        "linear-gradient(90deg, #9B96E5, #F08A6C)",
                    }}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                    {!loading && <ArrowRight size={16} />}
                  </button>

                  <p className="pt-2 text-sm text-[#605D78]">
                    Don&apos;t have an account?
                    <Link
                      to="/register"
                      className="ml-1 font-semibold text-[#8A86D2] hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                </form>
              </motion.div>
            </div>

            {/* RIGHT SIDE PANEL */}

            <div
              className="auth-image-right-panel w-[46%] relative flex items-center justify-center overflow-hidden rounded-tr-[38px] rounded-br-[38px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(155,150,229,0.78), rgba(240,138,108,0.68))",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="relative z-10 text-center max-w-lg px-8 text-white"
              >
                <h1 className="text-4xl font-bold mb-4">
                  EventSphere Platform
                </h1>

                <p className="opacity-90 mb-10 leading-relaxed">
                  A smarter way to discover, manage, and experience college events.
                </p>

                <div className="space-y-5">
                  {[
                    { icon: <CalendarCheck size={22} />, label: "Plan and Schedule Events" },
                    { icon: <Users size={22} />, label: "Manage Participants" },
                    { icon: <Ticket size={22} />, label: "Digital Ticketing System" },
                  ].map(({ icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center justify-center gap-3 rounded-2xl bg-white/15 px-6 py-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25"
                    >
                      <span className="text-[#FFE0D7]">{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}