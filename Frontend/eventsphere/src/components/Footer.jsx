import { Mail, MapPin, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/EventSphereLogo.png";

export default function Footer() {
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
    { to: "/about", label: "About" },
    { to: "/faq", label: "FAQ" },
  ];

  const authLinks = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
    { to: "/forgot-password", label: "Forgot Password" },
  ];

  const socialLinks = [
    {
      href: "https://github.com/JanhaviShigwan",
      icon: <Github size={19} />,
      label: "GitHub",
    },
    {
      href: "https://www.linkedin.com/in/janhavi-shigwan",
      icon: <Linkedin size={19} />,
      label: "LinkedIn",
    },
    {
      href: "https://instagram.com/",
      icon: <Instagram size={19} />,
      label: "Instagram",
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-[rgba(155,150,229,0.28)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,243,255,0.9),rgba(255,245,240,0.9))] px-4 pb-8 pt-14 text-[#3F3D56] sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[8%] h-44 w-44 rounded-full bg-[#9B96E5]/20 blur-[90px]" />
        <div className="absolute bottom-[4%] right-[10%] h-44 w-44 rounded-full bg-[#F08A6C]/18 blur-[95px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-2 py-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-9 md:grid-cols-2 xl:grid-cols-[1.25fr,0.9fr,0.85fr,1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="EventSphere Logo" className="h-[74px] w-[74px] object-contain" />
              <span className="font-['Manrope',sans-serif] text-2xl font-extrabold text-[#3F3D56]">
                Event<span className="text-[#9B96E5]">Sphere</span>
              </span>
            </div>

            <p className="mt-4 max-w-[360px] text-[15px] leading-[1.75] text-[#66647a]">
              Discover, register, and manage college events with a platform built for seamless student experiences.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-full bg-[#F08A6C] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e57c5f]"
              >
                Explore Events
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-[#D9D4F3] bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#4A4763] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BFB8EA]"
              >
                Join Now
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-extrabold tracking-[0.18em] text-[#59557d]">EXPLORE</h4>
            <div className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block text-[15px] text-[#6B6A80] transition-colors duration-300 hover:text-[#F08A6C]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-extrabold tracking-[0.18em] text-[#59557d]">ACCOUNT</h4>
            <div className="space-y-3">
              {authLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block text-[15px] text-[#6B6A80] transition-colors duration-300 hover:text-[#F08A6C]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-extrabold tracking-[0.18em] text-[#59557d]">CONTACT</h4>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[15px] text-[#6B6A80]">
                <Mail size={17} className="shrink-0 text-[#9B96E5]" />
                <a href="mailto:mail.eventsphere@gmail.com" className="transition-colors duration-300 hover:text-[#F08A6C]">
                  mail.eventsphere@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-[15px] text-[#6B6A80]">
                <MapPin size={17} className="shrink-0 text-[#9B96E5]" />
                <span>Mumbai, India</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DED9F5] bg-white/90 text-[#3F3D56] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#bcb3ea] hover:text-[#F08A6C]"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-[#E9E1F5] pt-4 text-center text-sm text-[#6B6A80] md:text-left">
          <p>© 2026 EventSphere. Crafted for connected campus communities.</p>
        </div>
      </div>
    </footer>
  );
}