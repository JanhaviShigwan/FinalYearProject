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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const API_URL = "https://eventsphere-8sgd.onrender.com";

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
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      localStorage.setItem("eventSphereStudent", JSON.stringify(res.data.student));
      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Animated grid — pseudo-element keyframes kept in index.css */}
        <div className="animated-grid" />

        {/* Main card */}
        <div className="relative w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden flex z-10"
             style={{ minHeight: "720px" }}>

          {/* ── LEFT: Form ── */}
          <div className="w-1/2 px-16 py-16 flex items-center bg-white rounded-tl-[40px] rounded-bl-[40px]">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-auto"
            >
              <h2 className="text-3xl font-bold mb-8 text-[#3F3D56]">Sign In</h2>

              {error && <p className="text-sm mb-4 text-[#F08A6C]">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email */}
                <div className="flex items-center rounded-full px-5 py-3 transition-all duration-200 border border-[#EED8D6] bg-white focus-within:ring-2 focus-within:ring-[#9B96E5] focus-within:border-transparent">
                  <Mail size={18} className="mr-3 text-[#9B96E5]" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Somaiya Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent text-sm text-[#3F3D56]"
                  />
                </div>

                {/* Password */}
                <div className="flex items-center rounded-full px-5 py-3 transition-all duration-200 border border-[#EED8D6] bg-white focus-within:ring-2 focus-within:ring-[#9B96E5] focus-within:border-transparent">
                  <Lock size={18} className="mr-3 text-[#9B96E5]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent text-sm text-[#3F3D56]"
                  />
                  <div className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>

                <div className="flex justify-end text-sm">
                  <Link to="/forgot-password" className="text-[#F08A6C] hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: "linear-gradient(90deg, #9B96E5, #F08A6C)" }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                <p className="text-sm mt-6 text-[#3F3D56]">
                  Don't have an account?
                  <Link to="/register" className="ml-1 text-[#9B96E5] hover:underline">Register</Link>
                </p>

              </form>
            </motion.div>
          </div>

          {/* ── RIGHT: Image panel ── */}
          <div className="w-1/2 relative flex items-center justify-center overflow-hidden rounded-tr-[40px] rounded-br-[40px]"
               style={{
                 backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop')",
                 backgroundSize: "cover",
                 backgroundPosition: "center",
                 backgroundRepeat: "no-repeat",
               }}>

            {/* Overlay */}
            <div className="absolute inset-0"
                 style={{ background: "linear-gradient(135deg, rgba(155,150,229,0.75), rgba(240,138,108,0.65))" }} />

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg px-8 text-white flex flex-col items-center justify-center">
              <h1 className="text-4xl xl:text-5xl font-bold mb-4 text-white">EventSphere Platform</h1>
              <p className="text-base opacity-90 mb-10 text-white">
                A smarter way to manage and experience college events.
              </p>

              <div className="space-y-5 w-full">
                {[
                  { icon: <CalendarCheck size={22} />, label: "Plan & Schedule Events" },
                  { icon: <Users size={22} />,         label: "Manage Participants"    },
                  { icon: <Ticket size={22} />,        label: "Digital Ticketing System" },
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
        </div>
      </div>

      <Footer />
    </>
  );
}