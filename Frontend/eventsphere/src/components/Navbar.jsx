import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/EventSphereLogo.png";

export default function Navbar({ className = "" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState(null);

  // ✅ Check login status whenever route changes
  useEffect(() => {
    const storedStudent = localStorage.getItem("eventSphereStudent");
    setStudent(storedStudent ? JSON.parse(storedStudent) : null);
  }, [location.pathname]);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("eventSphereStudent");
    setStudent(null);
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <nav className={`navbar-main sticky top-0 z-50 max-w-[1200px] w-full mx-auto mt-5 px-6 bg-white/90 backdrop-blur-md rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-[rgba(155,150,229,0.15)] transition-all duration-300 max-[767px]:w-[calc(100%-28px)] max-[767px]:px-4 max-[767px]:rounded-2xl ${className}`}>
      <div className="py-[18px] flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-[14px]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logo} alt="EventSphere Logo" className="w-[60px] h-[60px] object-contain" />
          <span className="brand-text font-extrabold text-2xl text-[#3F3D56] tracking-[0.5px]">
            Event<span className="text-[#9B96E5]">Sphere</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-base transition-all duration-300 hover:text-[#F08A6C] ${
                location.pathname === link.path ? "text-[#9B96E5]" : "text-[#3F3D56]"
              }`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-4 items-center">
            {!student ? (
              <>
                <Link
                  to="/login"
                  className="text-[15px] text-[#3F3D56] transition-all duration-300 hover:text-[#F08A6C]"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-[22px] py-[10px] rounded-[10px] font-semibold text-[15px] border-[1.5px] border-[#9B96E5] text-[#9B96E5] transition-all duration-300 hover:bg-[#9B96E5] hover:text-white"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-[15px] text-[#3F3D56] transition-all duration-300 hover:text-[#F08A6C]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-[22px] py-[10px] rounded-[10px] font-semibold text-[15px] border-[1.5px] border-[#9B96E5] text-[#9B96E5] transition-all duration-300 hover:bg-[#9B96E5] hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="block md:hidden p-[10px] rounded-[10px] bg-[#F6F1EB] text-[#3F3D56]"
            onClick={() => {
              setIsOpen(!isOpen);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "flex" : "hidden"} flex-col gap-[18px] p-5 bg-white mt-3 rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.05)]`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-base font-medium transition-all duration-300 hover:text-[#F08A6C] ${
              location.pathname === link.path ? "text-[#9B96E5]" : "text-[#3F3D56]"
            }`}
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {link.name}
          </Link>
        ))}

        <div className="mt-3 pt-3 border-t border-[#F6F1EB] flex flex-col gap-3">
          {!student ? (
            <>
              <Link
                to="/login"
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-logout-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}