import React, { useState } from "react";
import {
  Target,
  Zap,
  Users,
  CalendarPlus,
  ShieldCheck,
  Bell,
  LayoutDashboard,
  Sparkles,
  Code2,
  Rocket,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("who");

  const tabs = [
    { id: "who", label: "Who We Are" },
    { id: "mission", label: "Mission" },
    { id: "offer", label: "What We Offer" },
    { id: "dev", label: "Developer" },
  ];

  const whoHighlights = [
    {
      title: "Centralized Platform",
      color: "text-[#9B96E5]",
      glow: "hover:shadow-[0_0_25px_rgba(155,150,229,0.35)]",
      body: "All event operations from creation to communication are managed in one structured system.",
    },
    {
      title: "Seamless Experience",
      color: "text-[#22B8CF]",
      glow: "hover:shadow-[0_0_25px_rgba(34,184,207,0.35)]",
      body: "A clean and responsive interface helps students and admins stay focused and productive.",
    },
    {
      title: "Secure and Scalable",
      color: "text-[#F08A6C]",
      glow: "hover:shadow-[0_0_25px_rgba(240,138,108,0.35)]",
      body: "Built on MERN with modular architecture and secure authentication for long-term reliability.",
    },
  ];

  const missionCards = [
    {
      icon: Target,
      title: "Simplify Management",
      color: "text-[#9B96E5]",
      glow: "hover:shadow-[0_0_0_1px_rgba(155,150,229,0.35),0_0_30px_rgba(155,150,229,0.45)]",
      body: "Replace manual registration and scattered coordination with one smart platform.",
    },
    {
      icon: Zap,
      title: "Improve Efficiency",
      color: "text-[#22B8CF]",
      glow: "hover:shadow-[0_0_0_1px_rgba(34,184,207,0.35),0_0_30px_rgba(34,184,207,0.45)]",
      body: "Enable quick event creation, fast registration flow, and timely communication.",
    },
    {
      icon: Users,
      title: "Empower Students",
      color: "text-[#F08A6C]",
      glow: "hover:shadow-[0_0_0_1px_rgba(240,138,108,0.35),0_0_30px_rgba(240,138,108,0.45)]",
      body: "Encourage campus participation with an intuitive and transparent event experience.",
    },
  ];

  const offerCards = [
    {
      icon: CalendarPlus,
      title: "Smart Event Creation",
      color: "text-[#9B96E5]",
      glow: "hover:shadow-[0_0_0_1px_rgba(155,150,229,0.35),0_0_32px_rgba(155,150,229,0.45)]",
      body: "Create, organize, and publish events quickly using guided and structured flows.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Registration",
      color: "text-[#22B8CF]",
      glow: "hover:shadow-[0_0_0_1px_rgba(34,184,207,0.35),0_0_32px_rgba(34,184,207,0.45)]",
      body: "Reliable and secure registration with authentication-aware eligibility checks.",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      color: "text-[#F08A6C]",
      glow: "hover:shadow-[0_0_0_1px_rgba(240,138,108,0.35),0_0_32px_rgba(240,138,108,0.45)]",
      body: "Instant announcements and updates keep participants in sync with changes.",
    },
    {
      icon: LayoutDashboard,
      title: "Admin Dashboard",
      color: "text-[#9B96E5]",
      glow: "hover:shadow-[0_0_0_1px_rgba(155,150,229,0.35),0_0_32px_rgba(155,150,229,0.45)]",
      body: "A unified panel for managing users, events, reports, and performance insights.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* about-bg-glow: animated grid + radial glows via ::before — kept in index.css */}
      <div className="relative overflow-hidden bg-transparent text-[#3F3D56] transition-colors duration-300">
        <div className="about-bg-glow" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10 lg:pb-24 lg:pt-14">

          <AnimatedSection>
            <section className="rounded-[32px] border border-white/90 bg-white/75 px-6 py-10 shadow-[0_20px_60px_rgba(58,45,90,0.16)] backdrop-blur-md sm:px-10 sm:py-12 lg:px-14">
              <div className="mx-auto max-w-4xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EEEAFE] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6C67A9]">
                  <Sparkles size={14} />
                  About EventSphere
                </span>

                <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#2F2D46] sm:text-5xl lg:text-6xl">
                  Reimagining Campus Event Management
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-base leading-[1.85] text-[#54526A] sm:text-lg">
                  EventSphere is built to transform how colleges plan, organize, and experience events through a secure and intuitive digital platform.
                </p>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <section className="mt-9">
              <div className="flex flex-wrap justify-center gap-2.5 rounded-2xl border border-white/80 bg-white/70 p-2 shadow-[0_8px_25px_rgba(54,42,88,0.12)] backdrop-blur-sm sm:gap-3">
                {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 sm:text-base ${
                    activeTab === tab.id
                      ? "bg-[#9B96E5] text-white shadow-md"
                      : "bg-white text-[#3F3D56] hover:bg-[#F5F0EA]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <section className="mt-7 rounded-[30px] border border-white/90 bg-white/88 p-6 shadow-[0_18px_45px_rgba(53,40,85,0.14)] backdrop-blur-md transition-all duration-500 sm:p-8 lg:p-10">

              {/* ─── WHO WE ARE ─── */}
              {activeTab === "who" && (
                <div className="grid gap-9 lg:grid-cols-2 lg:gap-12">
                  <div>
                    <h2 className="text-3xl font-semibold text-[#9B96E5]">Who We Are</h2>

                    <p className="mb-5 mt-5 text-[#3F3D56] leading-relaxed">
                      EventSphere is a centralized college event management platform
                      designed to eliminate chaos from traditional event coordination.
                      It streamlines registrations, announcements, and participant
                      tracking into one seamless digital ecosystem.
                    </p>

                    <p className="text-[#3F3D56]/90 leading-relaxed">
                      Built with scalability and usability in mind, EventSphere empowers
                      organizers and students to manage and participate in events
                      efficiently through a modern, responsive interface.
                    </p>
                  </div>

                  <div className="feature-list space-y-4">
                    {whoHighlights.map((item) => (
                      <div
                        key={item.title}
                        className={`rounded-2xl border border-[#EED8D6]/60 bg-white p-6 transition-all duration-300 hover:-translate-y-1 ${item.glow}`}
                      >
                        <h3 className={`pb-2 text-lg font-semibold ${item.color}`}>{item.title}</h3>
                        <p className="text-[#4B4863] leading-relaxed">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── MISSION ─── */}
              {activeTab === "mission" && (
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-[#9B96E5]">Our Mission</h2>
                  <p className="mx-auto mt-4 max-w-2xl text-[#3F3D56] leading-[1.8] [text-shadow:0_1px_1px_rgba(0,0,0,0.05)]">
                    Simplifying college event management through smart, secure, and scalable digital solutions.
                  </p>

                  <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {missionCards.map(({ icon: Icon, title, color, body, glow }) => (
                      <div
                        key={title}
                        className={`rounded-2xl border border-[#EED8D6]/50 bg-white p-7 text-left transition-all duration-300 hover:-translate-y-1 ${glow}`}
                      >
                        <Icon size={28} className={color} />
                        <h3 className={`mb-3 mt-4 text-lg font-semibold ${color}`}>{title}</h3>
                        <p className="text-base leading-[1.7] text-[#3F3D56]">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── WHAT WE OFFER ─── */}
              {activeTab === "offer" && (
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-[#9B96E5]">What We Offer</h2>
                  <p className="mx-auto mt-4 max-w-2xl text-[#3F3D56] leading-[1.8] [text-shadow:0_1px_1px_rgba(0,0,0,0.05)]">
                    Powerful features designed to enhance event organization and student engagement.
                  </p>

                  <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {offerCards.map(({ icon: Icon, title, color, body, glow }) => (
                      <div
                        key={title}
                        className={`rounded-2xl border border-[#EED8D6]/50 bg-white p-7 text-left transition-all duration-300 hover:-translate-y-1 ${glow}`}
                      >
                        <Icon size={28} className={color} />
                        <h3 className={`mb-3 mt-4 text-lg font-semibold ${color}`}>{title}</h3>
                        <p className="text-base leading-[1.7] text-[#3F3D56]">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── DEVELOPER ─── */}
              {activeTab === "dev" && (
                <div className="mx-auto max-w-7xl">
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">

                    {/* Left — Developer Profile */}
                    <div className="rounded-3xl border border-[#EED8D6]/50 bg-white p-8 transition-all duration-300 backdrop-blur-xl">
                      <div className="mb-6 flex items-center gap-5">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9B96E5] to-[#F08A6C] text-white shadow-lg">
                          <Code2 size={32} />
                        </div>
                        <div>
                          <h3 className="text-[22px] font-bold leading-[1.4] text-[#3F3D56]">Janhavi Shigwan</h3>
                          <p className="mt-1 font-medium text-[#9B96E5]">MERN Stack Developer</p>
                        </div>
                      </div>

                      <p className="text-[#3F3D56] leading-[1.8]">
                        A motivated developer with a strong interest in building modern
                        web applications that combine performance, usability, and clean design.
                        Experienced in developing end-to-end solutions using MongoDB,
                        Express.js, React.js, and Node.js.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <a
                          href="https://www.linkedin.com/in/janhavi-shigwan"
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#9B96E5]/15 text-[#9B96E5] hover:bg-[#9B96E5]/25"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="https://github.com/JanhaviShigwan"
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#F08A6C]/15 text-[#F08A6C] hover:bg-[#F08A6C]/25"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>

                    {/* Right — Project Details */}
                    <div className="rounded-3xl border border-[#EED8D6]/50 bg-white p-8 transition-all duration-300 backdrop-blur-xl">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9B96E5] text-white shadow-md">
                          <Rocket size={22} />
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

                      <div className="mt-6 flex flex-wrap gap-3">
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

            </section>
          </AnimatedSection>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;