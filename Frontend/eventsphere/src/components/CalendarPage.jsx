import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

import EventCard from "./EventCard";

export default function CalendarPage() {

    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [modalEvent, setModalEvent] = useState(null);

    const today = new Date().toISOString().split("T")[0];

    // ================= FETCH =================

    const fetchEvents = useCallback(async () => {

        const res = await axios.get(
            `${API_URL}/api/events`
        );

        // hide past events
        const formatted = res.data
            .filter(e => e.date >= today)
            .map(e => ({

                id: e._id,
                title: e.eventName,
                start: e.date,

                backgroundColor: "#9B96E5",
                borderColor: "#9B96E5",

                extendedProps: e

            }));

        setEvents(formatted);

    }, [today]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // ================= DATE CLICK =================

    const handleDateClick = (info) => {

        if (info.dateStr < today) return;

        const list = events.filter(
            e => e.start === info.dateStr
        );

        setSelectedEvents(
            list.map(e => e.extendedProps)
        );

    };


    // ================= EVENT CLICK =================

    const handleEventClick = (info) => {

        setModalEvent(
            info.event.extendedProps
        );

    };


    // ================= DRAG =================

    const handleEventDrop = (info) => {

        if (info.event.startStr < today) {
            info.revert();
        }

    };


    return (

        <div className="flex flex-col gap-8">


            {/* STYLE */}

            <style>{`

        .fc .fc-button {
          background: #9B96E5;
          border: none;
          color: white;
          border-radius: 8px;
        }

        .fc .fc-button:hover {
          background: #F08A6C;
        }

        .fc .fc-button-active {
          background: #3F3D56 !important;
        }

        .fc-toolbar-title {
          color: #3F3D56;
          font-weight: 600;
        }

        .fc-day-past {
          background: #f3f3f3 !important;
          color: #999 !important;
          pointer-events: none;
        }

      `}</style>


            {/* HEADER */}

            <div className="
        bg-gradient-to-r
        from-[#9B96E5]
        to-[#F08A6C]
        text-white
        p-6
        rounded-3xl
      ">
                <h2 className="text-2xl font-bold">
                    Event Calendar
                </h2>
            </div>


            {/* CALENDAR */}

            <div className="flex justify-center">

                <div className="
          bg-white
          rounded-3xl
          shadow-xl
          border
          p-4
          w-[650px]
        ">

                    <FullCalendar

                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin
                        ]}

                        initialView="dayGridMonth"

                        events={events}

                        editable
                        selectable

                        dateClick={handleDateClick}

                        eventClick={handleEventClick}

                        eventDrop={handleEventDrop}

                        height={500}

                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right:
                                "dayGridMonth,timeGridWeek,timeGridDay"
                        }}

                        buttonText={{
                            today: "Today",
                            month: "month",
                            week: "week",
                            day: "day"
                        }}

                    />

                </div>

            </div>



            {/* EVENTS */}

            <div>

                <h3 className="text-xl font-semibold mb-4">
                    Events
                </h3>

                <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

                    {selectedEvents.map(e => (

                        <EventCard
                            key={e._id}
                            event={e}
                        />

                    ))}

                </div>

            </div>

            {/* MODAL */}

            {modalEvent && (

                <div className="
          fixed inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
        ">

                    <div className="
            bg-white
            p-6
            rounded-2xl
            w-[400px]
          ">

                        <h2 className="text-xl font-bold">
                            {modalEvent.eventName}
                        </h2>

                        <p>{modalEvent.date}</p>
                        <p>{modalEvent.time}</p>
                        <p>{modalEvent.venue}</p>

                        <button
                            className="
                mt-4
                bg-[#F08A6C]
                text-white
                px-4
                py-2
                rounded
              "
                            onClick={() => setModalEvent(null)}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}