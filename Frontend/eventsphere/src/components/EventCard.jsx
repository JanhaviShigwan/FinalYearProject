import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/eventcard.css";

const EventCard = React.memo(({ event }) => {

  if (!event) return null;

  const now = new Date();
  const eventDate = new Date(`${event.date} ${event.time}`);

  let status = "Upcoming";

  if (eventDate.toDateString() === now.toDateString()) {
    status = "Ongoing";
  } else if (eventDate < now) {
    status = "Past";
  }

  return (
    <div className={`event-card ${status === "Past" ? "past-event" : ""}`}>

      {/* LIVE BADGE */}

      {status === "Ongoing" && (
        <span className="live-badge">LIVE</span>
      )}

      <span className="event-category">
        {event?.category}
      </span>

      <div className="event-content">

        <h3 className="event-title">
          {event?.eventName}
        </h3>

        <p className="event-description">
          {event?.shortDescription}
        </p>

        <div className="event-meta">

          <div className="event-info">
            <Calendar size={16} />
            <span>{event?.date} • {event?.time}</span>
          </div>

          <div className="event-info">
            <MapPin size={16} />
            <span>{event?.venue}</span>
          </div>

        </div>

        <Link to={`/events/${event?._id}`}>
          <button
            className="event-btn"
            disabled={status === "Past"}
          >
            {status === "Past" ? "Event Ended" : "View Details"}
          </button>
        </Link>

      </div>

    </div>
  );
});

export default EventCard;