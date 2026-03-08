import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeaturedEventCard({ _id, category, title, description, date, location, users, image }) {
  const navigate = useNavigate();

  return (
    <div className="flex bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 mb-9 last:mb-0">

      {/* ── LEFT: Image ── */}
      <div className="relative w-[45%] overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[400ms] ease-in-out group-hover:scale-[1.05]"
        />
        <span className="absolute top-4 left-4 bg-[#F08A6C] text-white text-[13px] font-semibold px-3 py-1.5 rounded-full">
          Featured
        </span>
      </div>

      {/* ── RIGHT: Content ── */}
      <div className="w-[55%] p-10">
        <span className="inline-block bg-[#EED8D6] text-[#3F3D56] text-[13px] px-3.5 py-1.5 rounded-full mb-3.5">
          {category}
        </span>

        <h2 className="text-[32px] font-bold text-[#3F3D56] mb-3">{title}</h2>

        <p className="text-base text-[#6b6b80] mb-5 leading-relaxed">{description}</p>

        {/* Details */}
        <div className="flex flex-col gap-2.5 mb-[22px]">
          {[
            { icon: <Calendar size={18} />, text: date     },
            { icon: <MapPin   size={18} />, text: location },
            { icon: <Users    size={18} />, text: users    },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-[#6b6b80] text-[15px]">
              <span className="text-[#9B96E5]">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate(`/events/${_id}`)}
          className="bg-[#F08A6C] text-white font-semibold px-[22px] py-3 rounded-[30px] transition-all duration-300 hover:bg-[#e67758]"
        >
          View Details →
        </button>
      </div>

    </div>
  );
}

export default FeaturedEventCard;