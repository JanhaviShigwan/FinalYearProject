import React, { useState } from "react";
import {
  Target,
  Zap,
  Users,
  CalendarPlus,
  ShieldCheck,
  Bell,
  LayoutDashboard,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("who");

  return (
    <>
      <Navbar />

      {/* about-bg-glow: animated grid + radial glows via ::before — kept in index.css */}
      <div className="relative bg-transparent text-[#3F3D56] overflow-hidden transition-colors duration-300">
        <div className="about-bg-glow" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">

          {/* ── HERO ── */}
          <section className="text-center mb-20">
            <h1 className="text-5xl font-bold text-[#9B96E5]">About EventSphere</h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg font-semibold text-[#3F3D56] leading-[1.8] [text-shadow:0_1px_1px_rgba(0,0,0,0.05)]">
              A modern platform built to transform how colleges manage and
              experience events — designed with innovation, clarity, and simplicity.
            </p>
          </section>

          {/* ── TABS ── */}
          <section>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {[
                { id: "who",     label: "Who We Are" },
                { id: "mission", label: "Mission"    },
                { id: "offer",   label: "What We Offer" },
                { id: "dev",     label: "Developer"  },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-[#9B96E5] text-white shadow-lg"
                      : "bg-white hover:bg-[#EED8D6]/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-12 shadow-xl transition-all duration-500">

              {/* ─── WHO WE ARE ─── */}
              {activeTab === "who" && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-3xl font-semibold mb-6 text-[#9B96E5]">Who We Are</h2>

                    <p className="text-[#3F3D56] leading-relaxed mb-6">
                      EventSphere is a centralized college event management platform
                      designed to eliminate chaos from traditional event coordination.
                      It streamlines registrations, announcements, and participant
                      tracking into one seamless digital ecosystem.
                    </p>

                    <p className="text-[#3F3D56]/90 leading-relaxed mb-6">
                      Built with scalability and usability in mind, EventSphere empowers
                      organizers and students to manage and participate in events
                      efficiently through a modern, responsive interface.
                    </p>

                    <div className="flex gap-6 mt-8">
                      <div>
                        <h3 className="text-2xl font-semibold text-[#9B96E5]">20+</h3>
                        <p>Events Supported</p>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-[#D8E8D1]">1000+</h3>
                        <p>Registrations Managed</p>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-[#F08A6C]">100%</h3>
                        <p>Digital Process</p>
                      </div>
                    </div>
                  </div>

                  <div className="feature-list">
                    <div className="bg-white mb-4 border border-[#EED8D6]/60 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(155,150,229,0.35)]">
                      <h3 className="font-semibold text-lg pb-3 text-[#9B96E5]">Centralized Platform</h3>
                      <p>
                        All event operations — creation, registration, notifications —
                        handled in one structured system.
                      </p>
                    </div>

                    <div className="bg-white mb-4 border border-[#EED8D6]/60 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(216,232,209,0.75)]">
                      <h3 className="font-semibold text-lg pb-3 text-[#22B8CF]">Seamless Experience</h3>
                      <p>
                        Clean UI and responsive design ensure smooth interaction across devices.
                      </p>
                    </div>

                    <div className="bg-white mb-4 border border-[#EED8D6]/60 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(240,138,108,0.4)]">
                      <h3 className="font-semibold text-lg pb-3 text-[#F08A6C]">Secure &amp; Scalable</h3>
                      <p>
                        Built using the MERN stack with structured architecture and secure authentication.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── MISSION ─── */}
              {activeTab === "mission" && (
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-[#9B96E5]">Our Mission</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-[#3F3D56] leading-[1.8] [text-shadow:0_1px_1px_rgba(0,0,0,0.05)]">
                    Simplifying college event management through smart, secure, and scalable digital solutions.
                  </p>

                  <div className="grid md:grid-cols-3 gap-8 mt-12">

                    <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 bg-white border border-[#EED8D6]/50 backdrop-blur-xl hover:shadow-[0_0_0_1px_rgba(155,150,229,0.35),0_0_30px_rgba(155,150,229,0.45)]">
                      <Target size={28} className="text-[#9B96E5]" />
                      <h3 className="text-lg font-semibold text-[#9B96E5] mt-4 mb-3">Simplify Management</h3>
                      <p className="text-base text-[#3F3D56] leading-[1.7]">
                        Eliminate manual registrations and scattered communication
                        through a centralized digital platform.
                      </p>
                    </div>

                    <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 bg-white border border-[#EED8D6]/50 backdrop-blur-xl hover:shadow-[0_0_0_1px_rgba(71,217,240,0.35),0_0_30px_rgba(63,220,244,0.85)]">
                      <Zap size={28} className="text-[#22B8CF]" />
                      <h3 className="text-lg font-semibold text-[#22B8CF] mt-4 mb-3">Improve Efficiency</h3>
                      <p className="text-base text-[#3F3D56] leading-[1.7]">
                        Provide fast event creation, instant registrations, and
                        real-time notifications.
                      </p>
                    </div>

                    <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 bg-white border border-[#EED8D6]/50 backdrop-blur-xl hover:shadow-[0_0_0_1px_rgba(240,138,108,0.35),0_0_30px_rgba(240,138,108,0.45)]">
                      <Users size={28} className="text-[#F08A6C]" />
                      <h3 className="text-lg font-semibold text-[#F08A6C] mt-4 mb-3">Empower Students</h3>
                      <p className="text-base text-[#3F3D56] leading-[1.7]">
                        Build a platform that encourages participation and enhances campus engagement.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* ─── WHAT WE OFFER ─── */}
              {activeTab === "offer" && (
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-[#9B96E5]">What We Offer</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-[#3F3D56] leading-[1.8] [text-shadow:0_1px_1px_rgba(0,0,0,0.05)]">
                    Powerful features designed to enhance event organization and student engagement.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mt-12">

                    <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 bg-white border border-[#EED8D6]/50 backdrop-blur-xl hover:shadow-[0_0_0_1px_rgba(155,150,229,0.35),0_0_32px_rgba(155,150,229,0.45)]">
                      <CalendarPlus size={28} className="text-[#9B96E5]" />
                      <h3 className="text-lg font-semibold text-[#9B96E5] mt-4 mb-3">Smart Event Creation</h3>
                      <p className="text-base text-[#3F3D56] leading-[1.7]">
                        Create and manage events easily with structured forms and dashboards.
                      </p>
                    </div>

                    <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 bg-white border border-[#EED8D6]/50 backdrop-blur-xl hover:shadow-[0_0_0_1px_rgba(34,184,207,0.35),0_0_32px_rgba(34,184,207,0.45)]">
                      <ShieldCheck size={28} className="text-[#22B8CF]" />
                      <h3 className="text-lg font-semibold text-[#22B8CF] mt-4 mb-3">Secure Registration</h3>
                      <p className="text-base text-[#3F3D56] leading-[1.7]">
                        Safe and fast registration system with authentication support.
                      </p>
                    </div>

                    <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 bg-white border border-[#EED8D6]/50 backdrop-blur-xl hover:shadow-[0_0_0_1px_rgba(240,138,108,0.35),0_0_32px_rgba(240,138,108,0.45)]">
                      <Bell size={28} className="text-[#F08A6C]" />
                      <h3 className="text-lg font-semibold text-[#F08A6C] mt-4 mb-3">Real-Time Notifications</h3>
                      <p className="text-base text-[#3F3D56] leading-[1.7]">
                        Instant updates for participants about event schedules and changes.
                      </p>
                    </div>

                    <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 bg-white border border-[#EED8D6]/50 backdrop-blur-xl hover:shadow-[0_0_0_1px_rgba(155,150,229,0.35),0_0_32px_rgba(155,150,229,0.45)]">
                      <LayoutDashboard size={28} className="text-[#9B96E5]" />
                      <h3 className="text-lg font-semibold text-[#9B96E5] mt-4 mb-3">Admin Dashboard</h3>
                      <p className="text-base text-[#3F3D56] leading-[1.7]">
                        Organized control panel to manage users, events, and analytics.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* ─── DEVELOPER ─── */}
              {activeTab === "dev" && (
                <div className="max-w-7xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-12">

                    {/* Left — Developer Profile */}
                    <div className="rounded-3xl p-10 transition-all duration-300 bg-white border border-[#EED8D6]/50 backdrop-blur-xl">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9B96E5] to-[#F08A6C] flex items-center justify-center text-white text-4xl shadow-lg">
                          👨‍💻
                        </div>
                        <div>
                          <h3 className="text-[22px] font-bold text-[#3F3D56] leading-[1.4]">Janhavi Shigwan</h3>
                          <p className="font-medium mt-1 text-[#9B96E5]">MERN Stack Developer</p>
                        </div>
                      </div>

                      <p className="text-[#3F3D56] leading-[1.8]">
                        A motivated developer with a strong interest in building modern
                        web applications that combine performance, usability, and clean design.
                        Experienced in developing end-to-end solutions using MongoDB,
                        Express.js, React.js, and Node.js.
                      </p>

                      <div className="flex mt-4 gap-4">
                        <a
                          href="#www.linkedin.com/in/janhavi-shigwan"
                          className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#9B96E5]/15 text-[#9B96E5] hover:bg-[#9B96E5]/25"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="https://github.com/JanhaviShigwan"
                          className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#F08A6C]/15 text-[#F08A6C] hover:bg-[#F08A6C]/25"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>

                    {/* Right — Project Details */}
                    <div className="rounded-3xl p-10 transition-all duration-300 bg-white border border-[#EED8D6]/50 backdrop-blur-xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#9B96E5] flex items-center justify-center text-white text-xl shadow-md">
                          {"</>"}
                        </div>
                        <h3 className="text-[22px] font-bold text-[#3F3D56]">Academic Capstone Project</h3>
                      </div>

                      <p className="text-[#3F3D56] leading-[1.8] mb-4">
                        EventSphere was developed as part of an academic capstone project,
                        focusing on digitizing and streamlining college event operations.
                        The platform provides a structured system for event creation,
                        registration management, and participant coordination.
                      </p>

                      <p className="text-[#3F3D56] leading-[1.8]">
                        The development emphasized modular backend architecture,
                        responsive frontend design, secure authentication mechanisms,
                        and efficient data handling — ensuring scalability and smooth
                        performance across devices.
                      </p>

                      <div className="flex flex-wrap gap-3 mt-6">
                        {[
                          "MongoDB",
                          "Express.js",
                          "React.js",
                          "Node.js",
                          "JWT Authentication",
                          "RESTful APIs",
                        ].map((tech, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-[#EED8D6]/40 border border-[#9B96E5]/30 text-[#3F3D56] transition-all duration-300 hover:border-[#9B96E5]/50 hover:shadow-[0_0_15px_rgba(155,150,229,0.3)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;