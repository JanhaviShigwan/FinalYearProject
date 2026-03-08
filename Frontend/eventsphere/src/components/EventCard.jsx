import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

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

  const isPast = status === "Past";

  return (
    <div className={`
      group relative bg-white rounded-[20px] p-[22px] shadow-[0_8px_20px_rgba(0,0,0,0.08)]
      transition-all duration-[250ms] ease-in-out flex flex-col justify-between
      hover:-translate-y-1.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.12)]
      ${isPast ? "opacity-60 grayscale-[30%]" : ""}
    `}>

      {/* LIVE badge */}
      {status === "Ongoing" && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-[livePulse_1.5s_infinite]">
          LIVE
        </span>
      )}

      {/* Category badge */}
      <span className="self-start bg-[#F08A6C] text-white text-[13px] px-3 py-1 rounded-full font-semibold mb-3">
        {event?.category}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-[#3F3D56] transition-colors duration-[250ms] group-hover:text-[#9B96E5]">
          {event?.eventName}
        </h3>

        <p className="text-sm text-[#6B6A7D] leading-relaxed">
          {event?.shortDescription}
        </p>

        {/* Meta */}
        <div className="mt-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-[#6B6A7D]">
            <Calendar size={16} />
            <span>{event?.date} • {event?.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B6A7D]">
            <MapPin size={16} />
            <span>{event?.venue}</span>
          </div>
        </div>

        {/* Button */}
        <Link to={`/events/${event?._id}`}>
          <button
            disabled={isPast}
            className={`
              mt-3.5 w-full py-3 rounded-full font-semibold text-[15px] text-white
              border-none transition-all duration-[250ms] cursor-pointer
              ${isPast
                ? "bg-[#b5b5b5] cursor-not-allowed"
                : "bg-[#F08A6C] hover:bg-[#e6785a]"
              }
            `}
          >
            {isPast ? "Event Ended" : "View Details"}
          </button>
        </Link>
      </div>

    </div>
  );
});

export default EventCard;