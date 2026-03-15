import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Megaphone,
  PlusCircle,
  TrendingUp,
  Settings,
  Users,
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'create-event', label: 'Create Event', icon: PlusCircle },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
    { id: 'reports', label: 'Reports', icon: FileCheck2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[248px] shrink-0 sticky top-0 h-screen overflow-y-hidden bg-gradient-to-b from-[#3F3D56] to-[#35344A] border-r border-white/10 text-white flex flex-col">
      <div className="px-6 py-7 border-b border-white/10">
        <h2 className="text-[30px] font-extrabold tracking-tight leading-none">
          EventSphere <span className="text-lavender">Admin</span>
        </h2>
      </div>

      <nav className="px-4 py-6 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={`${item.id}-${index}`}>
                <motion.button
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-lavender text-white shadow-[0_12px_25px_rgba(143,138,217,0.35)]'
                      : 'text-white/70 hover:text-coral hover:bg-coral/15'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-white/80 hover:text-coral hover:bg-coral/15 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
