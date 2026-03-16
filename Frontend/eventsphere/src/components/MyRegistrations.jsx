import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import ConfirmPopup from "./popup";
import {
  CalendarDays,
  Clock,
  MapPin,
  QrCode,
  X,
  Ticket,
} from "lucide-react";
import API_URL from "../api";

export default function MyRegistrations() {
  const [myEvents, setMyEvents] = useState([]);
  const [qrEvent, setQrEvent] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelError, setCancelError] = useState("");

  const student = JSON.parse(localStorage.getItem("eventSphereStudent"));

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/events/student-registrations/${student._id}`
        );
        setMyEvents(res.data);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    if (!student?._id) {
      return undefined;
    }

    fetchMyEvents();

    const refreshInterval = setInterval(() => {
      fetchMyEvents();
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, [student?._id]);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      await axios.delete(
        `${API_URL}/events/cancel-registration/${student._id}/${cancelTarget}`
      );
      setMyEvents((prev) => prev.filter((e) => e._id !== cancelTarget));
      setCancelTarget(null);
      setCancelError("");
    } catch (error) {
      console.error("Cancel registration error:", error);
      setCancelError(
        error.response?.status === 404
          ? "Registration not found. It may have already been cancelled."
          : "Failed to cancel registration. Please try again."
      );
    }
  };

  const qrValue = qrEvent
    ? JSON.stringify({
        studentId: student?._id,
        studentName: student?.name,
        eventId: qrEvent._id,
        eventName: qrEvent.eventName,
        date: qrEvent.date,
        venue: qrEvent.venue,
      })
    : "";

  const isUpcoming = (dateStr) => new Date(dateStr) >= new Date();

  const fade = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.3 } }),
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Ticket className="w-6 h-6 text-lavender" />
        <h2 className="text-2xl font-extrabold text-deep-slate">My Registered Events</h2>
        {myEvents.length > 0 && (
          <span className="ml-1 px-2.5 py-0.5 rounded-full bg-lavender/15 text-lavender text-sm font-bold">
            {myEvents.length}
          </span>
        )}
      </div>

      {/* Empty state */}
      {myEvents.length === 0 ? (
        <div className="rounded-2xl border border-soft-blush bg-white px-8 py-16 text-center">
          <Ticket className="w-10 h-10 text-deep-slate/20 mx-auto mb-3" />
          <p className="text-deep-slate/50 font-medium">You haven't registered for any events yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {myEvents.map((event, i) => {
            const upcoming = isUpcoming(event.date);
            return (
              <motion.div
                key={event._id}
                variants={fade} initial="hidden" animate="visible" custom={i}
                className="bg-white rounded-2xl border border-soft-blush overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col min-h-[430px]"
              >
                {/* Event image / banner */}
                <div className="relative h-40 bg-warm-cream border-b border-soft-blush overflow-hidden">
                  {event.eventImage ? (
                    <img
                      src={event.eventImage}
                      alt={event.eventName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Ticket className="w-10 h-10 text-deep-slate/20" />
                    </div>
                  )}
                  {/* Status badge */}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                    upcoming
                      ? "bg-pastel-green/90 text-deep-slate"
                      : "bg-deep-slate/70 text-white"
                  }`}>
                    {upcoming ? "Upcoming" : "Ended"}
                  </span>
                </div>

                {/* Details */}
                <div className="p-7 flex flex-col gap-5 flex-1">
                  <h3 className="text-xl font-extrabold text-deep-slate leading-snug line-clamp-2">
                    {event.eventName}
                  </h3>

                  <div className="flex flex-col gap-3 text-base text-deep-slate/65 font-medium">
                    <span className="flex items-center gap-2.5">
                      <CalendarDays className="w-4.5 h-4.5 text-lavender shrink-0" />
                      {event.date}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-2.5">
                        <Clock className="w-4.5 h-4.5 text-coral shrink-0" />
                        {event.time}
                      </span>
                    )}
                    {event.venue && (
                      <span className="flex items-center gap-2.5">
                        <MapPin className="w-4.5 h-4.5 text-pastel-green shrink-0" />
                        {event.venue}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-5 flex gap-3">
                    <button
                      onClick={() => setQrEvent(event)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-lavender/30 bg-lavender/10 text-lavender text-base font-bold hover:bg-lavender hover:text-white transition-colors"
                    >
                      <QrCode className="w-4.5 h-4.5" />
                      View QR
                    </button>
                    <button
                      onClick={() => setCancelTarget(event._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-coral/30 bg-coral/10 text-coral text-base font-bold hover:bg-coral hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {qrEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setQrEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-deep-slate">Your Entry Pass</h3>
                <button
                  onClick={() => setQrEvent(null)}
                  className="p-1.5 rounded-lg hover:bg-warm-cream transition-colors"
                >
                  <X className="w-5 h-5 text-deep-slate/50" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-warm-cream border border-soft-blush">
                <QRCodeSVG value={qrValue} size={200} fgColor="#3F3D56" bgColor="transparent" level="M" />
              </div>

              <div className="w-full text-center">
                <p className="font-extrabold text-deep-slate text-base">{qrEvent.eventName}</p>
                <p className="text-sm text-deep-slate/55 mt-1">{qrEvent.date}{qrEvent.time ? ` · ${qrEvent.time}` : ""}</p>
                {qrEvent.venue && <p className="text-sm text-deep-slate/55">{qrEvent.venue}</p>}
              </div>

              <div className="w-full rounded-xl bg-lavender/10 border border-lavender/20 px-4 py-3 text-center">
                <p className="text-xs text-lavender font-semibold">{student?.name}</p>
                <p className="text-xs text-deep-slate/40 mt-0.5">Show this QR at the event entrance</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {cancelError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {cancelError}
        </div>
      ) : null}

      <ConfirmPopup
        open={Boolean(cancelTarget)}
        onClose={() => {
          setCancelTarget(null);
          setCancelError("");
        }}
        onConfirm={confirmCancel}
        title="Cancel Registration"
        description="This action cannot be undone. Your spot will be released."
        confirmText="Yes, Cancel"
        cancelText="Keep It"
      />

    </div>
  );
}
