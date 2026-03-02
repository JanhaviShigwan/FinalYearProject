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
import "../styles/aboutus.css";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("who");

  return (
    <>
      <Navbar />

      <div className="about-wrapper">
        <div className="about-bg-glow"></div>

        <div className="about-container">
          {/* HERO */}
          <section className="about-hero">
            <h1 className="about-title">About EventSphere</h1>
            <p className="about-subtitle">
              A modern platform built to transform how colleges manage and
              experience events — designed with innovation, clarity, and simplicity.
            </p>
          </section>

          {/* TABS */}
          <section>
            <div className="about-tabs">
              {[
                { id: "who", label: "Who We Are" },
                { id: "mission", label: "Mission" },
                { id: "offer", label: "What We Offer" },
                { id: "dev", label: "Developer" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`about-tab ${activeTab === tab.id ? "active" : ""
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="about-card">
              {/* WHO */}
              {activeTab === "who" && (
                <div className="about-grid">
                  <div>
                    <h2 className="section-title teal">Who We Are</h2>

                    <p className="text-muted">
                      EventSphere is a centralized college event management platform
                      designed to eliminate chaos from traditional event coordination.
                      It streamlines registrations, announcements, and participant
                      tracking into one seamless digital ecosystem.
                    </p>

                    <p className="text-muted-light">
                      Built with scalability and usability in mind, EventSphere empowers
                      organizers and students to manage and participate in events
                      efficiently through a modern, responsive interface.
                    </p>

                    <div className="stats">
                      <div>
                        <h3 className="stat purple">20+</h3>
                        <p>Events Supported</p>
                      </div>
                      <div>
                        <h3 className="stat teal">1000+</h3>
                        <p>Registrations Managed</p>
                      </div>
                      <div>
                        <h3 className="stat peach">100%</h3>
                        <p>Digital Process</p>
                      </div>
                    </div>
                  </div>

                  <div className="feature-list">
                    <div className="feature-card purple-glow">
                      <h3>Centralized Platform</h3>
                      <p>
                        All event operations — creation, registration, notifications —
                        handled in one structured system.
                      </p>
                    </div>

                    <div className="feature-card teal-glow">
                      <h3>Seamless Experience</h3>
                      <p>
                        Clean UI and responsive design ensure smooth interaction across devices.
                      </p>
                    </div>

                    <div className="feature-card peach-glow">
                      <h3>Secure & Scalable</h3>
                      <p>
                        Built using the MERN stack with structured architecture and secure authentication.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MISSION */}
              {activeTab === "mission" && (
                <div className="mission-wrapper">
                  <h2 className="mission-title">Our Mission</h2>

                  <p className="mission-subtitle">
                    Simplifying college event management through smart, secure, and scalable digital solutions.
                  </p>

                  <div className="mission-cards">
                    <div className="mission-card">
                      <Target size={28} className="mission-icon purple" />
                      <h3>Simplify Management</h3>
                      <p>
                        Eliminate manual registrations and scattered communication
                        through a centralized digital platform.
                      </p>
                    </div>

                    <div className="mission-card">
                      <Zap size={28} className="mission-icon teal" />
                      <h3>Improve Efficiency</h3>
                      <p>
                        Provide fast event creation, instant registrations, and
                        real-time notifications.
                      </p>
                    </div>

                    <div className="mission-card">
                      <Users size={28} className="mission-icon peach" />
                      <h3>Empower Students</h3>
                      <p>
                        Build a platform that encourages participation and enhances campus engagement.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "offer" && (
                <div className="offer-wrapper">
                  <h2 className="offer-title">What We Offer</h2>

                  <p className="offer-subtitle">
                    Powerful features designed to enhance event organization and student engagement.
                  </p>

                  <div className="offer-cards">
                    <div className="offer-card">
                      <CalendarPlus size={28} className="offer-icon purple" />
                      <h3>Smart Event Creation</h3>
                      <p>
                        Create and manage events easily with structured forms and dashboards.
                      </p>
                    </div>

                    <div className="offer-card">
                      <ShieldCheck size={28} className="offer-icon teal" />
                      <h3>Secure Registration</h3>
                      <p>
                        Safe and fast registration system with authentication support.
                      </p>
                    </div>

                    <div className="offer-card">
                      <Bell size={28} className="offer-icon peach" />
                      <h3>Real-Time Notifications</h3>
                      <p>
                        Instant updates for participants about event schedules and changes.
                      </p>
                    </div>

                    <div className="offer-card">
                      <LayoutDashboard size={28} className="offer-icon purple" />
                      <h3>Admin Dashboard</h3>
                      <p>
                        Organized control panel to manage users, events, and analytics.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "dev" && (
                <div className="dev-wrapper">
                  <div className="dev-grid">

                    {/* LEFT — DEVELOPER PROFILE */}
                    <div className="dev-card">
                      <div className="dev-header">
                        <div className="dev-avatar">
                          👨‍💻
                        </div>

                        <div>
                          <h3 className="dev-name">Janhavi Shigwan</h3>
                          <p className="dev-role">MERN Stack Developer</p>
                        </div>
                      </div>

                      <p className="dev-text">
                        A motivated developer with a strong interest in building modern
                        web applications that combine performance, usability, and clean design.
                        Experienced in developing end-to-end solutions using MongoDB,
                        Express.js, React.js, and Node.js.
                      </p>

                      <div className="dev-links">
                        <a
                          href="#www.linkedin.com/in/janhavi-shigwan"
                          className="dev-btn purple"
                        >
                          LinkedIn
                        </a>

                        <a
                          href="https://github.com/JanhaviShigwan"
                          className="dev-btn teal"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>

                    {/* RIGHT — PROJECT DETAILS */}
                    <div className="dev-card">
                      <div className="project-header">
                        <div className="project-icon">
                          {"</>"}
                        </div>
                        <h3 className="project-title">Academic Capstone Project</h3>
                      </div>

                      <p className="dev-text">
                        EventSphere was developed as part of an academic capstone project,
                        focusing on digitizing and streamlining college event operations.
                        The platform provides a structured system for event creation,
                        registration management, and participant coordination.
                      </p>

                      <p className="dev-text">
                        The development emphasized modular backend architecture,
                        responsive frontend design, secure authentication mechanisms,
                        and efficient data handling — ensuring scalability and smooth
                        performance across devices.
                      </p>

                      <div className="tech-stack">
                        {[
                          "MongoDB",
                          "Express.js",
                          "React.js",
                          "Node.js",
                          "JWT Authentication",
                          "RESTful APIs",
                        ].map((tech, index) => (
                          <span key={index} className="tech-pill">
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