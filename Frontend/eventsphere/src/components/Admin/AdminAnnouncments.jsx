import React, { useState } from 'react';
import { Megaphone, Send, Calendar, Trash2, User, Clock } from 'lucide-react';

export default function AdminAnnouncements({ announcements, onPost, onDelete }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) return;
    
    onPost({
      title,
      message,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    
    setTitle('');
    setMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in duration-500">
      {/* Post Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-soft-blush shadow-sm overflow-hidden">
          <div className="bg-coral p-6 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              New Announcement
            </h3>
            <p className="text-white/80 text-sm mt-1">Broadcast important updates to all students.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-deep-slate">Title</label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text" 
                placeholder="e.g. Registration Deadline Extended"
                className="w-full px-4 py-3 bg-warm-cream border-none rounded-xl focus:ring-2 focus:ring-coral transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-deep-slate">Message</label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write your announcement message here..."
                className="w-full px-4 py-3 bg-warm-cream border-none rounded-xl focus:ring-2 focus:ring-coral transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-coral text-white font-bold rounded-xl shadow-lg shadow-coral/20 hover:bg-coral/90 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Post Announcement
            </button>
          </form>
        </div>

        <div className="bg-lavender/10 p-6 rounded-2xl border border-lavender/20">
          <h4 className="font-bold text-lavender flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Pro Tip
          </h4>
          <p className="text-sm text-deep-slate/70 leading-relaxed">
            Announcements are sent as push notifications and emails to all registered students. Keep them concise and clear.
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-deep-slate">Recent Announcements</h3>
          <span className="px-3 py-1 bg-warm-cream text-deep-slate/50 text-xs font-bold rounded-full border border-soft-blush">
            {announcements.length} Total
          </span>
        </div>

        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div key={ann._id} className="bg-white p-6 rounded-2xl border border-soft-blush shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-deep-slate group-hover:text-coral transition-colors">{ann.title}</h4>
                  <button 
                    onClick={() => onDelete(ann._id)}
                    className="p-2 text-deep-slate/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-deep-slate/70 text-sm leading-relaxed mb-4">
                  {ann.message}
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-deep-slate/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(ann.createdAt || ann.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(ann.createdAt || ann.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-16 rounded-2xl border border-dashed border-soft-blush flex flex-col items-center justify-center text-deep-slate/30">
              <Megaphone className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No announcements yet</p>
              <p className="text-sm">Your posts will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
