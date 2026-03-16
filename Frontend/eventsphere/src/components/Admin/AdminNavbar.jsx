import React from 'react';
import { User } from 'lucide-react';

export default function AdminNavbar({ title }) {
  return (
    <header className="h-[76px] bg-white border-b border-soft-blush flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10 shadow-sm">
      <h2 className="text-[34px] font-bold text-deep-slate leading-none">{title.replace('-', ' ')}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block invisible" aria-hidden="true">
          <div className="w-64 h-[42px]" />
        </div>
        
        <div className="p-2 invisible" aria-hidden="true">
          <div className="w-5 h-5" />
        </div>
        
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
