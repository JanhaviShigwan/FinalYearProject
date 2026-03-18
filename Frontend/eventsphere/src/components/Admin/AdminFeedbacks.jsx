import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  User,
} from 'lucide-react';
import API_URL from '../../api';
import { getAdminRequestConfig } from '../../utils/adminAuth';

// ── Dense feedback card ───────────────────────────────────────────────────────

function FeedbackCard({ feedback }) {
  const studentName = feedback?.userId?.name || 'Unknown Student';
  const studentPhoto = feedback?.userId?.profileImage || '';

  return (
    <div className="bg-white rounded-xl border border-soft-blush px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-soft-blush shrink-0 bg-lavender/10 flex items-center justify-center">
          {studentPhoto ? (
            <img
              src={studentPhoto}
              alt={studentName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-lavender" />
          )}
        </div>
        <p className="text-sm font-bold text-deep-slate line-clamp-1">{studentName}</p>
      </div>

      <div className="flex items-center gap-1 mb-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`w-3.5 h-3.5 ${
              n <= feedback.rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-deep-slate/20'
            }`}
          />
        ))}
      </div>
      {feedback.comment ? (
        <p className="text-sm text-deep-slate/70 leading-snug">{feedback.comment}</p>
      ) : (
        <p className="text-xs text-deep-slate/35 italic">No comment.</p>
      )}
    </div>
  );
}

// ── Feedback list for a single event ─────────────────────────────────────────

function EventFeedbackList({ event, onBack }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/feedback/event/${event._id}`)
      .then((r) => setFeedbacks(Array.isArray(r.data) ? r.data : []))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, [event._id]);

  const avgRating =
    feedbacks.length
      ? parseFloat(
          (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
        )
      : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-deep-slate/60 hover:text-deep-slate transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      {/* Event info card */}
      <div className="rounded-2xl border border-soft-blush bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-deep-slate mb-3">{event.eventName}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-deep-slate/65 font-medium">
          {event.date && (
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-lavender shrink-0" />
              {event.date}
            </span>
          )}
          {event.time && (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-coral shrink-0" />
              {event.time}
            </span>
          )}
          {event.venue && (
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pastel-green shrink-0" />
              {event.venue}
            </span>
          )}
        </div>
        {avgRating !== null && (
          <div className="flex items-center gap-1.5 mt-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-4 h-4 ${
                  n <= Math.round(avgRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-deep-slate/20'
                }`}
              />
            ))}
            <span className="ml-1 text-sm font-semibold text-deep-slate">{avgRating}</span>
            <span className="text-xs text-deep-slate/40 ml-1">({feedbacks.length} response{feedbacks.length !== 1 ? 's' : ''})</span>
          </div>
        )}
      </div>

      {/* Feedback cards */}
      {loading ? (
        <p className="text-sm text-deep-slate/50">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <div className="rounded-2xl border border-soft-blush bg-white px-8 py-12 text-center">
          <p className="text-deep-slate/50 font-medium">No feedback submitted for this event.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {feedbacks.map((f) => (
            <FeedbackCard key={f._id} feedback={f} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Event list ────────────────────────────────────────────────────────────────

export default function AdminFeedbacks() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = () => {
    axios
      .get(`${API_URL}/admin/events-with-feedback`, getAdminRequestConfig())
      .then((r) => setEvents(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  if (selectedEvent) {
    return (
      <EventFeedbackList
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-lavender" />
        <h2 className="text-2xl font-extrabold text-deep-slate">Student Feedbacks</h2>
        {events.length > 0 && (
          <span className="ml-1 px-2.5 py-0.5 rounded-full bg-lavender/15 text-lavender text-sm font-bold">
            {events.length}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-deep-slate/50">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-soft-blush bg-white px-8 py-16 text-center">
          <MessageSquare className="w-10 h-10 text-deep-slate/20 mx-auto mb-3" />
          <p className="text-deep-slate/50 font-medium">No feedback has been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-2xl border border-soft-blush p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-base font-extrabold text-deep-slate line-clamp-2 mb-3">
                {event.eventName}
              </h3>
              <div className="flex flex-col gap-2 text-sm text-deep-slate/65 font-medium">
                {event.date && (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-lavender shrink-0" />
                    {event.date}
                  </span>
                )}
                {event.time && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-coral shrink-0" />
                    {event.time}
                  </span>
                )}
                {event.venue && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pastel-green shrink-0" />
                    {event.venue}
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-semibold text-lavender">View Feedbacks</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
