import { Calendar, MapPin } from "lucide-react";
import "../styles/eventcard.css";

export default function EventCard({
  image,
  category,
  title,
  date,
  location,
}) {
  return (
    <div className="event-card">

      <div className="event-image">
        <img src={image} alt={title} />

        <span className="event-category">
          {category}
        </span>
      </div>

      <div className="event-content">

        <h3 className="event-title">{title}</h3>

        <div className="event-info">
          <Calendar size={16} />
          <span>{date}</span>
        </div>

        <div className="event-info">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        <button className="event-btn">
          View Details
        </button>

      </div>
    </div>
  );
}