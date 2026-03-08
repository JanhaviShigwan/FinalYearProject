import React from "react";
import "../styles/home.css";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  CalendarCheck,
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
      <div className="home-wrapper">

        {/* ================= HERO ================= */}
        <section className="hero-section">
          <div className="container hero-container">
            <div className="hero-left">
              <h1>
                Discover, Register <br />
                & Experience <br />
                Campus Events <br />
                <span className="highlight">Seamlessly</span>
              </h1>

              <p>
                Explore trending events, manage registrations effortlessly, and
                stay connected with your campus community.
              </p>

              <Link to="/events">
                <button className="primary-btn">
                  Explore Events →
                </button>
              </Link>
            </div>

          </div>
        </section>

        {/* ================= BROWSE ================= */}
        <section className="section">
          <div className="container center-text">
            <h2>Browse Categories</h2>
            <p className="subtitle">
              Find events that match your interests and passions.
            </p>

           <div className="categories-grid">

  <div
    className="category-card home-tech"
    onClick={() => handleCategoryClick("Technical")}
  >
    <Code size={24} />
    <h3>Technical</h3>
    <p>Coding contests & innovation</p>
  </div>

  <div
    className="category-card home-cultural"
    onClick={() => handleCategoryClick("Cultural")}
  >
    <Music size={24} />
    <h3>Cultural</h3>
    <p>Dance, music & creativity</p>
  </div>

  <div
    className="category-card home-sports"
    onClick={() => handleCategoryClick("Sports")}
  >
    <Trophy size={24} />
    <h3>Sports</h3>
    <p>Competition & fitness</p>
  </div>

  <div
    className="category-card home-neutral"
    onClick={() => handleCategoryClick("Workshop")}
  >
    <Lightbulb size={24} />
    <h3>Workshops</h3>
    <p>Skill development sessions</p>
  </div>

  <div
    className="category-card home-hack"
    onClick={() => handleCategoryClick("Hackathon")}
  >
    <GraduationCap size={24} />
    <h3>Scholarships</h3>
    <p>Opportunities for academic excellence</p>
  </div>

</div>
          </div>
        </section>

        {/* ================= TRENDING ================= */}
        <section className="trending-section">
          <div className="container">
            <div className="trending-header">
              <h2>Trending Events</h2>
              <p>Explore the most popular events happening on campus.</p>
            </div>

            {/* The main grid container */}
            <div className="trending-grid-layout">

              {/* LEFT SIDE: Large Hackathon Card */}
              <div className="event-card large-card">
                <div>
                  <span className="pill technical-pill">Technical</span>
                  <h3>Hackathon 2026</h3>
                  <p className="event-desc">
                    24-hour innovation challenge for developers to build solutions for real-world problems.
                  </p>
                  <img src={hackathon} alt="fuck" />
                </div>

                <div className="event-bottom">
                  <div className="event-meta">
                    <div><CalendarDays size={18} /> <span>25 March 2026</span></div>
                    <div><MapPin size={18} /> <span>Main Auditorium</span></div>
                    <div><Users size={18} /> <span>180 Registered</span></div>
                  </div>
                  <button className="register-now-btn full-btn">Register Now</button>
                </div>
              </div>

              {/* RIGHT SIDE: Two Stacked Cards */}
              <div className="right-stack">

                <div className="event-card small-card">
                  <div>
                    <span className="pill cultural-pill">Cultural</span>
                    <h3>Cultural Fest</h3>
                    <p className="event-desc">Celebration of art and music.</p>
                  </div>
                  <div className="event-bottom">
                    <div className="event-meta">
                      <div><CalendarDays size={16} /> <span>10 April 2026</span></div>
                      <div><MapPin size={18} /> <span>Amphitheatre</span></div>
                      <div><Users size={16} /> <span>320 Registered</span></div>
                    </div>
                    <button className="register-now-btn full-btn">Register Now</button>
                  </div>
                </div>

                <div className="event-card small-card">
                  <div>
                    <span className="pill workshop-pill">Workshop</span>
                    <h3>AI Workshop</h3>
                    <p className="event-desc">Hands-on ML fundamentals.</p>
                  </div>
                  <div className="event-bottom">
                    <div className="event-meta">
                      <div><CalendarDays size={16} /> <span>5 April 2026</span></div>
                      <div><MapPin size={18} /> <span>CS Lab Block B</span></div>
                      <div><Users size={16} /> <span>95 Registered</span></div>
                    </div>
                    <button className="register-now-btn full-btn">Register Now</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ================= HOW IT WORKS ================= */}
        <section className="section">
          <div className="container center-text">
            <h2>How It Works</h2>
            <p className="subtitle">
              Get started in four simple steps and never miss an event again.
            </p>

            <div className="timeline">

              <div className="timeline-item">
                <div className="timeline-icon">
                  <UserPlus size={22} />
                </div>

                <div className="timeline-content green-bg">
                  <span>STEP 01</span>
                  <h3>Create Account</h3>
                  <p>Sign up using your student credentials.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon">
                  <Search size={22} />
                </div>

                <div className="timeline-content blush-bg">
                  <span>STEP 02</span>
                  <h3>Explore Events</h3>
                  <p>Browse trending events and view detailed information.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon">
                  <MousePointerClick size={22} />
                </div>

                <div className="timeline-content neutral-bg">
                  <span>STEP 03</span>
                  <h3>Register Instantly</h3>
                  <p>Reserve your seat with a single click.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon">
                  <BarChart3 size={22} />
                </div>

                <div className="timeline-content light-bg">
                  <span>STEP 04</span>
                  <h3>Participate & Track</h3>
                  <p>Manage registrations from your dashboard.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= WHY STUDENTS ================= */}
        <section className="section">
          <div className="container center-text">
            <h2>Why Students Prefer Our Platform</h2>
            <p className="subtitle">
              Everything you need to make the most of your campus experience.
            </p>

            <div className="why-grid">
              <div className="why-card purple-top">
                <LayoutDashboard size={20} />
                <div>
                  <h3>Smart Dashboard</h3>
                  <p>Access all your event registrations and schedules in one place.</p>
                </div>
              </div>

              <div className="why-card coral-top">
                <Zap size={20} />
                <div>
                  <h3>Seamless Registration</h3>
                  <p>Register quickly without complicated forms.</p>
                </div>
              </div>

              <div className="why-card green-top">
                <Bell size={20} />
                <div>
                  <h3>Real-Time Updates</h3>
                  <p>Stay informed with reminders and instant notifications.</p>
                </div>
              </div>

              <div className="why-card blush-top">
                <ShieldCheck size={20} />
                <div>
                  <h3>Secure & Reliable</h3>
                  <p>Built with modern technology ensuring data safety.</p>
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