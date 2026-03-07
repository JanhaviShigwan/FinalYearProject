import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
  Menu,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

import EventCard from "../components/EventCard";
import "../styles/dashboard.css";
import hackathon from "../assets/hackathon.png";
import fest from "../assets/fest.png";
import workshop from "../assets/workshop.png";
import logo from "../assets/EventSphereLogo.png";

export default function Dashboard() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const student = {
    name: "Cherry Sharma",
    department: "Computer Science",
    role: "Student",
  };

  const handleLogout = () => {
    localStorage.removeItem("eventSphereStudent");
    navigate("/");
  };

  const eventsOverTime = [
    { month: "Sep", events: 3 },
    { month: "Oct", events: 5 },
    { month: "Nov", events: 4 },
    { month: "Dec", events: 2 },
    { month: "Jan", events: 6 },
    { month: "Feb", events: 8 },
    { month: "Mar", events: 5 }
  ];

  const categoryData = [
    { name: "Tech", value: 40, color: "#9B96E5" },
    { name: "Cultural", value: 30, color: "#F08A6C" },
    { name: "Sports", value: 20, color: "#D8E8D1" },
    { name: "Workshop", value: 10, color: "#EED8D6" }
  ];

  const weeklyActivity = [
    { week: "Week 1", events: 3, registrations: 5 },
    { week: "Week 2", events: 2, registrations: 4 },
    { week: "Week 3", events: 4, registrations: 4 },
    { week: "Week 4", events: 3, registrations: 6 }
  ];

  const announcements = [
    {
      title: "Registration Open: Spring Hackathon 2026",
      date: "Feb 28, 2026",
      description:
        "Join the biggest coding event of the semester. Teams of 2–4 can register now through the portal.",
    },
    {
      title: "Campus Fest Volunteer Signup",
      date: "Feb 25, 2026",
      description:
        "We need 50+ volunteers for the upcoming cultural fest. Sign up before March 10.",
    },
    {
      title: "New Event Categories Added",
      date: "Feb 20, 2026",
      description:
        "Explore our newly added Sports and Wellness event categories on the browse page.",
    },
    {
      title: "Feedback Forms Now Available",
      date: "Feb 18, 2026",
      description:
        "Share your experience from past events. Your feedback helps us improve future events.",
    },
  ];

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div>

          <div className="sidebar-logo">
            <img src={logo} alt="EventSphere Logo" className="logo-image" />
            <h2>
              Event<span>Sphere</span>
            </h2>
          </div>

          <nav className="sidebar-menu">

            <a href="/dashboard" className="menu-item active">
              <LayoutDashboard size={20} />
              Dashboard
            </a>

            <a href="#upcoming-events" className="menu-item">
              <Search size={20} />
              Browse Events
            </a>

            <a href="/dashboard" className="menu-item">
              <ClipboardList size={20} />
              My Registrations
            </a>

            <a href="/dashboard" className="menu-item">
              <Calendar size={20} />
              Calendar
            </a>

            <a href="/dashboard" className="menu-item">
              <BarChart3 size={20} />
              Analytics
            </a>

            <a href="/dashboard" className="menu-item">
              <Megaphone size={20} />
              Announcements
            </a>

            <a href="/dashboard" className="menu-item">
              <Settings size={20} />
              Settings
            </a>

          </nav>

        </div>

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

        {/* Header */}
        <div className="dashboard-header">

          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>

            <Menu
              size={22}
              style={{cursor:"pointer"}}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />

            <h2 className="topbar-title">Dashboard</h2>

          </div>

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

        <div className="dashboard-content">

          {/* Welcome */}
          <div className="welcome-card">

            <div>
              <h1 className="welcome-title">
                Welcome back, {student.name}
              </h1>

              <p className="welcome-subtext">
                Here’s what’s happening in your campus today.
              </p>
            </div>

            <div className="welcome-shapes">
              <div className="shape lavender"></div>
              <div className="shape coral"></div>
              <div className="shape green"></div>
            </div>

          </div>


          {/* Stats */}
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


          {/* Upcoming Events */}
          <div className="mt-12" id="upcoming-events">

            <h2 className="text-xl font-semibold text-[#3F3D56] mb-6">
              Upcoming Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              <EventCard
                category="Tech"
                title="National Level Hackathon 2026"
                date="Mar 15, 2026 - 9:00 AM"
                location="Main Auditorium"
                image={hackathon}
              />

              <EventCard
                category="Cultural"
                title="Annual Cultural Fest – Euphoria"
                date="Mar 22, 2026 - 5:00 PM"
                location="Open Air Theater"
                image={fest}
              />

              <EventCard
                category="Workshop"
                title="AI & ML Workshop Series"
                date="Mar 28, 2026 - 10:00 AM"
                location="CS Lab Block B"
                image={workshop}
              />

            </div>

          </div>


          {/* Registrations + Calendar */}
          <div className="dashboard-bottom">

            <div className="registrations-card">
              <h3>My Registrations</h3>

              <div className="registration-item">
                <div className="reg-info">
                  <h4>National Level Hackathon 2026</h4>
                  <p>Tech Club • 12 March 2026</p>
                </div>
                <span className="reg-status">Registered</span>
              </div>

              <div className="registration-item">
                <div className="reg-info">
                  <h4>AI Workshop</h4>
                  <p>Innovation Hub • 5 March 2026</p>
                </div>
                <span className="reg-status">Registered</span>
              </div>

            </div>


            <div className="calendar-card">

              <div className="calendar-header">
                <h3>Calendar</h3>

                <div className="calendar-month">
                  <span className="arrow">‹</span>
                  <span>March 2026</span>
                  <span className="arrow">›</span>
                </div>

              </div>

              <div className="calendar-grid">

                <div className="day">Su</div>
                <div className="day">Mo</div>
                <div className="day">Tu</div>
                <div className="day">We</div>
                <div className="day">Th</div>
                <div className="day">Fr</div>
                <div className="day">Sa</div>

                <div className="date active">1</div>
                <div className="date">2</div>
                <div className="date">3</div>
                <div className="date">4</div>
                <div className="date dot">5</div>
                <div className="date">6</div>
                <div className="date">7</div>

              </div>

            </div>

          </div>


          {/* Analytics */}
          <div className="w-full mt-10">

            <h2 className="text-xl font-bold text-[#3F3D56] mb-6">
              Analytics
            </h2>

            <div className="flex flex-col xl:flex-row w-full gap-6">

              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">

                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={eventsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#9B96E5" strokeWidth={3}/>
                  </LineChart>
                </ResponsiveContainer>

              </div>

              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">

                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" innerRadius={70} outerRadius={100}>
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color}/>
                      ))}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>

              </div>

              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="week"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="events" fill="#9B96E5"/>
                    <Bar dataKey="registrations" fill="#EED8D6"/>
                  </BarChart>
                </ResponsiveContainer>

              </div>

            </div>

          </div>


          {/* Announcements */}
          <div className="announcements-wrapper">

            <h2 className="announcement-title">Announcements</h2>

            <div className="announcement-grid">

              {announcements.map((item,index)=>(
                <div className="announcement-card" key={index}>

                  <div className="announcement-header">
                    <h4>{item.title}</h4>
                    <span>{item.date}</span>
                  </div>

                  <p>{item.description}</p>

                </div>
              ))}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

