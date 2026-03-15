import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function AdminNavbar({ title }) {
  return (
    <header className="h-[76px] bg-white border-b border-soft-blush flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10 shadow-sm">
      <h2 className="text-[34px] font-bold text-deep-slate leading-none">{title.replace('-', ' ')}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-slate/40" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="pl-10 pr-4 py-2.5 bg-warm-cream/70 border border-transparent rounded-full text-sm focus:ring-2 focus:ring-lavender w-64 transition-all"
          />
        </div>
        
        <button className="relative p-2 text-deep-slate/60 hover:text-lavender transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-soft-blush">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-deep-slate">Admin User</p>
            <p className="text-xs text-deep-slate/50">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center border-2 border-lavender/30">
            <User className="w-6 h-6 text-lavender" />
          </div>
        </div>
      </div>
    </header>
  );
}
