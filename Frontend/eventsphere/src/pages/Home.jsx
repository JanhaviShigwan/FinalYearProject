import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Users,
  Code,
  Music,
  Trophy,
  Zap,
  Lightbulb,
  CalendarDays,
  MapPin,
  UserPlus,
  Search,
  MousePointerClick,
  BarChart3,
  LayoutDashboard,
  Bell,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import hackathon from "../assets/hackathon.png";

export default function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/events?category=${category}`);
  };

  return (
    <>
      <Navbar />
      {/* home-wrapper: pseudo-element grid/glow + keyframes live in index.css */}
      <div className="home-wrapper">

        {/* ================= HERO ================= */}
        <section className="min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-22 py-8 w-full flex justify-between items-center gap-20">
            <div className="max-w-[620px]">
              <h1 className="text-[64px] leading-[1.15] font-bold text-[#3F3D56]">
                Discover, Register <br />
                &amp; Experience <br />
                Campus Events <br />
                <span className="text-[#9B96E5]">Seamlessly</span>
              </h1>

              <p className="mt-7 text-lg text-[#6B6A80] leading-relaxed">
                Explore trending events, manage registrations effortlessly, and
                stay connected with your campus community.
              </p>

              <Link to="/events">
                <button className="mt-10 px-10 py-4 rounded-[18px] font-semibold text-base text-white bg-[#F08A6C] transition-all duration-300 shadow-[0_10px_20px_rgba(240,138,108,0.25)] hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(240,138,108,0.35)] border-none cursor-pointer inline-block">
                  Explore Events →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= BROWSE CATEGORIES ================= */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-22 py-8 w-full">

            <div className="text-center mb-20 relative">
              <h2 className="text-[48px] font-extrabold text-[#3F3D56] tracking-tight leading-tight mb-4 section-underline">
                Browse Categories
              </h2>
              <p className="text-lg text-[#6B6A80] max-w-[600px] mx-auto leading-relaxed font-normal">
                Find events that match your interests and passions.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-10 mt-10">

              <div
                className="h-[240px] px-[30px] py-10 rounded-[28px] flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_6px_14px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_22px_rgba(0,0,0,0.06)] cursor-pointer bg-[#e9e7fc]"
                onClick={() => handleCategoryClick("Technical")}
              >
                <Code size={24} className="bg-white p-[7px] rounded-full mb-[22px] text-[#3F3D56] shadow-[0_4px_10px_rgba(0,0,0,0.06)] w-8 h-8" strokeWidth={2.2} />
                <h3 className="text-xl font-semibold text-[#3F3D56] mb-2">Technical</h3>
                <p className="text-sm text-[#6B6A80] leading-snug max-w-[160px]">Coding contests &amp; innovation</p>
              </div>

              <div
                className="h-[240px] px-[30px] py-10 rounded-[28px] flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_6px_14px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_22px_rgba(0,0,0,0.06)] cursor-pointer bg-[#F3D7D2]"
                onClick={() => handleCategoryClick("Cultural")}
              >
                <Music size={24} className="bg-white p-[7px] rounded-full mb-[22px] text-[#3F3D56] shadow-[0_4px_10px_rgba(0,0,0,0.06)] w-8 h-8" strokeWidth={2.2} />
                <h3 className="text-xl font-semibold text-[#3F3D56] mb-2">Cultural</h3>
                <p className="text-sm text-[#6B6A80] leading-snug max-w-[160px]">Dance, music &amp; creativity</p>
              </div>

              <div
                className="h-[240px] px-[30px] py-10 rounded-[28px] flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_6px_14px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_22px_rgba(0,0,0,0.06)] cursor-pointer bg-[#D8E8D1]"
                onClick={() => handleCategoryClick("Sports")}
              >
                <Trophy size={24} className="bg-white p-[7px] rounded-full mb-[22px] text-[#3F3D56] shadow-[0_4px_10px_rgba(0,0,0,0.06)] w-8 h-8" strokeWidth={2.2} />
                <h3 className="text-xl font-semibold text-[#3F3D56] mb-2">Sports</h3>
                <p className="text-sm text-[#6B6A80] leading-snug max-w-[160px]">Competition &amp; fitness</p>
              </div>

              <div
                className="h-[240px] px-[30px] py-10 rounded-[28px] flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_6px_14px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_22px_rgba(0,0,0,0.06)] cursor-pointer bg-[#EEEAE4]"
                onClick={() => handleCategoryClick("Workshop")}
              >
                <Lightbulb size={24} className="bg-white p-[7px] rounded-full mb-[22px] text-[#3F3D56] shadow-[0_4px_10px_rgba(0,0,0,0.06)] w-8 h-8" strokeWidth={2.2} />
                <h3 className="text-xl font-semibold text-[#3F3D56] mb-2">Workshops</h3>
                <p className="text-sm text-[#6B6A80] leading-snug max-w-[160px]">Skill development sessions</p>
              </div>

              <div
                className="h-[240px] px-[30px] py-10 rounded-[28px] flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_6px_14px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_22px_rgba(0,0,0,0.06)] cursor-pointer bg-[#ECEBFF] border border-[#C8C6F5]"
                onClick={() => handleCategoryClick("Hackathon")}
              >
                <GraduationCap size={24} className="bg-white p-[7px] rounded-full mb-[22px] text-[#3F3D56] shadow-[0_4px_10px_rgba(0,0,0,0.06)] w-8 h-8" strokeWidth={2.2} />
                <h3 className="text-xl font-semibold text-[#3F3D56] mb-2">Scholarships</h3>
                <p className="text-sm text-[#6B6A80] leading-snug max-w-[160px]">Opportunities for academic excellence</p>
              </div>

            </div>
          </div>
        </section>

        {/* ================= TRENDING EVENTS ================= */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-22 py-8 w-full">

            <div className="text-center mb-20 relative">
              <h2 className="text-[48px] font-extrabold text-[#3F3D56] tracking-tight leading-tight mb-4 section-underline">
                Trending Events
              </h2>
              <p className="text-lg text-[#6B6A80] max-w-[600px] mx-auto leading-relaxed font-normal">
                Explore the most popular events happening on campus.
              </p>
            </div>

            {/* trending-grid: 1.5fr/1fr cannot be expressed in standard Tailwind — kept in index.css */}
            <div className="trending-grid items-stretch gap-[30px]">

              {/* LEFT: Large card */}
              <div className="bg-[#ECEAE6] rounded-[26px] p-[45px] shadow-[0_3px_8px_rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[500px]">
                <div>
                  <span className="text-xs px-4 py-1.5 rounded-full font-semibold inline-block bg-[#E3E1FA] text-[#7A77C8]">Technical</span>
                  <h3 className="text-[26px] font-bold mt-[18px] text-[#3F3D56]">Hackathon 2026</h3>
                  <p className="mt-3 text-base leading-relaxed text-[#6B6A80]">
                    24-hour innovation challenge for developers to build solutions for real-world problems.
                  </p>
                  <img src={hackathon} alt="hackathon" className="mt-4 w-full" />
                </div>
                <div className="mt-5">
                  <div className="mt-7 flex flex-col gap-3.5 text-[15px]">
                    <div className="flex items-center gap-2.5 text-[#5E5D72]">
                      <CalendarDays size={18} className="text-[#9B96E5]" /><span>25 March 2026</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#5E5D72]">
                      <MapPin size={18} className="text-[#F08A6C]" /><span>Main Auditorium</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#5E5D72]">
                      <Users size={18} className="text-[#5C8A5C]" /><span>180 Registered</span>
                    </div>
                  </div>
                  <button className="mt-[34px] px-7 py-3.5 rounded-full font-semibold text-sm bg-[#8F8AD6] text-white border-none cursor-pointer w-full transition-all duration-200 hover:bg-[#7a75c2] hover:-translate-y-0.5 hover:shadow-[0_8px_15px_rgba(143,138,214,0.25)]">
                    Register Now
                  </button>
                </div>
              </div>

              {/* RIGHT: Two stacked cards */}
              <div className="flex flex-col gap-[30px]">

                <div className="bg-[#ECEAE6] rounded-[26px] p-[25px] shadow-[0_3px_8px_rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.03)] flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs px-4 py-1.5 rounded-full font-semibold inline-block bg-[#FDE2D8] text-[#E57A59]">Cultural</span>
                    <h3 className="text-xl font-bold mt-2.5 text-[#3F3D56]">Cultural Fest</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6B6A80]">Celebration of art and music.</p>
                  </div>
                  <div className="mt-5">
                    <div className="mt-7 flex flex-col gap-3.5 text-[15px]">
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <CalendarDays size={16} className="text-[#9B96E5]" /><span>10 April 2026</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <MapPin size={18} className="text-[#F08A6C]" /><span>Amphitheatre</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <Users size={16} className="text-[#5C8A5C]" /><span>320 Registered</span>
                      </div>
                    </div>
                    <button className="mt-[34px] px-7 py-3.5 rounded-full font-semibold text-sm bg-[#8F8AD6] text-white border-none cursor-pointer w-full transition-all duration-200 hover:bg-[#7a75c2] hover:-translate-y-0.5 hover:shadow-[0_8px_15px_rgba(143,138,214,0.25)]">
                      Register Now
                    </button>
                  </div>
                </div>

                <div className="bg-[#ECEAE6] rounded-[26px] p-[25px] shadow-[0_3px_8px_rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.03)] flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs px-4 py-1.5 rounded-full font-semibold inline-block bg-[#D8E8D1] text-[#5C8A5C]">Workshop</span>
                    <h3 className="text-xl font-bold mt-2.5 text-[#3F3D56]">AI Workshop</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6B6A80]">Hands-on ML fundamentals.</p>
                  </div>
                  <div className="mt-5">
                    <div className="mt-7 flex flex-col gap-3.5 text-[15px]">
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <CalendarDays size={16} className="text-[#9B96E5]" /><span>5 April 2026</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <MapPin size={18} className="text-[#F08A6C]" /><span>CS Lab Block B</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#5E5D72]">
                        <Users size={16} className="text-[#5C8A5C]" /><span>95 Registered</span>
                      </div>
                    </div>
                    <button className="mt-[34px] px-7 py-3.5 rounded-full font-semibold text-sm bg-[#8F8AD6] text-white border-none cursor-pointer w-full transition-all duration-200 hover:bg-[#7a75c2] hover:-translate-y-0.5 hover:shadow-[0_8px_15px_rgba(143,138,214,0.25)]">
                      Register Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-22 py-8 w-full">

            <div className="text-center mb-20 relative">
              <h2 className="text-[48px] font-extrabold text-[#3F3D56] tracking-tight leading-tight mb-4 section-underline">
                How It Works
              </h2>
              <p className="text-lg text-[#6B6A80] max-w-[600px] mx-auto leading-relaxed font-normal">
                Get started in four simple steps and never miss an event again.
              </p>
            </div>

            {/* timeline-track: ::before vertical line lives in index.css */}
            <div className="timeline-track pt-10 relative max-w-[720px] mx-auto flex flex-col gap-[50px] pl-[100px]">

              {[
                { icon: <UserPlus size={22} />, step: "STEP 01", title: "Create Account",      desc: "Sign up using your student credentials.",                        bg: "bg-[#D8E8D1]" },
                { icon: <Search size={22} />,   step: "STEP 02", title: "Explore Events",      desc: "Browse trending events and view detailed information.",           bg: "bg-[#EED8D6]" },
                { icon: <MousePointerClick size={22} />, step: "STEP 03", title: "Register Instantly", desc: "Reserve your seat with a single click.",              bg: "bg-[#EDEBE8]" },
                { icon: <BarChart3 size={22} />,step: "STEP 04", title: "Participate & Track", desc: "Manage registrations from your dashboard.",                      bg: "bg-[#F4F4F4]"  },
              ].map(({ icon, step, title, desc, bg }) => (
                <div key={step} className="relative">
                  <div className="absolute -left-[100px] top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.05)] text-[#8C89D9] z-10">
                    {icon}
                  </div>
                  <div className={`text-start px-11 py-9 rounded-[30px] w-full shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_35px_rgba(0,0,0,0.08)] cursor-pointer ${bg}`}>
                    <span className="text-xs font-bold tracking-widest text-[#F08A6C]">{step}</span>
                    <h3 className="mt-2.5 text-[22px] font-bold text-[#3F3D56]">{title}</h3>
                    <p className="mt-2 text-[15px] text-[#6B6A80] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ================= WHY STUDENTS ================= */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-22 py-8 w-full">

            <div className="text-center mb-20 relative">
              <h2 className="text-[48px] font-extrabold text-[#3F3D56] tracking-tight leading-tight mb-4 section-underline">
                Why Students Prefer Our Platform
              </h2>
              <p className="text-lg text-[#6B6A80] max-w-[600px] mx-auto leading-relaxed font-normal">
                Everything you need to make the most of your campus experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 mt-[60px]">

              <div className="bg-white px-10 py-9 rounded-[28px] flex items-start gap-[22px] shadow-[0_8px_18px_rgba(0,0,0,0.04)] border-t-[6px] border-t-[#9B96E5] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.08)]">
                <LayoutDashboard size={20} className="min-w-[46px] w-[46px] h-[46px] bg-[#F4F3FF] p-3 rounded-[14px] text-[#8C89D9]" />
                <div>
                  <h3 className="text-xl font-bold text-[#3F3D56] mb-1.5">Smart Dashboard</h3>
                  <p className="text-[15px] text-[#6B6A80] leading-relaxed">Access all your event registrations and schedules in one place.</p>
                </div>
              </div>

              <div className="bg-white px-10 py-9 rounded-[28px] flex items-start gap-[22px] shadow-[0_8px_18px_rgba(0,0,0,0.04)] border-t-[6px] border-t-[#F08A6C] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.08)]">
                <Zap size={20} className="min-w-[46px] w-[46px] h-[46px] bg-[#F4F3FF] p-3 rounded-[14px] text-[#8C89D9]" />
                <div>
                  <h3 className="text-xl font-bold text-[#3F3D56] mb-1.5">Seamless Registration</h3>
                  <p className="text-[15px] text-[#6B6A80] leading-relaxed">Register quickly without complicated forms.</p>
                </div>
              </div>

              <div className="bg-white px-10 py-9 rounded-[28px] flex items-start gap-[22px] shadow-[0_8px_18px_rgba(0,0,0,0.04)] border-t-[6px] border-t-[#D8E8D1] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.08)]">
                <Bell size={20} className="min-w-[46px] w-[46px] h-[46px] bg-[#F4F3FF] p-3 rounded-[14px] text-[#8C89D9]" />
                <div>
                  <h3 className="text-xl font-bold text-[#3F3D56] mb-1.5">Real-Time Updates</h3>
                  <p className="text-[15px] text-[#6B6A80] leading-relaxed">Stay informed with reminders and instant notifications.</p>
                </div>
              </div>

              <div className="bg-white px-10 py-9 rounded-[28px] flex items-start gap-[22px] shadow-[0_8px_18px_rgba(0,0,0,0.04)] border-t-[6px] border-t-[#EED8D6] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.08)]">
                <ShieldCheck size={20} className="min-w-[46px] w-[46px] h-[46px] bg-[#F4F3FF] p-3 rounded-[14px] text-[#8C89D9]" />
                <div>
                  <h3 className="text-xl font-bold text-[#3F3D56] mb-1.5">Secure &amp; Reliable</h3>
                  <p className="text-[15px] text-[#6B6A80] leading-relaxed">Built with modern technology ensuring data safety.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}