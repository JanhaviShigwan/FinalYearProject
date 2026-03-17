import { useState, useEffect } from "react";
import { ArrowRight, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
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

  useEffect(() => {
    setIsOpen(false);
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

  const dashboardPath = student?.role === "admin" ? "/admin" : "/dashboard";
  const dashboardLabel = student?.role === "admin" ? "Admin Panel" : "Dashboard";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className={`sticky top-4 z-50 mx-auto mt-5 w-full max-w-[1240px] px-4 sm:px-6 ${className}`}>
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(155,150,229,0.14)] bg-[rgba(246,241,235,0.56)] shadow-[0_18px_42px_rgba(57,44,92,0.08)] backdrop-blur-[18px]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(246,241,235,0.36),rgba(249,245,255,0.22),rgba(246,241,235,0.34))]" />
        <div className="pointer-events-none absolute -left-14 top-0 h-24 w-24 rounded-full bg-[#9B96E5]/12 blur-2xl" />
        <div className="pointer-events-none absolute right-8 top-2 h-20 w-20 rounded-full bg-[#F08A6C]/12 blur-2xl" />

        <div className="relative flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-7 lg:py-4">
        <Link
          to="/"
            className="flex min-w-0 items-center gap-3"
            onClick={scrollToTop}
        >
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgba(240,138,108,0.12)] bg-[rgba(255,248,242,0.74)] shadow-[0_10px_20px_rgba(70,55,120,0.06)]">
              <img src={logo} alt="EventSphere Logo" className="h-[42px] w-[42px] object-contain" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center">
                <span className="brand-text truncate text-[1.55rem] font-extrabold tracking-[0.02em] text-[#2F2C44] sm:text-[1.7rem]">
                  Event<span className="text-[#9B96E5]">Sphere</span>
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-3 rounded-full border border-[rgba(255,255,255,0.5)] bg-[rgba(248,242,237,0.58)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={scrollToTop}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#9B96E5,#B6AFFF)] text-white shadow-[0_10px_25px_rgba(155,150,229,0.28)]"
                      : "text-[#4B4962] hover:bg-white hover:text-[#F08A6C]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {!student ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-full px-4 py-2 text-sm font-semibold text-[#3F3D56] transition-all duration-300 hover:bg-[rgba(255,249,245,0.72)] hover:text-[#F08A6C]"
                    onClick={scrollToTop}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#9B96E5,#F08A6C)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(155,150,229,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(155,150,229,0.3)]"
                    onClick={scrollToTop}
                  >
                    Register
                    <ArrowRight size={15} />
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.55)] bg-[rgba(255,248,242,0.66)] px-4 py-2.5 text-sm font-semibold text-[#3F3D56] shadow-[0_8px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:text-[#F08A6C]"
                  >
                    <LayoutDashboard size={15} className="text-[#9B96E5]" />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full border border-[#9B96E5]/20 bg-[#9B96E5]/10 px-4 py-2.5 text-sm font-semibold text-[#7A75B6] transition-all duration-300 hover:bg-[#9B96E5] hover:text-white"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.55)] bg-[rgba(255,248,242,0.68)] text-[#3F3D56] shadow-[0_8px_18px_rgba(0,0,0,0.04)] transition-all duration-300 hover:text-[#F08A6C] md:h-12 md:w-12 lg:hidden"
              onClick={() => {
                setIsOpen(!isOpen);
                scrollToTop();
              }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 lg:hidden ${isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="relative mx-4 mb-4 rounded-[24px] border border-white/80 bg-[rgba(255,250,246,0.94)] p-4 shadow-[0_18px_35px_rgba(60,44,95,0.08)] sm:mx-6 sm:p-5">
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(155,150,229,0.45),transparent)]" />

            <div className="mb-4 flex items-center justify-between rounded-2xl bg-[linear-gradient(135deg,#F8F3FF,#FFF4EE)] px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A86C3]">
                  Navigation
                </p>
                <p className="mt-1 text-sm font-semibold text-[#3F3D56]">
                  {student ? `Signed in as ${student.name?.split(" ")[0] || "Student"}` : "Browse events and updates"}
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6E69AA] shadow-sm">
                {student ? (student.role === "admin" ? "Admin" : "Student") : "Guest"}
              </div>
            </div>

            <div className="grid gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-[linear-gradient(135deg,rgba(155,150,229,0.16),rgba(240,138,108,0.12))] text-[#6E69AA]"
                        : "text-[#3F3D56] hover:bg-[#FCFAF7] hover:text-[#F08A6C]"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      scrollToTop();
                    }}
                  >
                    <span>{link.name}</span>
                    <ArrowRight size={15} className={isActive ? "text-[#6E69AA]" : "text-[#C2BDD8]"} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 border-t border-[#F3EEE9] pt-4">
              {!student ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-2xl border border-[#E8E1F4] bg-white px-4 py-3 text-center text-sm font-semibold text-[#3F3D56] transition-all duration-300 hover:text-[#F08A6C]"
                    onClick={() => {
                      setIsOpen(false);
                      scrollToTop();
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#9B96E5,#F08A6C)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(155,150,229,0.24)]"
                    onClick={() => {
                      setIsOpen(false);
                      scrollToTop();
                    }}
                  >
                    Create Account
                    <ArrowRight size={15} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E8E1F4] bg-white px-4 py-3 text-sm font-semibold text-[#3F3D56] transition-all duration-300 hover:text-[#F08A6C]"
                    onClick={() => {
                      setIsOpen(false);
                      scrollToTop();
                    }}
                  >
                    <LayoutDashboard size={16} className="text-[#9B96E5]" />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F08A6C]/10 px-4 py-3 text-sm font-semibold text-[#D06B4E] transition-all duration-300 hover:bg-[#F08A6C] hover:text-white"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}