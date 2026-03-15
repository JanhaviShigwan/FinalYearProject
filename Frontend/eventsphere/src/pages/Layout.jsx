import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import {
    LayoutDashboard,
    Search,
    ClipboardList,
    Calendar,
    Settings,
    Menu,
    Bell,
    User,
} from "lucide-react";

import logo from "../assets/EventSphereLogo.png";

export default function MainLayout() {

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const location = useLocation();

    const student = useMemo(() => {
        return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
    }, []);

    const pageLabels = {
        "/dashboard": "Dashboard",
        "/events": "Browse Events",
        "/my-registrations": "My Registrations",
        "/calendar": "Calendar",
        "/settings": "Settings",
    };

    const pageTitle = pageLabels[location.pathname] ?? "EventSphere";

    const handleLogout = () => {
        localStorage.removeItem("eventSphereStudent");
        navigate("/");
    };

    const menuItems = [

        {
            href: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
        },

        {
            href: "/events",
            icon: <Search size={20} />,
            label: "Browse Events",
        },

        {
            href: "/my-registrations",
            icon: <ClipboardList size={20} />,
            label: "My Registrations",
        },

        {
            href: "/calendar",
            icon: <Calendar size={20} />,
            label: "Calendar",
        },

        {
            href: "/settings",
            icon: <Settings size={20} />,
            label: "Settings",
        },

    ];

    return (

        <div className="flex h-screen bg-[#F6F1EB]">

            {/* SIDEBAR */}

            <aside
                className={`w-72 fixed left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col justify-between p-6 z-40 transition-transform duration-300 md:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >

                <div>

                    <div className="flex items-center gap-3 mb-10">

                        <img
                            src={logo}
                            alt="EventSphere Logo"
                            className="w-8 h-8 object-contain"
                        />

                        <h2 className="text-xl font-bold text-[#3F3D56]">
                            Event
                            <span className="text-[#9B96E5]">
                                Sphere
                            </span>
                        </h2>

                    </div>


                    <nav className="flex flex-col gap-2">

                        {menuItems.map(
                            ({ href, icon, label }) => (

                                <NavLink
                                    key={label}
                                    to={href}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                                        ${isActive
                                            ? "bg-[#9B96E5]/20 text-[#9B96E5]"
                                            : "text-gray-600 hover:bg-[#F6F1EB]"
                                        }`
                                    }
                                >

                                    {icon}

                                    {label}

                                </NavLink>

                            )
                        )}

                    </nav>

                </div>


                {/* USER */}

                <div className="flex flex-col gap-4">

                    <div className="flex items-center gap-4 bg-[#F6F1EB] p-4 rounded-2xl border border-gray-100">

                        <div className="w-10 h-10 bg-[#9B96E5] text-white rounded-full flex items-center justify-center font-semibold shrink-0">
                            {student?.name?.charAt(0)}
                        </div>

                        <div className="min-w-0">
                            <p className="font-semibold text-[#3F3D56] truncate">
                                {student?.name}
                            </p>
                            <span className="text-sm text-gray-500">
                                Student
                            </span>
                        </div>

                    </div>


                    {/* BACK TO HOME BUTTON */}

                    <button
                        onClick={() => navigate("/")}
                        className="border border-[#F08A6C] text-[#F08A6C] py-2 rounded-xl font-medium hover:bg-[#e67858] hover:text-white transition"
                    >
                        Back to Home
                    </button>


                    {/* LOGOUT */}

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

                {/* NAVBAR */}

                <header className="h-[76px] bg-[#EDE5D8] border-b border-[#d9cfc2] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10 shadow-sm">

                    {/* Left — page title */}
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 rounded-xl hover:bg-[#ede6dc] transition-colors md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu size={20} className="text-[#3F3D56]" />
                        </button>
                        <h2 className="text-[28px] font-bold text-[#3F3D56] leading-none capitalize">{pageTitle}</h2>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-6">

                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3F3D56]/40" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-[#e8e0d5] rounded-full text-sm text-[#3F3D56] placeholder-[#3F3D56]/40 focus:outline-none focus:ring-2 focus:ring-[#9B96E5]/40 w-64 transition-all"
                            />
                        </div>

                        {/* Bell */}
                        <button className="relative p-2 text-[#3F3D56]/60 hover:text-[#9B96E5] transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F08A6C] rounded-full border-2 border-[#F6F1EB]" />
                        </button>

                        {/* User chip */}
                        <div
                            className="flex items-center gap-3 pl-4 border-l border-[#e8e0d5] cursor-pointer"
                            onClick={() => navigate("/settings")}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#3F3D56]">{student?.name || "Student"}</p>
                                <p className="text-xs text-[#3F3D56]/50">Student</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#9B96E5]/20 flex items-center justify-center border-2 border-[#9B96E5]/30">
                                <User className="w-6 h-6 text-[#9B96E5]" />
                            </div>
                        </div>

                    </div>

                </header>


                {/* PAGE */}

                <div className="flex-1 overflow-y-auto px-8 py-6">

                    <Outlet />

                </div>

            </main>

        </div>

    );

}