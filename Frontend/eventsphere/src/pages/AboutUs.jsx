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

      <div className="relative bg-[#F3F4F6] dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br 
          from-[#6D28D9]/10 
          via-[#0D9488]/10 
          to-[#FDBA74]/10
          dark:from-[#6D28D9]/20 
          dark:via-[#0D9488]/20 
          dark:to-[#FDBA74]/20
          blur-3xl pointer-events-none">
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">

          {/* HERO */}
          <section className="text-center mb-20">
            <h1 className="text-5xl font-bold text-[#6D28D9] dark:text-purple-400">
              About EventSphere
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              A modern platform built to transform how colleges manage and
              experience events — designed with innovation, clarity, and simplicity.
            </p>
          </section>

          {/* INTERACTIVE TABS */}
          <section>

            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {[
                { id: "who", label: "Who We Are" },
                { id: "mission", label: "Mission" },
                { id: "offer", label: "What We Offer" },
                { id: "dev", label: "Developer" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${activeTab === tab.id
                    ? "bg-[#6D28D9] text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 hover:bg-[#FDBA74]/30"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONTENT AREA */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl transition-all duration-500">

              {/* WHO WE ARE */}
              {activeTab === "who" && (
                <div className="max-w-7xl mx-auto">

                  <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* LEFT SIDE — MAIN DESCRIPTION */}
                    <div>
                      <h2 className="text-3xl font-semibold text-[#0D9488] mb-6">
                        Who We Are
                      </h2>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        EventSphere is a centralized college event management platform
                        designed to eliminate chaos from traditional event coordination.
                        It streamlines registrations, announcements, and participant
                        tracking into one seamless digital ecosystem.
                      </p>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        Built with scalability and usability in mind, EventSphere empowers
                        organizers and students to manage and participate in events
                        efficiently through a modern, responsive interface.
                      </p>

                      <div className="flex gap-6 mt-8">
                        <div>
                          <h3 className="text-2xl font-semibold text-[#6D28D9]">20+</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Events Supported
                          </p>
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold text-[#0D9488]">1000+</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Registrations Managed
                          </p>
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold text-[#FDBA74]">100%</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Digital Process
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE — FEATURE HIGHLIGHTS */}
                    <div className="space-y-6">

                      <div className="bg-white dark:bg-[#1F2937]
          border border-gray-200 dark:border-gray-700
          p-6 rounded-2xl
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-[0_0_25px_rgba(109,40,217,0.25)]">

                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                          Centralized Platform
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          All event operations — creation, registration, notifications —
                          handled in one structured system.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-[#1F2937]
          border border-gray-200 dark:border-gray-700
          p-6 rounded-2xl
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-[0_0_25px_rgba(13,148,136,0.25)]">

                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                          Seamless Experience
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Clean UI and responsive design ensure smooth interaction across devices.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-[#1F2937]
          border border-gray-200 dark:border-gray-700
          p-6 rounded-2xl
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-[0_0_25px_rgba(253,186,116,0.30)]">

                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                          Secure & Scalable
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Built using the MERN stack with structured architecture and secure authentication.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              )}
              {/* MISSION */}
              {activeTab === "mission" && (
                <div>
                  <h2 className="text-3xl font-semibold text-[#0D9488] text-center">
                    Our Mission
                  </h2>

                  {/* Subtitle */}
                  <p className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Simplifying college event management through smart, secure, and scalable digital solutions.
                  </p>

                  <div className="grid md:grid-cols-3 gap-8 mt-12">

                    {/* Card 1 */}
                    <div className="bg-white dark:bg-[#1F2937] 
        border border-gray-200 dark:border-gray-700
        p-8 rounded-2xl shadow-md
        transition-all duration-300 
        hover:-translate-y-2
        hover:border-[#6D28D9]/40
        hover:shadow-[0_0_25px_rgba(109,40,217,0.25)]">

                      <Target className="text-[#6D28D9] mb-4" size={30} />

                      <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">
                        Simplify Management
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Eliminate manual registrations and scattered communication
                        through a centralized digital platform.
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-[#1F2937] 
        border border-gray-200 dark:border-gray-700
        p-8 rounded-2xl shadow-md
        transition-all duration-300 
        hover:-translate-y-2
        hover:border-[#0D9488]/40
        hover:shadow-[0_0_25px_rgba(13,148,136,0.25)]">

                      <Zap className="text-[#0D9488] mb-4" size={30} />

                      <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">
                        Improve Efficiency
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Provide fast event creation, instant registrations, and
                        real-time notifications.
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-[#1F2937] 
        border border-gray-200 dark:border-gray-700
        p-8 rounded-2xl shadow-md
        transition-all duration-300 
        hover:-translate-y-2
        hover:border-[#FDBA74]/50
        hover:shadow-[0_0_25px_rgba(253,186,116,0.30)]">

                      <Users className="text-[#FDBA74] mb-4" size={30} />

                      <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">
                        Empower Students
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Build a platform that encourages participation and enhances campus engagement.
                      </p>
                    </div>

                  </div>
                </div>
              )}
              {/* WHAT WE OFFER */}
              {activeTab === "offer" && (
                <div>
                  <h2 className="text-3xl font-semibold text-[#0D9488] text-center">
                    What We Offer
                  </h2>

                  {/* Subtitle */}
                  <p className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Powerful features designed to enhance event organization and student engagement.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mt-12">

                    {[
                      {
                        icon: <CalendarPlus size={28} className="text-[#6D28D9]" />,
                        title: "Smart Event Creation",
                        desc: "Create and manage events easily with structured forms and dashboards.",
                        glow: "hover:shadow-[0_0_25px_rgba(109,40,217,0.25)] hover:border-[#6D28D9]/40",
                      },
                      {
                        icon: <ShieldCheck size={28} className="text-[#0D9488]" />,
                        title: "Secure Registration",
                        desc: "Safe and fast registration system with authentication support.",
                        glow: "hover:shadow-[0_0_25px_rgba(13,148,136,0.25)] hover:border-[#0D9488]/40",
                      },
                      {
                        icon: <Bell size={28} className="text-[#FDBA74]" />,
                        title: "Real-Time Notifications",
                        desc: "Instant updates for participants about event schedules and changes.",
                        glow: "hover:shadow-[0_0_25px_rgba(253,186,116,0.30)] hover:border-[#FDBA74]/50",
                      },
                      {
                        icon: <LayoutDashboard size={28} className="text-[#6D28D9]" />,
                        title: "Admin Dashboard",
                        desc: "Organized control panel to manage users, events, and analytics.",
                        glow: "hover:shadow-[0_0_25px_rgba(109,40,217,0.25)] hover:border-[#6D28D9]/40",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`bg-white dark:bg-[#1F2937]
            border border-gray-200 dark:border-gray-700
            p-8 rounded-2xl shadow-md
            transition-all duration-300
            hover:-translate-y-2
            ${item.glow}`}
                      >
                        <div className="mb-4">{item.icon}</div>

                        {/* FIXED TITLE COLOR */}
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">
                          {item.title}
                        </h3>

                        {/* FIXED DESCRIPTION COLOR */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* DEVELOPER SECTION */}
              {activeTab === "dev" && (
                <div className="max-w-7xl mx-auto">

                  <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* LEFT SIDE — DEVELOPER PROFILE */}
                    <div className="bg-white dark:bg-[#1F2937]
        border border-gray-200 dark:border-gray-700
        rounded-3xl p-10 shadow-md h-full">

                      <div className="flex items-center gap-6 mb-6">

                        <div className="w-24 h-24 rounded-full
            bg-gradient-to-br from-[#6D28D9] to-[#0D9488]
            flex items-center justify-center
            text-white text-4xl shadow-lg">
                          👨‍💻
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Your Name
                          </h3>
                          <p className="text-[#0D9488] font-medium mt-1">
                            MERN Stack Developer
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        A motivated developer with a strong interest in building modern
                        web applications that combine performance, usability, and clean design.
                        Experienced in developing end-to-end solutions using MongoDB,
                        Express.js, React.js, and Node.js.
                      </p>

                      <div className="flex gap-4">
                        <a
                          href="#www.linkedin.com/in/janhavi-shigwan"
                          className="px-5 py-2 rounded-xl
              bg-[#6D28D9]/10 dark:bg-[#6D28D9]/20
              text-[#6D28D9]
              hover:bg-[#6D28D9]/20
              transition-all duration-300"
                        >
                          LinkedIn
                        </a>

                        <a
                          href="https://github.com/JanhaviShigwan"
                          className="px-5 py-2 rounded-xl
              bg-[#0D9488]/10 dark:bg-[#0D9488]/20
              text-[#0D9488]
              hover:bg-[#0D9488]/20
              transition-all duration-300"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>

                    {/* RIGHT SIDE — PROJECT DETAILS */}
                    <div className="bg-white dark:bg-[#1F2937]
        border border-gray-200 dark:border-gray-700
        rounded-3xl p-10 shadow-md h-full">

                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl
            bg-[#6D28D9]
            flex items-center justify-center
            text-white text-xl shadow-md">
                          {"</>"}
                        </div>

                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                          Academic Capstone Project
                        </h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        EventSphere was developed as part of an academic capstone project,
                        focusing on digitizing and streamlining college event operations.
                        The platform provides a structured system for event creation,
                        registration management, and participant coordination.
                      </p>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                        The development emphasized modular backend architecture,
                        responsive frontend design, secure authentication mechanisms,
                        and efficient data handling — ensuring scalability and smooth
                        performance across devices.
                      </p>

                      <div className="flex flex-wrap gap-3">
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
                            className="px-4 py-2 rounded-full text-sm font-medium
                bg-gray-100 dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-300
                transition-all duration-300
                hover:border-[#6D28D9]/40
                hover:shadow-[0_0_15px_rgba(109,40,217,0.25)]"
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