import React from 'react';
import { Edit2, Trash2, Eye, Search, Filter, Calendar } from 'lucide-react';

export default function AdminEvents({ events, onEdit, onDelete, onView }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-4 rounded-2xl border border-soft-blush shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-slate/40" />
          <input 
            type="text" 
            placeholder="Search by event name, category or venue..." 
            className="w-full pl-10 pr-4 py-2 bg-warm-cream border-none rounded-xl text-sm focus:ring-2 focus:ring-lavender"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-warm-cream text-deep-slate rounded-xl text-sm font-bold hover:bg-soft-blush transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-lavender text-white rounded-xl text-sm font-bold hover:bg-lavender/90 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-soft-blush shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-cream/50 border-b border-soft-blush">
                <th className="px-6 py-4 text-xs font-bold text-deep-slate/50 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-4 text-xs font-bold text-deep-slate/50 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-deep-slate/50 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-deep-slate/50 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-4 text-xs font-bold text-deep-slate/50 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-blush">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event._id || event.id} className="hover:bg-warm-cream/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-lavender/10 flex items-center justify-center overflow-hidden">
                          {event.eventImage || event.imageUrl ? (
                            <img src={event.eventImage || event.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Calendar className="w-5 h-5 text-lavender" />
                          )}
                        </div>
                        <span className="font-bold text-deep-slate">{event.eventName || event.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-deep-slate/70">
                      {event.date || event.startDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-lavender/10 text-lavender text-xs font-bold rounded-full">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-deep-slate/70">
                      {event.venue}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onView(event)}
                          className="p-2 text-deep-slate/40 hover:text-lavender hover:bg-lavender/10 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onEdit(event)}
                          className="p-2 text-deep-slate/40 hover:text-coral hover:bg-coral/10 rounded-lg transition-all"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(event._id || event.id)}
                          className="p-2 text-deep-slate/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-deep-slate/40">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-12 h-12 opacity-20" />
                      <p>No events found. Create one to get started!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-soft-blush bg-warm-cream/20 flex items-center justify-between">
          <p className="text-xs text-deep-slate/50 font-medium">Showing {events.length} events</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-soft-blush rounded-lg text-xs font-bold disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-soft-blush rounded-lg text-xs font-bold disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
