import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/eventcard.css";

const EventCard = React.memo(({ event }) => {

  if (!event) return null;

  return (
    <div className="event-card">

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
          <button className="event-btn">
            View Details
          </button>
        </Link>

      </div>

    </div>
  );
});

export default EventCard;