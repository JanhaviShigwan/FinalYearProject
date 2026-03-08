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
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import EventCard from "../components/EventCard";
import hackathon from "../assets/hackathon.png";
import fest from "../assets/fest.png";
import workshop from "../assets/workshop.png";
import logo from "../assets/EventSphereLogo.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const student = { name: "Cherry Sharma", department: "Computer Science", role: "Student" };

  const handleLogout = () => {
    localStorage.removeItem("eventSphereStudent");
    navigate("/");
  };

  const eventsOverTime = [
    { month: "Sep", events: 3 }, { month: "Oct", events: 5 },
    { month: "Nov", events: 4 }, { month: "Dec", events: 2 },
    { month: "Jan", events: 6 }, { month: "Feb", events: 8 },
    { month: "Mar", events: 5 },
  ];

  const categoryData = [
    { name: "Tech",     value: 40, color: "#9B96E5" },
    { name: "Cultural", value: 30, color: "#F08A6C" },
    { name: "Sports",   value: 20, color: "#D8E8D1" },
    { name: "Workshop", value: 10, color: "#EED8D6" },
  ];

  const weeklyActivity = [
    { week: "Week 1", events: 3, registrations: 5 },
    { week: "Week 2", events: 2, registrations: 4 },
    { week: "Week 3", events: 4, registrations: 4 },
    { week: "Week 4", events: 3, registrations: 6 },
  ];

  const announcements = [
    { title: "Registration Open: Spring Hackathon 2026",  date: "Feb 28, 2026", description: "Join the biggest coding event of the semester. Teams of 2–4 can register now through the portal." },
    { title: "Campus Fest Volunteer Signup",              date: "Feb 25, 2026", description: "We need 50+ volunteers for the upcoming cultural fest. Sign up before March 10." },
    { title: "New Event Categories Added",                date: "Feb 20, 2026", description: "Explore our newly added Sports and Wellness event categories on the browse page." },
    { title: "Feedback Forms Now Available",              date: "Feb 18, 2026", description: "Share your experience from past events. Your feedback helps us improve future events." },
  ];

  const menuItems = [
    { href: "/dashboard",       icon: <LayoutDashboard size={20} />, label: "Dashboard",       active: true  },
    { href: "/events", icon: <Search size={20} />,          label: "Browse Events",   active: false },
    { href: "/dashboard",       icon: <ClipboardList size={20} />,   label: "My Registrations",active: false },
    { href: "/dashboard",       icon: <Calendar size={20} />,        label: "Calendar",        active: false },
    { href: "/dashboard",       icon: <BarChart3 size={20} />,       label: "Analytics",       active: false },
    { href: "/dashboard",       icon: <Megaphone size={20} />,       label: "Announcements",   active: false },
    { href: "/dashboard",       icon: <Settings size={20} />,        label: "Settings",        active: false },
  ];

  const stats = [
    { icon: "📅", iconBg: "bg-[#9B96E5]/20", trend: "+3 this month",    positive: true,  value: "12", label: "My Registered Events" },
    { icon: "⏰", iconBg: "bg-[#F08A6C]/20", trend: "+2 this week",     positive: true,  value: "5",  label: "Upcoming Events"      },
    { icon: "✔",  iconBg: "bg-[#D8E8D1]",   trend: "+8 this semester", positive: true,  value: "24", label: "Events Attended"      },
    { icon: "⚠",  iconBg: "bg-[#F08A6C]/20", trend: "-1 from last week",positive: false, value: "2",  label: "Pending Approvals"    },
  ];

  return (
    <div className="flex h-screen bg-[#F6F1EB]">

      {/* ── SIDEBAR ── */}
      <aside className={`
        w-72 fixed left-0 top-0 h-full bg-white border-r border-gray-100
        flex flex-col justify-between p-6 z-40
        transition-transform duration-300
        md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="EventSphere Logo" className="w-8 h-8 object-contain" />
            <h2 className="text-xl font-semibold text-[#3F3D56]">
              Event<span className="text-[#9B96E5]">Sphere</span>
            </h2>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-3">
            {menuItems.map(({ href, icon, label, active }) => (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300
                  ${active
                    ? "bg-[#9B96E5]/20 text-[#9B96E5]"
                    : "text-gray-600 hover:bg-[#F6F1EB] hover:text-[#3F3D56]"
                  }`}
              >
                {icon}{label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-[#F6F1EB] p-4 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-[#9B96E5] text-white rounded-full flex items-center justify-center font-semibold">
              {student.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#3F3D56]">{student.name}</p>
              <span className="text-sm text-gray-500">{student.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-[#F08A6C] text-white py-2 rounded-xl font-medium transition-all duration-300 hover:bg-[#e67858] hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN ── */}
      <main className="md:ml-72 flex flex-col w-full h-screen overflow-hidden">

        {/* Header */}
        <div className="mx-8 mt-6 flex justify-between items-center bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm mb-0 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Menu
              size={22}
              className="cursor-pointer md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <h2 className="text-2xl font-semibold text-[#3F3D56] tracking-wide">Dashboard</h2>
          </div>

          <div className="flex items-center gap-5">
            <input
              type="text"
              placeholder="Search events..."
              className="px-5 py-2.5 rounded-full border border-gray-200 outline-none text-sm w-72 bg-[#F6F1EB] transition-all duration-300 placeholder:text-gray-400 focus:border-[#9B96E5] focus:ring-2 focus:ring-[#9B96E5]/20 focus:bg-white"
            />
            <div className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 cursor-pointer transition-all duration-300 hover:bg-[#F6F1EB] hover:text-[#9B96E5] hover:scale-105">
              <Bell size={18} />
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 cursor-pointer transition-all duration-300 hover:bg-[#F6F1EB] hover:text-[#9B96E5] hover:scale-105">
              <MessageSquare size={18} />
            </div>
            <div className="w-10 h-10 bg-[#9B96E5] text-white rounded-full flex items-center justify-center font-semibold text-sm cursor-pointer shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
              {student.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Welcome card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-between items-center transition-all duration-300 hover:shadow-md">
            <div>
              <h1 className="text-3xl font-semibold text-[#3F3D56]">
                Welcome back, {student.name}
              </h1>
              <p className="text-gray-500 mt-2">Here's what's happening in your campus today.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#9B96E5]/30" />
              <div className="w-12 h-12 rounded-full bg-[#F08A6C]/30" />
              <div className="w-12 h-12 rounded-full bg-[#D8E8D1]/40" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-6 mt-8 w-full">
            {stats.map(({ icon, iconBg, trend, positive, value, label }) => (
              <div
                key={label}
                className="rounded-3xl border border-gray-200 p-6 min-h-[160px] flex flex-col justify-between transition-all duration-300 w-full hover:shadow-md hover:-translate-y-1"
                style={{ backgroundColor: "#fcf9f6" }}
              >
                <div className="flex justify-between items-center">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-lg ${iconBg}`}>
                    {icon}
                  </div>
                  <span className={`text-sm font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
                    {trend}
                  </span>
                </div>
                <h2 className="text-3xl font-semibold text-[#3F3D56]">{value}</h2>
                <p className="text-gray-600 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="mt-12" id="upcoming-events">
            <h2 className="text-xl font-semibold text-[#3F3D56] mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <EventCard category="Tech"     title="National Level Hackathon 2026" date="Mar 15, 2026 - 9:00 AM"  location="Main Auditorium"   image={hackathon} />
              <EventCard category="Cultural" title="Annual Cultural Fest – Euphoria" date="Mar 22, 2026 - 5:00 PM" location="Open Air Theater"  image={fest}      />
              <EventCard category="Workshop" title="AI & ML Workshop Series"       date="Mar 28, 2026 - 10:00 AM" location="CS Lab Block B"    image={workshop}  />
            </div>
          </div>

          {/* Registrations + Calendar */}
          <div className="dashboard-bottom-grid mt-8 gap-6">

            {/* My Registrations */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
              <h3 className="font-bold mb-5 text-[#3F3D56]">My Registrations</h3>

              {[
                { title: "National Level Hackathon 2026", sub: "Tech Club • 12 March 2026" },
                { title: "AI Workshop",                   sub: "Innovation Hub • 5 March 2026" },
              ].map(({ title, sub }) => (
                <div key={title} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#3F3D56]">{title}</h4>
                    <p className="text-[13px] text-gray-500">{sub}</p>
                  </div>
                  <span className="bg-[#9B96E5] text-white px-3 py-1.5 rounded-full text-xs">Registered</span>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-[#3F3D56]">Calendar</h3>
                <div className="flex items-center gap-4 font-semibold">
                  <span className="cursor-pointer text-lg">‹</span>
                  <span>March 2026</span>
                  <span className="cursor-pointer text-lg">›</span>
                </div>
              </div>

              {/* Calendar grid — date.dot ::after pseudo kept in index.css */}
              <div className="grid grid-cols-7 gap-3 text-center">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                  <div key={d} className="font-semibold text-[13px] text-gray-500">{d}</div>
                ))}
                <div className="p-2.5 rounded-lg text-sm bg-[#9B96E5] text-white">1</div>
                <div className="p-2.5 rounded-lg text-sm">2</div>
                <div className="p-2.5 rounded-lg text-sm">3</div>
                <div className="p-2.5 rounded-lg text-sm">4</div>
                <div className="cal-dot p-2.5 rounded-lg text-sm relative">5</div>
                <div className="p-2.5 rounded-lg text-sm">6</div>
                <div className="p-2.5 rounded-lg text-sm">7</div>
              </div>
            </div>

          </div>

          {/* Analytics */}
          <div className="w-full mt-10">
            <h2 className="text-xl font-bold text-[#3F3D56] mb-6">Analytics</h2>
            <div className="flex flex-col xl:flex-row w-full gap-6">
              {[
                <ResponsiveContainer width="100%" height={280} key="line">
                  <LineChart data={eventsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" /><YAxis /><Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#9B96E5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>,
                <ResponsiveContainer width="100%" height={280} key="pie">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" innerRadius={70} outerRadius={100}>
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>,
                <ResponsiveContainer width="100%" height={280} key="bar">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" /><YAxis /><Tooltip />
                    <Bar dataKey="events" fill="#9B96E5" />
                    <Bar dataKey="registrations" fill="#EED8D6" />
                  </BarChart>
                </ResponsiveContainer>,
              ].map((chart, i) => (
                <div key={i} className="flex-1 bg-white rounded-xl p-6 shadow-sm min-w-0">
                  {chart}
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="mt-10">
            <h2 className="text-[22px] font-semibold text-[#3F3D56] mb-5">Announcements</h2>
            <div className="announcement-grid gap-5">
              {announcements.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl border border-[#e7e6f0] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base font-semibold text-[#3F3D56]">{item.title}</h4>
                    <span className="text-[13px] text-[#7a7a9d]">{item.date}</span>
                  </div>
                  <p className="text-sm text-[#666680] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}