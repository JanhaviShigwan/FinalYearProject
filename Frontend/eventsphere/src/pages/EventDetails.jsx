import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const API = "https://eventsphere-8sgd.onrender.com";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API}/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  /* ── Shared wrapper for loading / error states ── */
  const Shell = ({ children }) => (
    <div className="bg-[#F6F1EB] min-h-screen">
      <Navbar />
      <div className="bg-[#F6F1EB] min-h-screen px-[60px] py-10">{children}</div>
      <Footer />
    </div>
  );

  if (loading) return <Shell><p className="text-[#3F3D56]">Loading event details...</p></Shell>;
  if (!event)  return <Shell><p className="text-[#3F3D56]">Event not found.</p></Shell>;

  const registered = event.registeredUsers || 0;
  const capacity   = event.totalCapacity   || 1;
  const progress   = Math.min(Math.round((registered / capacity) * 100), 100);

  const metaItems = [
    { icon: <MapPin  size={18} />, text: event.venue },
    { icon: <Calendar size={18} />, text: event.date  },
    { icon: <Clock   size={18} />, text: event.time  },
    { icon: <Users   size={18} />, text: `${registered} / ${capacity} registered` },
  ];

  const detailCards = [
    { icon: <MapPin   size={26} />, label: "Venue",    value: event.venue    },
    { icon: <Calendar size={26} />, label: "Date",     value: event.date     },
    { icon: <Clock    size={26} />, label: "Time",     value: event.time     },
    { icon: <Users    size={26} />, label: "Capacity", value: capacity       },
  ];

  return (
    <div className="bg-[#F6F1EB] min-h-screen">
      <Navbar />

      <div className="bg-[#F6F1EB] min-h-screen px-[60px] pb-[60px] pt-10 [box-sizing:border-box]">

        {/* Back link */}
        <Link
          to="/events"
          className="flex items-center gap-2 text-[#3F3D56] font-medium mb-8 cursor-pointer no-underline hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        {/* ── HERO ── */}
        {/* event-hero: 3fr/2fr grid — kept as .event-hero-grid in index.css */}
        <div className="event-hero-grid gap-[30px] mb-[60px] items-stretch">

          {/* Image */}
          <div className="rounded-[20px] overflow-hidden relative h-full group">
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-[400ms] ease-in-out group-hover:scale-[1.02]"
            />
          </div>

          {/* Info card */}
          <div className="bg-white p-[30px] rounded-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08),0_0_20px_rgba(155,150,229,0.35)]">

            <h1 className="text-[28px] font-bold text-[#3F3D56] mb-2.5">{event.eventName}</h1>
            <p className="text-sm text-[#6A6A6A] mb-[18px] leading-relaxed">{event.shortDescription}</p>

            {/* Meta */}
            <div className="flex flex-col gap-2.5 mb-[18px]">
              {metaItems.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-[#3F3D56] text-sm">
                  {icon}<span>{text}</span>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between mb-2 text-[13px] text-[#3F3D56]">
                <span>Registration Progress</span>
                <span>{progress}% Full</span>
              </div>
              <div className="w-full h-[10px] bg-[#E6E6E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D8E8D1] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs mt-1.5 text-[#6A6A6A]">{registered} of {capacity} spots filled</p>
            </div>

            <button className="mt-3.5 w-full py-3 border-none rounded-[14px] bg-[#F08A6C] text-white text-[15px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e47658]">
              Register Now
            </button>

          </div>
        </div>

        {/* ── ABOUT ── */}
        <div className="bg-white p-10 rounded-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] mb-[50px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08),0_0_20px_rgba(155,150,229,0.35)]">
          <h2 className="text-[28px] font-bold text-[#3F3D56] mb-5">About This Event</h2>
          <p className="text-[#5c5c5c] leading-[1.7] mb-4">
            {event.longDescription || "No description available."}
          </p>
        </div>

        {/* ── EVENT DETAILS ── */}
        <div>
          <h2 className="text-2xl font-bold text-[#3F3D56] mb-6">Event Details</h2>

          {/* details-grid: repeat(4,1fr) — kept in index.css */}
          <div className="details-grid gap-6">
            {detailCards.map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white p-[30px] rounded-2xl text-center shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_35px_rgba(0,0,0,0.08),0_0_18px_rgba(155,150,229,0.35)]"
              >
                <div className="w-[60px] h-[60px] bg-[#EEEAFE] text-[#9B96E5] rounded-full flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <p className="text-sm text-[#8a8a8a] mb-1">{label}</p>
                <p className="text-base font-semibold text-[#3F3D56]">{value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default EventDetails;