import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeaturedEventCard({ _id, category, title, description, date, location, users, image }) {
  const navigate = useNavigate();

  const hasImage = Boolean(image);

  return (
    <div className="mb-7 overflow-hidden rounded-[24px] border border-[#EAE7FA] bg-white shadow-[0_14px_30px_rgba(54,47,88,0.1)] last:mb-0">

      <div className="flex flex-col lg:flex-row">

        <div className="group relative h-[230px] w-full overflow-hidden lg:h-auto lg:w-[43%]">
          {hasImage ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-[450ms] ease-in-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#D9D4FF] via-[#F5E9DE] to-[#DDEDD6]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />

          <span className="absolute left-4 top-4 rounded-full bg-[#F08A6C] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        </div>

        <div className="w-full p-6 sm:p-8 lg:w-[57%] lg:p-9">
          <span className="mb-3 inline-block rounded-full bg-[#EEEAFE] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#5F5A94]">
            {category || "General"}
          </span>

          <h2 className="mb-2 text-2xl font-bold leading-tight text-[#302E49] sm:text-[30px]">
            {title}
          </h2>

          <p className="mb-5 text-sm leading-relaxed text-[#6b6b80] sm:text-base">
            {description}
          </p>

          <div className="mb-6 grid gap-2.5 sm:grid-cols-2">
            {[
              { icon: <Calendar size={17} />, text: date },
              { icon: <MapPin size={17} />, text: location },
              { icon: <Users size={17} />, text: users },
            ].map(({ icon, text }, index) => (
              <div key={`${text}-${index}`} className="flex items-center gap-2 rounded-xl bg-[#FAF9FF] px-3 py-2 text-sm text-[#6b6b80]">
                <span className="text-[#9B96E5]">{icon}</span>
                <span className="truncate">{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(`/events/${_id}`)}
            className="rounded-full bg-[#F08A6C] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e67758] sm:text-base"
          >
            View Details →
          </button>
        </div>

      </div>
    </div>
  );
}

export default FeaturedEventCard;