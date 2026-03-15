import { Mail, MapPin, Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/EventSphereLogo.png";

export default function Footer() {
  return (
    <footer
      className="w-full pt-[70px] pb-[35px] px-4 border-t border-[rgba(155,150,229,0.4)] text-[#3F3D56]"
      style={{
        backgroundColor: "rgba(249,199,195,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* ── Main grid ── */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[60px] mb-[50px]">

        {/* LEFT — About */}
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <img src={logo} alt="EventSphere Logo" className="w-[90px] h-[90px] object-contain" />
            <span className="font-['Manrope',sans-serif] text-xl font-bold text-[#3F3D56]">
              Event<span className="text-[#9B96E5]">Sphere</span>
            </span>
          </div>
          <p className="mt-[22px] text-base text-[#6B6A80] leading-[1.7] max-w-[320px] mx-auto sm:mx-0">
            The premier platform for discovering and managing college events.
            Connect, collaborate, and celebrate.
          </p>
        </div>

        {/* MIDDLE — Quick Links */}
        <div className="text-left">
          <h4 className="text-[15px] font-bold tracking-[1.2px] mb-6 text-[#3F3D56]">QUICK LINKS</h4>
          {[
            { to: "/",       label: "Home"   },
            { to: "/events", label: "Events" },
            { to: "/about",  label: "About"  },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block mb-3.5 text-base text-[#6B6A80] transition-colors duration-300 hover:text-[#F08A6C]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT — Contact */}
        <div className="text-left">
          <h4 className="text-[15px] font-bold tracking-[1.2px] mb-6 text-[#3F3D56]">CONTACT US</h4>

          <div className="flex items-center gap-2.5 mb-[18px] text-base text-[#6B6A80]">
            <Mail size={18} className="text-[#9B96E5] shrink-0" />
            <a href="mailto:eventsphere@gmail.com" className="hover:text-[#F08A6C] transition-colors duration-300">
              eventsphere@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2.5 mb-[18px] text-base text-[#6B6A80]">
            <MapPin size={18} className="text-[#9B96E5] shrink-0" />
            <span>Mumbai, India</span>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="w-full border-t border-[#EED8D6] pt-5 flex flex-col md:flex-row gap-4 items-center md:justify-between text-[15px] text-[#6B6A80]">
        <p>© 2026 EventSphere. All rights reserved.</p>

        <div className="flex gap-5">
          {[
            { href: "https://github.com/JanhaviShigwan", icon: <Github size={20} />,    label: "GitHub"    },
            { href: "https://linkedin.com/",             icon: <Linkedin size={20} />,  label: "LinkedIn"  },
            { href: "https://instagram.com/",            icon: <Instagram size={20} />, label: "Instagram" },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-[#3F3D56] cursor-pointer transition-all duration-300 hover:text-[#F08A6C] hover:-translate-y-0.5"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}