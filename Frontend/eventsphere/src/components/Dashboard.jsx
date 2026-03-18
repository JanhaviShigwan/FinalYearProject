import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  AlarmClock,
  AlertCircle,
  MapPin,
  ChevronRight,
  Zap,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import {
  getEventLifecycleStatus,
  isEventRegistrationOpen,
} from "../utils/eventStatus";

export default function Dashboard() {

  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const [currentStudent, setCurrentStudent] = useState(() => {
    return JSON.parse(localStorage.getItem("eventSphereStudent")) || {};
  });

  const studentId = useMemo(
    () => currentStudent?._id || currentStudent?.id,
    [currentStudent]
  );

  const needsProfileCompletion =
    currentStudent?.role !== "admin" && !currentStudent?.profileComplete;

  const profileStatus =
    currentStudent?.role === "admin"
      ? "approved"
      : (currentStudent?.profileStatus || (currentStudent?.profileComplete ? "approved" : "pending"));

  // ================= FETCH =================

  useEffect(() => {

    const fetchMyEvents = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/events/student-registrations/${studentId}`
        );
        setMyEvents(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        setAllEvents(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProfileStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/student/${studentId}`);
        setCurrentStudent(res.data || {});
        localStorage.setItem("eventSphereStudent", JSON.stringify(res.data || {}));
      } catch (error) {
        console.error(error);
      }
    };

    let refreshInterval;

    if (studentId) {
      fetchProfileStatus();
      fetchMyEvents();
      fetchAllEvents();

      refreshInterval = setInterval(() => {
        fetchProfileStatus();
        fetchMyEvents();
        fetchAllEvents();
      }, 5000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };

  }, [studentId]);

const upcomingEventsFiltered = allEvents.filter(
  (event) => {
    const status = getEventLifecycleStatus(event);
    const isFuture = status === "upcoming";

    const isRegistered = myEvents.some(
      (e) => e._id === event._id
    );

    const canRegister = isEventRegistrationOpen(event);

    return isFuture && !isRegistered && canRegister;
  }
);

  const ongoingCount = allEvents.filter(
    (event) => getEventLifecycleStatus(event) === "live"
  ).length;

  const fade = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" },
    }),
  };

  const initials = currentStudent?.name
    ? currentStudent.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="flex flex-col gap-7">

      {profileStatus === "pending" && currentStudent?.role !== "admin" && (
        <motion.div
          variants={fade} initial="hidden" animate="visible" custom={0}
          className="rounded-2xl border border-soft-blush bg-white px-6 py-4 text-deep-slate font-semibold"
        >
          Your profile is under review by admin
        </motion.div>
      )}

      {/* ── HERO GREETING ── */}
      <motion.div
        variants={fade} initial="hidden" animate="visible" custom={0}
        className="relative overflow-hidden rounded-3xl bg-lavender p-7 text-white shadow-md"
      >
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-20 bottom-0 w-28 h-28 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-5">
          {/* avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center text-2xl font-extrabold tracking-wide shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-sm font-medium">{todayLabel}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight truncate">
              Hey, {currentStudent?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-white/80 text-sm mt-0.5">
              {ongoingCount > 0
                ? `${ongoingCount} event${ongoingCount > 1 ? "s are" : " is"} happening right now!`
                : "No events happening right now — check what's coming up! "}
            </p>
          </div>

          {needsProfileCompletion && (
            <button
              onClick={() => navigate("/settings")}
              className="shrink-0 flex items-center gap-2 bg-coral hover:bg-coral/90 transition-colors rounded-xl px-6 py-3 text-base font-bold"
            >
              <AlertCircle className="w-4 h-4" />
              Complete Profile
            </button>
          )}
        </div>
      </motion.div>

      {/* ── STAT CHIPS ── */}
      <motion.div
        variants={fade} initial="hidden" animate="visible" custom={1}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { icon: Calendar,   color: "bg-lavender/10 border-lavender/30 text-lavender",    value: myEvents.length,               label: "Registered" },
          { icon: AlarmClock, color: "bg-coral/10 border-coral/30 text-coral",              value: upcomingEventsFiltered.length, label: "Open to Join" },
          { icon: Zap,        color: "bg-pastel-green/20 border-pastel-green/40 text-deep-slate", value: ongoingCount,             label: "Live Now" },
        ].map(({ icon: Icon, color, value, label }) => (
          <div
            key={label}
            className={`flex items-center gap-5 rounded-2xl border px-7 py-6 ${color} bg-opacity-10`}
          >
            <div className="p-3.5 rounded-xl bg-white shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-deep-slate leading-none">{value}</p>
              <p className="text-sm font-semibold text-deep-slate/60 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-col gap-6">

        {/* LEFT — Upcoming Events (wider) */}
        <motion.section
          variants={fade} initial="hidden" animate="visible" custom={2}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-deep-slate flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-lavender" />
              Upcoming Events
            </h2>
            <button
              onClick={() => navigate("/events")}
              className="text-xs font-bold text-lavender flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingEventsFiltered.length === 0 ? (
            <div className="rounded-2xl border border-soft-blush bg-warm-cream px-6 py-10 text-center text-deep-slate/50 text-sm font-medium">
              No upcoming events to display right now.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingEventsFiltered.slice(0, 5).map((event, i) => (
                <motion.div
                  key={event._id}
                  variants={fade} initial="hidden" animate="visible" custom={3 + i * 0.5}
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="flex items-center gap-5 rounded-2xl border border-soft-blush bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  {/* thumbnail */}
                  <div className="w-20 h-18 rounded-xl bg-warm-cream border border-soft-blush overflow-hidden shrink-0">
                    {event.eventImage ? (
                      <img src={event.eventImage} alt={event.eventName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-deep-slate/30">
                        <Calendar className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-deep-slate truncate text-base">{event.eventName}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="inline-flex items-center gap-1.5 text-sm text-deep-slate/60 font-medium">
                        <AlarmClock className="w-3.5 h-3.5" />
                        {event.date} {event.time ? `· ${event.time}` : ""}
                      </span>
                      {event.venue && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-deep-slate/60 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.venue}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-bold px-4 py-2 rounded-lg bg-lavender/10 text-lavender border border-lavender/20 group-hover:bg-lavender group-hover:text-white transition-colors">
                    View
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

    </div>
  );
}