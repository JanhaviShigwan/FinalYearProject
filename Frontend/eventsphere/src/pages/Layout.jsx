import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import {
    LayoutDashboard,
    Search,
    ClipboardList,
    Calendar,
    Settings,
    Menu,
    User,
    Home,
    LogOut,
    ChevronRight,
    Sparkles,
} from "lucide-react";

import logo from "../assets/EventSphereLogo.png";
import API_URL from "../api";

export default function MainLayout() {

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const location = useLocation();

    const [student, setStudent] = useState(() => {
        return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
    });

    const studentId = useMemo(
        () => student?._id || student?.id,
        [student]
    );

    useEffect(() => {
        if (!studentId) return undefined;

        const fetchLatestStudent = async () => {
            try {
                const res = await fetch(`${API_URL}/student/${studentId}`);

                if (!res.ok) {
                    return;
                }

                const latestStudent = await res.json();

                setStudent(latestStudent || {});
                localStorage.setItem(
                    "eventSphereStudent",
                    JSON.stringify(latestStudent || {})
                );
            } catch (error) {
                console.error("Layout student refresh error:", error);
            }
        };

        fetchLatestStudent();

        const intervalId = setInterval(() => {
            fetchLatestStudent();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [studentId]);

    const pageLabels = {
        "/dashboard": "Dashboard",
        "/events": "Browse Events",
        "/my-registrations": "My Registrations",
        "/calendar": "Calendar",
        "/settings": "Settings",
    };

    const pageTitle = pageLabels[location.pathname] ?? "EventSphere";
    const initials = student?.name?.charAt(0)?.toUpperCase() || "S";

    const handleLogout = () => {
        localStorage.removeItem("eventSphereStudent");
        navigate("/");
    };

    const menuItems = [

        {
            href: "/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
        },

        {
            href: "/events",
            icon: Search,
            label: "Browse Events",
        },

        {
            href: "/my-registrations",
            icon: ClipboardList,
            label: "My Registrations",
        },

        {
            href: "/calendar",
            icon: Calendar,
            label: "Calendar",
        },

        {
            href: "/settings",
            icon: Settings,
            label: "Settings",
        },

    ];

    return (

        <div className="flex h-screen bg-[#F6F1EB]">

            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-[#3F3D56]/25 backdrop-blur-[1px] md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                />
            )}

            {/* SIDEBAR */}

            <aside
                className={`w-72 fixed left-0 top-0 h-full bg-[#FFFCF8] border-r border-[#eadfd2] flex flex-col justify-between p-6 z-40 transition-transform duration-300 md:translate-x-0 shadow-[0_12px_32px_rgba(63,61,86,0.08)]
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >

                <div>

                    <div className="mb-7 rounded-3xl border border-[#eadfd2] bg-gradient-to-br from-white via-[#fff9f2] to-[#f8f1e8] p-4 shadow-sm">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lavender/20 bg-lavender/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-lavender">
                            <Sparkles className="h-3.5 w-3.5" />
                            Student Panel
                        </div>

                        <div className="flex items-center gap-3">

                            <div className="h-11 w-11 rounded-2xl bg-white shadow-[0_8px_16px_rgba(155,150,229,0.25)] border border-lavender/15 flex items-center justify-center">
                                <img
                                    src={logo}
                                    alt="EventSphere Logo"
                                    className="w-7 h-7 object-contain"
                                />
                            </div>

                            <div>
                                <h2 className="text-[22px] font-extrabold tracking-tight text-[#3F3D56] leading-none">
                                    Event
                                    <span className="text-[#9B96E5]">
                                        Sphere
                                    </span>
                                </h2>
                                <p className="mt-1 text-xs font-medium text-[#3F3D56]/55">
                                    Discover, register, and stay updated
                                </p>
                            </div>

                        </div>

                    </div>


                    <nav className="flex flex-col gap-2.5">

                        {menuItems.map(
                            ({ href, icon: Icon, label }) => (

                                <NavLink
                                    key={label}
                                    to={href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 border
                                        ${isActive
                                            ? "bg-gradient-to-r from-[#9B96E5]/20 to-[#F08A6C]/12 text-[#3F3D56] border-lavender/20 shadow-[0_10px_24px_rgba(155,150,229,0.22)]"
                                            : "text-[#3F3D56]/70 border-transparent hover:bg-white hover:border-[#eadfd2] hover:text-[#3F3D56]"
                                        }`
                                    }
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 border border-[#eadfd2] text-[#9B96E5] transition-colors group-hover:border-lavender/25 group-hover:bg-lavender/10">
                                            <Icon size={18} />
                                        </span>

                                        {label}

                                    </div>

                                    <ChevronRight className="h-4 w-4 text-[#3F3D56]/30 transition-transform duration-300 group-hover:translate-x-0.5" />

                                </NavLink>

                            )
                        )}

                    </nav>

                </div>


                {/* USER */}

                <div className="flex flex-col gap-4">

                    <div className="flex items-center gap-4 bg-gradient-to-r from-white to-[#f8f2e9] p-4 rounded-2xl border border-[#eadfd2] shadow-sm">

                        <div className="w-11 h-11 bg-[#9B96E5] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-[0_8px_18px_rgba(155,150,229,0.35)]">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <p className="font-bold text-[#3F3D56] truncate">
                                {student?.name || "Student"}
                            </p>
                            <span className="text-sm text-[#3F3D56]/60">
                                Student
                            </span>
                            <p className="text-xs text-[#3F3D56]/45 truncate mt-0.5">
                                {student?.email || "student@somaiya.edu"}
                            </p>
                        </div>

                    </div>


                    {/* BACK TO HOME BUTTON */}

                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center justify-center gap-2 border border-[#F08A6C]/40 text-[#E57A58] py-2.5 rounded-xl font-semibold bg-white hover:bg-[#F08A6C] hover:text-white transition"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
                    </button>


                    {/* LOGOUT */}

                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F08A6C] to-[#E87654] text-white py-2.5 rounded-xl font-semibold hover:brightness-95"
                    >
                        <LogOut className="h-4 w-4" />
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
                        <div className="relative hidden md:block invisible" aria-hidden="true">
                            <div className="w-64 h-[42px]" />
                        </div>

                        {/* Bell */}
                        <div className="p-2 invisible" aria-hidden="true">
                            <div className="w-5 h-5" />
                        </div>

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