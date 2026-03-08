import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Search,
  ClipboardList,
  Calendar,
  Megaphone,
  Settings,
  Bell,
  MessageSquare,
  Menu,
  Flame,
  AlarmClock,

} from "lucide-react";

import EventCard from "../components/EventCard";
import logo from "../assets/EventSphereLogo.png";

export default function Dashboard() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // logged in student
 const student = useMemo(() => {
  return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
}, []);

  const [dashboardData, setDashboardData] = useState({
    myRegistrations: [],
    upcomingEventList: [],
    ongoingEvents: [],
  });

  const handleLogout = () => {
    localStorage.removeItem("eventSphereStudent");
    navigate("/");
  };

  useEffect(() => {

  const fetchDashboard = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/dashboard/${student._id}`
      );

      setDashboardData(res.data);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }

  };

  if (student?._id) {
    fetchDashboard();
  }

}, [student]);

  const menuItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", active: true },
    { href: "/events", icon: <Search size={20} />, label: "Browse Events", active: false },
    { href: "/my-registrations", icon: <ClipboardList size={20} />, label: "My Registrations", active: false },
    { href: "/calendar", icon: <Calendar size={20} />, label: "Calendar", active: false },
    { href: "/announcements", icon: <Megaphone size={20} />, label: "Announcements", active: false },
    { href: "/settings", icon: <Settings size={20} />, label: "Settings", active: false },
  ];

  const stats = [
    { icon: <Calendar size={28} color="#9B96E5" />, value: dashboardData.myRegistrations.length, label: "My Registered Events" },
    { icon: <AlarmClock size={28} color="#5ac4eb" />, value: dashboardData.upcomingEventList.length, label: "Upcoming Events" },
    { icon: <Flame size={28} color="#F08A6C" />, value: dashboardData.ongoingEvents.length, label: "Ongoing Events" },
  ];

  return (
    <div className="flex h-screen bg-[#F6F1EB]">

      {/* SIDEBAR */}

      <aside className={`w-72 fixed left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col justify-between p-6 z-40 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        <div>

          <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="EventSphere Logo" className="w-8 h-8 object-contain" />
            <h2 className="text-xl font-semibold text-[#3F3D56]">
              Event<span className="text-[#9B96E5]">Sphere</span>
            </h2>
          </div>

          <nav className="flex flex-col gap-3">
            {menuItems.map(({ href, icon, label, active }) => (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                ${active ? "bg-[#9B96E5]/20 text-[#9B96E5]" : "text-gray-600 hover:bg-[#F6F1EB]"}`}
              >
                {icon}{label}
              </a>
            ))}
          </nav>

        </div>

        <div className="flex flex-col gap-4">

          <div className="flex items-center gap-4 bg-[#F6F1EB] p-4 rounded-2xl border border-gray-100">

            <div className="w-10 h-10 bg-[#9B96E5] text-white rounded-full flex items-center justify-center font-semibold">
              {student?.name?.charAt(0)}
            </div>

            <div>
              <p className="font-semibold text-[#3F3D56]">{student?.name}</p>
              <span className="text-sm text-gray-500">Student</span>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="bg-[#F08A6C] text-white py-2 rounded-xl font-medium hover:bg-[#e67858]"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="md:ml-72 flex flex-col w-full h-screen overflow-hidden">

        {/* HEADER */}

        <div className="mx-8 mt-6 flex justify-between items-center bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm">

          <div className="flex items-center gap-3">
            <Menu
              size={22}
              className="cursor-pointer md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <h2 className="text-2xl font-semibold text-[#3F3D56]">Student Dashboard</h2>
          </div>

          <div className="flex items-center gap-5">

            <input
              type="text"
              placeholder="Search events..."
              className="px-5 py-2 rounded-full border border-gray-200 w-72 bg-[#F6F1EB]"
            />

            <Bell size={18} />
            <MessageSquare size={18} />

            <div className="w-10 h-10 bg-[#9B96E5] text-white rounded-full flex items-center justify-center">
              {student?.name?.charAt(0)}
            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Welcome */}

          <div className="bg-white rounded-2xl border p-8">

            <h1 className="text-3xl font-semibold text-[#3F3D56]">
              Welcome back, {student?.name} ✨
            </h1>

            <p className="text-gray-500 mt-2">
              Explore events happening across campus.
            </p>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">

            {stats.map(({ icon, value, label }) => (

              <div key={label} className="rounded-3xl border p-6 flex flex-col gap-4" style={{ backgroundColor: "#fcf9f6" }}>

                <div className="text-2xl">{icon}</div>

                <h2 className="text-3xl font-semibold text-[#3F3D56]">{value}</h2>

                <p className="text-gray-600">{label}</p>

              </div>

            ))}

          </div>

          {/* Upcoming Events */}

          <div className="mt-12">

            <h2 className="text-xl font-semibold text-[#3F3D56] mb-6">
              Upcoming Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {dashboardData?.upcomingEventList?.map((event) => (

                <EventCard
                  key={event._id}
                  category={event.category}
                  title={event.eventName}
                  date={`${event.date} - ${event.time}`}
                  location={event.venue}
                  image={event.image}
                />

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}