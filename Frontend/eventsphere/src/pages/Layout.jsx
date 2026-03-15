import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState, useMemo } from "react";
import {
    LayoutDashboard,
    Search,
    ClipboardList,
    Calendar,
    Settings,
    Bell,
    MessageSquare,
    Menu,
} from "lucide-react";

import logo from "../assets/EventSphereLogo.png";

export default function MainLayout() {

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const student = useMemo(() => {
        return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
    }, []);

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

                        <h2 className="text-xl font-semibold text-[#3F3D56]">
                            Event
                            <span className="text-[#9B96E5]">
                                Sphere
                            </span>
                        </h2>

                    </div>


                    <nav className="flex flex-col gap-3">

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

                        <div className="w-10 h-10 bg-[#9B96E5] text-white rounded-full flex items-center justify-center font-semibold">
                            {student?.name?.charAt(0)}
                        </div>

                        <div>
                            <p className="font-semibold text-[#3F3D56]">
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

                <div className="mx-8 mt-6 flex justify-between items-center bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm">

                    <div className="flex items-center gap-3">

                        <Menu
                            size={22}
                            className="cursor-pointer md:hidden"
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                        />

                        <h2 className="text-2xl font-semibold text-[#3F3D56]">
                            EventSphere
                        </h2>

                    </div>

                    <div className="flex items-center gap-5">

                        <div className="w-10 h-10 bg-[#9B96E5] text-white rounded-full flex items-center justify-center">
                            {student?.name?.charAt(0)}
                        </div>

                    </div>

                </div>


                {/* PAGE */}

                <div className="flex-1 overflow-y-auto px-8 py-6">

                    <Outlet />

                </div>

            </main>

        </div>

    );

}