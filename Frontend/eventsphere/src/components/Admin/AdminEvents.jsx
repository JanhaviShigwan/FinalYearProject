import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, Trash2, Eye, Search, Calendar, X, Save, Filter } from 'lucide-react';
import ConfirmPopup from '../popup';

export default function AdminEvents({
  events,
  totalEvents = 0,
  isLoading = false,
  hasMoreEvents = false,
  isLoadingMore = false,
  onLoadMore,
  onEdit,
  onDelete,
  onView,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    eventName: '',
    category: '',
    venue: '',
    date: '',
    time: '',
    eventImage: '',
    shortDescription: '',
    longDescription: '',
    totalCapacity: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');

  const categoryOptions = useMemo(() => {
    const set = new Set(events.map((event) => event.category).filter(Boolean));
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [events]);

  const venueOptions = useMemo(() => {
    const set = new Set(events.map((event) => event.venue).filter(Boolean));
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const resolveEventDate = (event) => {
      const rawDate = event.eventDate || event.date || event.startDate;
      const parsedDate = new Date(rawDate);
      return Number.isNaN(parsedDate.getTime()) ? Number.MAX_SAFE_INTEGER : parsedDate.getTime();
    };

    const base = events.filter((event) => {
      const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;
      const venueMatch = venueFilter === 'all' || event.venue === venueFilter;

      const eventDate = new Date(event.eventDate || event.date || event.startDate);
      eventDate.setHours(0, 0, 0, 0);

      let statusMatch = true;

      if (statusFilter === 'all') {
        statusMatch = eventDate >= today;
      } else if (statusFilter === 'upcoming') {
        statusMatch = eventDate >= today;
      } else if (statusFilter === 'past') {
        statusMatch = eventDate < today;
      }

      return categoryMatch && venueMatch && statusMatch;
    });

    const result = query
      ? base.filter((event) => {
      const name = (event.eventName || event.name || '').toLowerCase();
      const category = (event.category || '').toLowerCase();
      const venue = (event.venue || '').toLowerCase();
      return name.includes(query) || category.includes(query) || venue.includes(query);
      })
      : base;

    return [...result].sort((a, b) => resolveEventDate(a) - resolveEventDate(b));
  }, [events, searchTerm, categoryFilter, venueFilter, statusFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setVenueFilter('all');
    setStatusFilter('all');
  };

  const renderInPortal = (node) => {
    if (typeof document === 'undefined') {
      return null;
    }

    return createPortal(node, document.body);
  };

  const openViewModal = (event) => {
    setSelectedEvent(event);
    setError('');
    if (onView) onView(event);
  };

  const closeViewModal = () => {
    setSelectedEvent(null);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setError('');
    setEditForm({
      eventName: event.eventName || event.name || '',
      category: event.category || 'Workshop',
      venue: event.venue || '',
      date: event.date || '',
      time: event.time || '',
      eventImage: event.eventImage || event.imageUrl || '',
      shortDescription: event.shortDescription || '',
      longDescription: event.longDescription || '',
      totalCapacity: Number(event.totalCapacity || 0),
    });
  };

  const closeEditModal = () => {
    setEditingEvent(null);
    setError('');
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;

    if (!editForm.eventName || !editForm.category || !editForm.venue || !editForm.date || !editForm.time || !editForm.eventImage) {
      setError('Please fill all required fields before saving.');
      return;
    }

    if (!Number.isFinite(Number(editForm.totalCapacity)) || Number(editForm.totalCapacity) <= 0) {
      setError('Total capacity must be a positive number.');
      return;
    }

    if (editForm.endDate) {
      const startDateTime = new Date(`${editForm.date}T00:00:00`);
      const endDateTime = new Date(`${editForm.endDate}T23:59:59`);

      const diffTime = Math.abs(endDateTime - startDateTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        setError('Event duration cannot exceed 7 days.');
        return;
      }

      if (editForm.endDate < editForm.date) {
        setError('End date cannot be earlier than start date.');
        return;
      }
    }

    const payload = {
      ...editForm,
      totalCapacity: Number(editForm.totalCapacity),
    };

    try {
      setIsSaving(true);
      const eventId = editingEvent._id || editingEvent.id;
      await onEdit?.(eventId, payload);
      closeEditModal();
    } catch (err) {
      setError(err.message || 'Failed to update event.');
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (event) => {
    setDeleteTarget(event);
    setError('');
  };

  const closeDeletePopup = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const eventId = deleteTarget._id || deleteTarget.id;

    try {
      setDeletingId(eventId);
      setError('');
      await onDelete?.(eventId);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || 'Failed to delete event.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-4 rounded-2xl border border-soft-blush shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-slate/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event name, category or venue..."
            className="w-full pl-10 pr-4 py-2 bg-warm-cream border-none rounded-xl text-sm focus:ring-2 focus:ring-lavender"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-slate/40" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-warm-cream rounded-xl text-sm border-none focus:ring-2 focus:ring-lavender"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="w-full px-3 py-2 bg-warm-cream rounded-xl text-sm border-none focus:ring-2 focus:ring-lavender"
          >
            {venueOptions.map((venue) => (
              <option key={venue} value={venue}>
                {venue === 'all' ? 'All Venues' : venue}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-warm-cream rounded-xl text-sm border-none focus:ring-2 focus:ring-lavender"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

          <button
            onClick={resetFilters}
            className="w-full px-3 py-2 bg-coral/10 text-coral rounded-xl text-sm font-bold hover:bg-coral/20 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-2xl border border-soft-blush shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-deep-slate/60">
              <div className="text-center">
                <p className="font-semibold">Loading events...</p>
              </div>
            </div>
          ) : (
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
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  const eventId = event._id || event.id;

                  return (
                    <tr key={eventId} className="hover:bg-warm-cream/30 transition-colors group">
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
                            onClick={() => openViewModal(event)}
                            className="p-2 text-deep-slate/40 hover:text-lavender hover:bg-lavender/10 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 text-deep-slate/40 hover:text-coral hover:bg-coral/10 rounded-lg transition-all"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => requestDelete(event)}
                            disabled={deletingId === eventId}
                            className="p-2 text-deep-slate/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
          )}
        </div>
        <div className="p-4 border-t border-soft-blush bg-warm-cream/20 flex items-center justify-between">
          <p className="text-xs text-deep-slate/50 font-medium">Showing {filteredEvents.length} of {totalEvents || events.length} events</p>
        </div>
      </div>

      {hasMoreEvents ? (
        <div className="text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="rounded-full bg-[#9B96E5] px-7 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8A85DC] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Events'}
          </button>
        </div>
      ) : null}

      {selectedEvent ? renderInPortal(
        <div className="fixed inset-0 z-50 bg-deep-slate/45 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-soft-blush shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-soft-blush">
              <h3 className="text-xl font-bold text-deep-slate">Event Details</h3>
              <button onClick={closeViewModal} className="p-2 rounded-lg hover:bg-warm-cream text-deep-slate/60">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm text-deep-slate/75">
              <p><span className="font-bold text-deep-slate">Name:</span> {selectedEvent.eventName}</p>
              <p><span className="font-bold text-deep-slate">Category:</span> {selectedEvent.category}</p>
              <p><span className="font-bold text-deep-slate">Date:</span> {selectedEvent.date}</p>
              <p><span className="font-bold text-deep-slate">Time:</span> {selectedEvent.time}</p>
              <p><span className="font-bold text-deep-slate">Venue:</span> {selectedEvent.venue}</p>
              <p><span className="font-bold text-deep-slate">Capacity:</span> {selectedEvent.totalCapacity}</p>
              <p><span className="font-bold text-deep-slate">Registered:</span> {selectedEvent.registeredUsers || 0}</p>
              <p><span className="font-bold text-deep-slate">Short Description:</span> {selectedEvent.shortDescription}</p>
              <p><span className="font-bold text-deep-slate">Long Description:</span> {selectedEvent.longDescription || 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : null}

      {editingEvent ? renderInPortal(
        <div className="fixed inset-0 z-50 bg-deep-slate/45 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white border border-soft-blush shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-soft-blush">
              <h3 className="text-xl font-bold text-deep-slate">Edit Event</h3>
              <button onClick={closeEditModal} className="p-2 rounded-lg hover:bg-warm-cream text-deep-slate/60">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full rounded-xl bg-warm-cream px-4 py-3" placeholder="Event Name" value={editForm.eventName} onChange={(e) => setEditForm((prev) => ({ ...prev, eventName: e.target.value }))} />
              <input className="w-full rounded-xl bg-warm-cream px-4 py-3" placeholder="Category" value={editForm.category} onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))} />
              <input className="w-full rounded-xl bg-warm-cream px-4 py-3" placeholder="Venue" value={editForm.venue} onChange={(e) => setEditForm((prev) => ({ ...prev, venue: e.target.value }))} />
              <input type="date" className="w-full rounded-xl bg-warm-cream px-4 py-3" value={editForm.date} onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))} />
              <input type="text" className="w-full rounded-xl bg-warm-cream px-4 py-3" placeholder="HH:MM" value={editForm.time} onChange={(e) => setEditForm((prev) => ({ ...prev, time: e.target.value }))} />
              <input type="number" min="1" className="w-full rounded-xl bg-warm-cream px-4 py-3" placeholder="Total Capacity" value={editForm.totalCapacity} onChange={(e) => setEditForm((prev) => ({ ...prev, totalCapacity: e.target.value }))} />
              <input className="md:col-span-2 w-full rounded-xl bg-warm-cream px-4 py-3" placeholder="Image URL" value={editForm.eventImage} onChange={(e) => setEditForm((prev) => ({ ...prev, eventImage: e.target.value }))} />
              <input className="md:col-span-2 w-full rounded-xl bg-warm-cream px-4 py-3" placeholder="Short Description" value={editForm.shortDescription} onChange={(e) => setEditForm((prev) => ({ ...prev, shortDescription: e.target.value }))} />
              <textarea rows={4} className="md:col-span-2 w-full rounded-xl bg-warm-cream px-4 py-3 resize-none" placeholder="Long Description" value={editForm.longDescription} onChange={(e) => setEditForm((prev) => ({ ...prev, longDescription: e.target.value }))} />
            </div>

            <div className="px-6 py-4 border-t border-soft-blush flex justify-end gap-3">
              <button onClick={closeEditModal} className="px-4 py-2 rounded-xl font-semibold text-deep-slate hover:bg-warm-cream">Cancel</button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-coral text-white font-bold hover:bg-coral/90 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmPopup
        open={Boolean(deleteTarget)}
        onClose={closeDeletePopup}
        onConfirm={confirmDelete}
        title="Delete Event"
        description={deleteTarget ? `Delete ${(deleteTarget.eventName || deleteTarget.name || 'this event')}? This cannot be undone.` : ''}
        confirmText={deleteTarget && deletingId === (deleteTarget._id || deleteTarget.id) ? 'Deleting...' : 'Confirm Delete'}
        cancelText="Cancel"
        icon={<Trash2 size={18} />}
      />
    </div>
  );
}
