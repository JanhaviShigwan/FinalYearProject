import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PlusCircle,
  ScanLine,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'create-event', label: 'Create Event', icon: PlusCircle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'feedbacks', label: 'Student Feedbacks', icon: MessageSquare },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
    { id: 'scan-attendance', label: 'Scan Attendance', icon: ScanLine },
  ];

  return (
    <aside className="w-[262px] shrink-0 sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-[#292838] via-[#2F2E42] to-[#35344A] border-r border-white/10 text-white flex flex-col shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/0 p-4 backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-lavender/30 bg-lavender/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-lavender">
            <Sparkles className="h-3.5 w-3.5" />
            Admin Console
          </div>

          <h2 className="mt-3 text-[31px] font-extrabold tracking-tight leading-none">
            EventSphere <span className="text-lavender">Admin</span>
          </h2>

          <p className="mt-2 text-xs font-medium text-white/60">
            Manage events, users, reports, and platform activity.
          </p>
        </div>
      </div>

      <nav className="admin-sidebar-scroll px-4 py-5 flex-1 min-h-0 overflow-y-auto pr-2">
        <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
          Navigation
        </p>

        <ul className="space-y-2.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={`${item.id}-${index}`}>
                <motion.button
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl text-left border transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-lavender to-[#7f78d8] text-white border-lavender/40 shadow-[0_14px_30px_rgba(143,138,217,0.45)]'
                      : 'text-white/75 border-transparent hover:text-white hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${
                      activeTab === item.id
                        ? 'border-white/30 bg-white/15'
                        : 'border-white/15 bg-black/15 group-hover:border-white/25 group-hover:bg-white/10'
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                    activeTab === item.id
                      ? 'text-white/90'
                      : 'text-white/35 group-hover:text-white/65 group-hover:translate-x-0.5'
                  }`} />
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-white/10">
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
            <Shield className="w-3.5 h-3.5" />
            Secure Mode
          </p>
          <p className="mt-1 text-xs text-white/65">
            Admin privileges are active for this session.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-white/85 bg-coral/10 border border-coral/20 hover:text-white hover:bg-coral/80 hover:border-coral/70 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
