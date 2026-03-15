import React from 'react';
import { Calendar, Users, ClipboardList, Megaphone, TrendingUp, ArrowUpRight, PlusCircle } from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const stats = [
    { label: 'Total Events', value: '24', icon: Calendar, color: 'bg-lavender', trend: '+12%' },
    { label: 'Total Students', value: '1,240', icon: Users, color: 'bg-coral', trend: '+5%' },
    { label: 'Total Registrations', value: '856', icon: ClipboardList, color: 'bg-pastel-green', trend: '+18%' },
    { label: 'Announcements', value: '12', icon: Megaphone, color: 'bg-soft-blush', trend: '0%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-soft-blush shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-pastel-green bg-pastel-green/10 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-deep-slate/50">{stat.label}</p>
                <h3 className="text-2xl font-bold text-deep-slate mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-soft-blush p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-deep-slate">Recent Event Activity</h3>
            <button className="text-sm text-lavender font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-warm-cream transition-colors border border-transparent hover:border-soft-blush">
                <div className="w-12 h-12 rounded-lg bg-lavender/10 flex items-center justify-center text-lavender font-bold">
                  {i}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-deep-slate">Tech Symposium 2026</h4>
                  <p className="text-sm text-deep-slate/50">New registration from John Doe</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-deep-slate">2 mins ago</p>
                  <p className="text-xs text-pastel-green font-bold">Success</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-soft-blush p-6 shadow-sm">
          <h3 className="text-lg font-bold text-deep-slate mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => onNavigate?.('create-event')}
              className="w-full py-3 px-4 bg-lavender text-white rounded-xl font-bold hover:bg-lavender/90 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Event
            </button>
            <button className="w-full py-3 px-4 bg-white border-2 border-soft-blush text-deep-slate rounded-xl font-bold hover:bg-warm-cream transition-all flex items-center justify-center gap-2">
              <Megaphone className="w-5 h-5 text-coral" />
              Post Announcement
            </button>
            <button className="w-full py-3 px-4 bg-white border-2 border-soft-blush text-deep-slate rounded-xl font-bold hover:bg-warm-cream transition-all flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-pastel-green" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
