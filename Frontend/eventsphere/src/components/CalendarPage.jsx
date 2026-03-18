import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
    CalendarDays,
    Clock3,
    MapPin,
    Sparkles,
    Ticket,
    X,
    ChevronRight,
    CalendarRange,
} from "lucide-react";

import EventCard from "./EventCard";

const formatLongDate = (dateValue) => {
    if (!dateValue) return "No date";

    return new Date(dateValue).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export default function CalendarPage() {

    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateLabel, setSelectedDateLabel] = useState("Next Up");
    const [modalEvent, setModalEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    const fetchEvents = useCallback(async ({ silent = false } = {}) => {

        try {
            if (!silent) {
                setIsLoading(true);
            }

            const res = await axios.get(
                `${API_URL}/events`
            );

            /* ── Helper: Check if event registration is available ── */
            const isRegistrationAvailable = (event) => {
                const now = new Date();
                const eventStart = new Date(`${event.date} ${event.time || "00:00"}`);
                const registrationOpenDate = new Date(eventStart);
                registrationOpenDate.setDate(eventStart.getDate() - 14);

                const eventEnd = new Date(eventStart);
                eventEnd.setHours(eventStart.getHours() + 3);

                return now >= registrationOpenDate && now <= eventEnd;
            };

            /* ── Helper: Generate random registrations if available ── */
            const getRegistrationCount = (event) => {
                if (!isRegistrationAvailable(event)) {
                    return 0;
                }

                const capacity = event.totalCapacity || 1;
                const maxRegistrations = Math.max(0, capacity - 1);
                return Math.floor(Math.random() * (maxRegistrations + 1));
            };

            const formatted = res.data
                .map(event => ({
                    isPast: event.date < today,
                    ...event,
                    registeredUsers: getRegistrationCount(event)
                }))
                .sort((left, right) => new Date(left.date) - new Date(right.date))
                .map((event) => ({

                    id: event._id,
                    title: event.eventName,
                    start: event.date,
                    backgroundColor: event.isPast ? "#9CA3AF" : "#9B96E5",
                    borderColor: event.isPast ? "#9CA3AF" : "#9B96E5",
                    textColor: "#ffffff",
                    extendedProps: event,

                }));

            setEvents(formatted);

            const firstUpcomingDate = formatted.find((item) => !item.extendedProps?.isPast)?.start;
            const activeDate = selectedDate || firstUpcomingDate || formatted[0]?.start;

            if (activeDate) {
                const sameDayEvents = formatted
                    .filter((event) => event.start === activeDate)
                    .map((event) => event.extendedProps);

                setSelectedEvents(sameDayEvents);
                setSelectedDate(activeDate);
                setSelectedDateLabel(formatLongDate(activeDate));
            } else {
                setSelectedEvents([]);
                setSelectedDate(null);
                setSelectedDateLabel("No events available");
            }
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            setEvents([]);
            setSelectedEvents([]);
            setSelectedDate(null);
            setSelectedDateLabel("Unable to load events");
        } finally {
            if (!silent) {
                setIsLoading(false);
            }
        }

    }, [selectedDate, today]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            fetchEvents({ silent: true });
        }, 30000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchEvents({ silent: true });
            }
        };

        window.addEventListener("focus", handleVisibilityChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("focus", handleVisibilityChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchEvents]);

    const handleDateClick = (info) => {

        const list = events.filter(
            (event) => event.start === info.dateStr
        );

        setSelectedDate(info.dateStr);
        setSelectedEvents(
            list.map((event) => event.extendedProps)
        );
        setSelectedDateLabel(formatLongDate(info.dateStr));

    };

    const handleEventClick = (info) => {

        setModalEvent(
            info.event.extendedProps
        );

    };

    const upcomingCount = events.filter((event) => !event.extendedProps?.isPast).length;

    const thisMonthCount = useMemo(() => {
        const now = new Date();

        return events.filter((event) => {
            const eventDate = new Date(event.start);

            return (
                eventDate.getMonth() === now.getMonth() &&
                eventDate.getFullYear() === now.getFullYear()
            );
        }).length;
    }, [events]);

    const nextEvent = events.find((item) => !item.extendedProps?.isPast)?.extendedProps || null;

    return (

        <div className="flex flex-col gap-6">

            <style>{`
        .fc {
          font-family: inherit;
        }

        .fc .fc-toolbar {
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
        }

        .fc .fc-toolbar-title {
          color: #3F3D56;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          min-width: 0;
          flex-shrink: 0;
        }

        .fc .fc-button {
          background: #f6f1eb;
          border: 1px solid #eadfd1;
          color: #3F3D56;
          border-radius: 999px;
          padding: 0.55rem 0.95rem;
          box-shadow: none;
          text-transform: capitalize;
          font-weight: 700;
          flex-wrap: wrap;
        }

        .fc .fc-button:hover {
          background: #ede5d8;
          border-color: #dccdb8;
          color: #3F3D56;
        }

        .fc .fc-button-active {
          background: #9B96E5 !important;
          border-color: #9B96E5 !important;
          color: white !important;
        }

        .fc .fc-daygrid-day,
        .fc .fc-timegrid-slot,
        .fc .fc-col-header-cell {
          border-color: #efe5da;
          overflow: hidden;
        }

        .fc .fc-scrollgrid {
          border-radius: 22px;
          overflow: hidden;
          border-color: #efe5da;
        }

        .fc .fc-col-header-cell {
          background: #fbf8f4;
          padding: 10px 4px;
          text-align: center;
        }

        .fc .fc-col-header-cell-cushion {
          color: #6b6a7d;
          font-weight: 700;
          text-decoration: none;
          padding: 8px 4px;
        }

        .fc .fc-daygrid-day-number,
        .fc .fc-timegrid-axis-cushion,
        .fc .fc-timegrid-slot-label-cushion {
          color: #6b6a7d;
          text-decoration: none;
          font-weight: 600;
          padding: 8px 4px;
        }

        .fc .fc-day-today {
          background: rgba(155, 150, 229, 0.09) !important;
        }

        .fc .fc-day-past {
          background: #f7f4ef !important;
          opacity: 0.65;
        }

        .fc .fc-event {
          border-radius: 10px;
          padding: 2px 6px;
          font-weight: 700;
          font-size: 0.82rem;
          margin: 0 2px;
        }

        .fc .fc-daygrid-day-frame {
          position: relative;
          min-height: 120px;
        }

        .fc .fc-list-event:hover td,
        .fc .fc-daygrid-event:hover {
          filter: brightness(0.96);
        }
      `}</style>

            <section className="relative overflow-hidden rounded-[28px] border border-soft-blush bg-white p-7 shadow-sm">
                <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-lavender/10" />
                <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-20 rounded-full bg-coral/10" />

                <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-lavender/20 bg-lavender/10 px-3 py-1 text-sm font-bold text-lavender">
                            <Sparkles className="h-4 w-4" />
                            Plan your campus week
                        </div>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-deep-slate md:text-4xl">
                            Calendar at a glance
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-deep-slate/60 md:text-base">
                            Browse all upcoming events, switch between month and week views, and preview what is happening on each day before you register.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-soft-blush bg-warm-cream px-5 py-4">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-deep-slate/45">Upcoming</p>
                            <p className="mt-2 text-3xl font-extrabold text-deep-slate">{upcomingCount}</p>
                            <p className="mt-1 text-sm text-deep-slate/55">events on the calendar</p>
                        </div>
                        <div className="rounded-2xl border border-soft-blush bg-white px-5 py-4">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-deep-slate/45">This Month</p>
                            <p className="mt-2 text-3xl font-extrabold text-lavender">{thisMonthCount}</p>
                            <p className="mt-1 text-sm text-deep-slate/55">scheduled this month</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-[28px] border border-soft-blush bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-2xl font-extrabold text-deep-slate">Event Calendar</h3>
                            <p className="mt-1 text-sm text-deep-slate/55">
                                Click a date to see the events scheduled for that day.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-warm-cream px-3 py-1.5 text-sm font-semibold text-deep-slate/65">
                            <CalendarRange className="h-4 w-4 text-lavender" />
                            {selectedDateLabel}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-[620px] items-center justify-center rounded-[24px] border border-soft-blush bg-warm-cream text-base font-semibold text-deep-slate/50">
                            Loading calendar...
                        </div>
                    ) : (
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            editable={false}
                            selectable
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            dayMaxEvents={2}
                            height={620}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,listWeek",
                            }}
                            buttonText={{
                                today: "Today",
                                month: "Month",
                                week: "Week",
                                list: "Agenda",
                            }}
                        />
                    )}
                </div>

                <aside className="flex flex-col gap-4">
                    <div className="rounded-[28px] border border-soft-blush bg-white p-6 shadow-sm">
                        <div className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1 text-sm font-bold text-coral">
                            <Ticket className="h-4 w-4" />
                            Spotlight
                        </div>

                        {nextEvent ? (
                            <>
                                <h3 className="mt-4 text-xl font-extrabold leading-snug text-deep-slate">
                                    {nextEvent.eventName}
                                </h3>
                                <div className="mt-4 space-y-2 text-sm text-deep-slate/60">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-lavender" />
                                        {formatLongDate(nextEvent.date)}
                                    </div>
                                    {nextEvent.time ? (
                                        <div className="flex items-center gap-2">
                                            <Clock3 className="h-4 w-4 text-coral" />
                                            {nextEvent.time}
                                        </div>
                                    ) : null}
                                    {nextEvent.venue ? (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-pastel-green" />
                                            {nextEvent.venue}
                                        </div>
                                    ) : null}
                                </div>
                                <p className="mt-4 text-sm leading-6 text-deep-slate/55">
                                    {nextEvent.shortDescription || "Open the event to view full details and registration information."}
                                </p>
                                <Link
                                    to={`/events/${nextEvent._id}`}
                                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-deep-slate px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-lavender"
                                >
                                    Open event
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </>
                        ) : (
                            <div className="mt-4 rounded-2xl bg-warm-cream px-4 py-8 text-center text-sm font-medium text-deep-slate/50">
                                No upcoming events to highlight yet.
                            </div>
                        )}
                    </div>

                    <div className="rounded-[28px] border border-soft-blush bg-warm-cream p-6 shadow-sm">
                        <h3 className="text-lg font-extrabold text-deep-slate">How to use</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-deep-slate/60">
                            <p>Click any future date to preview the events scheduled for that day.</p>
                            <p>Switch to week or agenda view when you want a denser schedule overview.</p>
                            <p>Select an event directly on the calendar to open a quick detail modal.</p>
                        </div>
                    </div>
                </aside>
            </section>

            <section className="rounded-[28px] border border-soft-blush bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 className="text-2xl font-extrabold text-deep-slate">Events for {selectedDateLabel}</h3>
                        <p className="mt-1 text-sm text-deep-slate/55">
                            Explore the events for the selected day and open any card for full details.
                        </p>
                    </div>
                    <div className="text-sm font-semibold text-deep-slate/45">
                        {selectedEvents.length} {selectedEvents.length === 1 ? "event" : "events"}
                    </div>
                </div>

                {selectedEvents.length === 0 ? (
                    <div className="mt-6 rounded-[24px] border border-dashed border-soft-blush bg-warm-cream px-6 py-14 text-center">
                        <CalendarDays className="mx-auto h-10 w-10 text-deep-slate/20" />
                        <p className="mt-3 text-base font-semibold text-deep-slate/55">
                            No events scheduled for this date.
                        </p>
                        <p className="mt-1 text-sm text-deep-slate/40">
                            Pick another day in the calendar to see what is coming up.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {selectedEvents.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </section>

            {modalEvent ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm"
                    onClick={() => setModalEvent(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-[30px] border border-soft-blush bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="relative h-52 bg-warm-cream">
                            {modalEvent.eventImage ? (
                                <img
                                    src={modalEvent.eventImage}
                                    alt={modalEvent.eventName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Ticket className="h-14 w-14 text-deep-slate/20" />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setModalEvent(null)}
                                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-deep-slate shadow-sm transition-colors hover:bg-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-7">
                            {modalEvent.category ? (
                                <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-sm font-bold text-coral">
                                    {modalEvent.category}
                                </span>
                            ) : null}

                            <h2 className="mt-4 text-2xl font-extrabold text-deep-slate">
                                {modalEvent.eventName}
                            </h2>

                            <div className="mt-5 space-y-3 text-sm text-deep-slate/60">
                                <div className="flex items-center gap-2.5">
                                    <CalendarDays className="h-4 w-4 text-lavender" />
                                    {formatLongDate(modalEvent.date)}
                                </div>
                                {modalEvent.time ? (
                                    <div className="flex items-center gap-2.5">
                                        <Clock3 className="h-4 w-4 text-coral" />
                                        {modalEvent.time}
                                    </div>
                                ) : null}
                                {modalEvent.venue ? (
                                    <div className="flex items-center gap-2.5">
                                        <MapPin className="h-4 w-4 text-pastel-green" />
                                        {modalEvent.venue}
                                    </div>
                                ) : null}
                            </div>

                            {(modalEvent.shortDescription || modalEvent.longDescription) ? (
                                <p className="mt-5 text-sm leading-6 text-deep-slate/60">
                                    {modalEvent.shortDescription || modalEvent.longDescription}
                                </p>
                            ) : null}

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to={`/events/${modalEvent._id}`}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-deep-slate px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-lavender"
                                >
                                    View Details
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setModalEvent(null)}
                                    className="inline-flex flex-1 items-center justify-center rounded-full border border-soft-blush px-5 py-3 text-sm font-bold text-deep-slate/70 transition-colors hover:bg-warm-cream"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

        </div>

    );

}