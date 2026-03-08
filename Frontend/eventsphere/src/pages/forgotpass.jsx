import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

      {/* forgot-wrapper */}
      <div className="forgot-wrapper relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-10 bg-[#F6F1EB]">

        {/* blob-1 */}
        <div className="absolute rounded-full blur-3xl opacity-25 animate-pulse w-32 h-32 sm:w-64 sm:h-64 bg-[#9B96E5] top-[-30px] left-[-30px]" />
        {/* blob-2 */}
        <div className="absolute rounded-full blur-3xl opacity-25 animate-pulse w-32 h-32 sm:w-64 sm:h-64 bg-[#F08A6C] bottom-[-30px] right-[-30px]" />
        {/* blob-3 */}
        <div className="absolute rounded-full blur-3xl opacity-25 animate-pulse hidden sm:block w-52 h-52 bg-[#D8E8D1] top-[45%] left-[35%]" />

        {/* forgot-card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl shadow-xl bg-white transition-all duration-300 hover:-translate-y-[3px]"
        >
          <h2 className="text-xl sm:text-3xl font-bold text-center mb-2 text-[#3F3D56]">
            Forgot Password 🔐
          </h2>
          <p className="text-center text-sm sm:text-base mb-6 text-[#3F3D56]">
            Enter your Somaiya email to receive reset instructions
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm text-center mb-3">{message}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#3F3D56]">
                Email Address
              </label>
              <div className="flex items-center border border-[#EED8D6] rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#9B96E5]">
                <Mail size={18} className="mr-2 text-[#9B96E5]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-[#3F3D56]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition-all duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #9B96E5, #F08A6C)" }}
            >
              Send Reset Link
            </button>

            <p className="text-center text-xs sm:text-sm mt-5 text-[#3F3D56]">
              Remember your password?{" "}
              <Link to="/login" className="text-[#F08A6C] font-medium hover:underline">
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}