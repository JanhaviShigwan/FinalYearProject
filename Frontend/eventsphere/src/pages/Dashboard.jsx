import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  ClipboardList,
  Calendar,
  BarChart3,
  Megaphone,
  Settings,
  Bell,
  MessageSquare,
} from "lucide-react";

import Footer from "../components/Footer";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const student = {
    name: "Cherry Sharma",
    department: "Computer Science",
    role: "Student",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="dashboard-layout">

        {/* Sidebar */}
        <aside className="sidebar">
          <div>
            {/* Logo */}
            <div className="sidebar-logo">
              <div className="logo-icon">✨</div>
              <h2>
                Event<span>Sphere</span>
              </h2>
            </div>

            {/* Menu */}
            <nav className="sidebar-menu">
              <a className="menu-item active">
                <LayoutDashboard size={20} />
                Dashboard
              </a>

              <a className="menu-item">
                <Search size={20} />
                Browse Events
              </a>

              <a className="menu-item">
                <ClipboardList size={20} />
                My Registrations
              </a>

              <a className="menu-item">
                <Calendar size={20} />
                Calendar
              </a>

              <a className="menu-item">
                <BarChart3 size={20} />
                Analytics
              </a>

              <a className="menu-item">
                <Megaphone size={20} />
                Announcements
              </a>

              <a className="menu-item">
                <Settings size={20} />
                Settings
              </a>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="sidebar-bottom">
            <div className="sidebar-profile">
              <div className="profile-avatar">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className="profile-name">{student.name}</p>
                <span className="profile-role">{student.role}</span>
              </div>
            </div>

            <button className="logout-btn-sidebar" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">

          {/* 🔥 Top Header Bar */}
          <div className="dashboard-topbar">
            <h2 className="topbar-title">Dashboard</h2>

            <div className="topbar-right">
              <input
                type="text"
                placeholder="Search events..."
                className="topbar-search"
              />

              <div className="topbar-icon">
                <Bell size={18} />
              </div>

              <div className="topbar-icon">
                <MessageSquare size={18} />
              </div>

              <div className="topbar-profile">
                {student.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="welcome-card">
            <div>
              <h1 className="welcome-title">
                Welcome back, {student.name}
              </h1>
              <p className="welcome-subtext">
                Here’s what’s happening in your campus today.
              </p>
            </div>

            {/* Decorative Shapes (like your screenshot) */}
            <div className="welcome-shapes">
              <div className="shape lavender"></div>
              <div className="shape coral"></div>
              <div className="shape green"></div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">

            <div className="stat-card">
              <div className="stat-top">
                <div className="icon lavender-bg">📅</div>
                <span className="trend positive">+3 this month</span>
              </div>
              <h2>12</h2>
              <p>My Registered Events</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="icon coral-bg">⏰</div>
                <span className="trend positive">+2 this week</span>
              </div>
              <h2>5</h2>
              <p>Upcoming Events</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="icon green-bg">✔</div>
                <span className="trend positive">+8 this semester</span>
              </div>
              <h2>24</h2>
              <p>Events Attended</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="icon coral-bg">⚠</div>
                <span className="trend negative">-1 from last week</span>
              </div>
              <h2>2</h2>
              <p>Pending Approvals</p>
            </div>

          </div>

        </main>

      </div>

      <Footer />
    </>
  );
}