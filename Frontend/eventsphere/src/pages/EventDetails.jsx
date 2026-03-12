import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PopupCard from "../components/PopUpCard";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {

        const res = await fetch(`${API_URL}/api/events/${id}`);
        const data = await res.json();
        setEvent(data);

        const student = JSON.parse(localStorage.getItem("eventSphereStudent"));

        if (student) {
          const check = await fetch(
            `${API_URL}/api/events/check-registration/${id}/${student._id}`
          );

          const checkData = await check.json();
          setIsRegistered(checkData.registered);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {

    const student = JSON.parse(localStorage.getItem("eventSphereStudent"));

    if (!student) {

      setPopup({
        title: "Login Required",
        message: "Please login to register for events.",
        action: () => navigate("/login")
      });

      return;
    }

    try {

      const res = await fetch(`${API_URL}/api/events/register/${event._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: student._id
        })
      });

      const data = await res.json();

      if (!res.ok) {

        if (data.type === "PROFILE_INCOMPLETE") {

          setPopup({
            title: "Profile Incomplete",
            message: "Please complete your profile first.",
            action: () => {
              localStorage.setItem("redirectAfterProfile", window.location.pathname);
              navigate("/dashboard");
            }
          });

        } else {

          setPopup({
            title: "Registration Error",
            message: data.message
          });

        }

        return;
      }

      setPopup({
        title: "Success 🎉",
        message: "You have successfully registered for this event."
      });

      setIsRegistered(true);

      setEvent((prev) => ({
        ...prev,
        registeredUsers: prev.registeredUsers + 1
      }));

    } catch (error) {

      setPopup({
        title: "Error",
        message: "Something went wrong."
      });

    }

  };

  const Shell = ({ children }) => (
    <div className="bg-[#F6F1EB] min-h-screen">
      <Navbar />
      <div className="bg-[#F6F1EB] min-h-screen px-[60px] py-10">{children}</div>
      <Footer />
    </div>
  );

  if (loading) return <Shell><p className="text-[#3F3D56]">Loading event details...</p></Shell>;
  if (!event) return <Shell><p className="text-[#3F3D56]">Event not found.</p></Shell>;

  const registered = event.registeredUsers || 0;
  const capacity = event.totalCapacity || 1;
  const remainingSeats = capacity - registered;
  const isFull = remainingSeats <= 0;
  const progress = Math.min(Math.round((registered / capacity) * 100), 100);

  /* -------------------------
     Registration Window Logic
  --------------------------*/

  const now = new Date();
  const eventStart = new Date(`${event.date} ${event.time}`);

  const registrationOpenDate = new Date(eventStart);
  registrationOpenDate.setDate(eventStart.getDate() - 14);

  const eventEnd = new Date(eventStart);
  eventEnd.setHours(eventStart.getHours() + 3);

  let registrationStatus = "open";
  let registrationMessage = "";

  if (now < registrationOpenDate) {

    const diffDays = Math.ceil(
      (registrationOpenDate - now) / (1000 * 60 * 60 * 24)
    );

    registrationStatus = "not-open";
    registrationMessage = `Registration opens in ${diffDays} days`;

  }
  else if (now > eventEnd) {

    registrationStatus = "closed";
    registrationMessage = "Event has ended";

  }
  else {

    const diffDays = Math.ceil(
      (eventStart - now) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 1) {
      registrationMessage = "Event starting soon";
    }

  }

  const metaItems = [
    { icon: <MapPin size={18} />, text: event.venue },
    { icon: <Calendar size={18} />, text: event.date },
    { icon: <Clock size={18} />, text: event.time },
    { icon: <Users size={18} />, text: `${registered} / ${capacity} registered` },
  ];

  const detailCards = [
    { icon: <MapPin size={26} />, label: "Venue", value: event.venue },
    { icon: <Calendar size={26} />, label: "Date", value: event.date },
    { icon: <Clock size={26} />, label: "Time", value: event.time },
    { icon: <Users size={26} />, label: "Capacity", value: capacity },
  ];

  const isRegistrationClosed =
    registrationStatus === "not-open" ||
    registrationStatus === "closed" ||
    isFull;

  return (
    <div className="bg-[#F6F1EB] min-h-screen">
      <Navbar />

      <div className="bg-[#F6F1EB] min-h-screen px-[60px] pb-[60px] pt-10">

        <Link
          to="/events"
          className="flex items-center gap-2 text-[#3F3D56] font-medium mb-8 hover:opacity-70"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        <div className="event-hero-grid gap-[30px] mb-[60px] items-stretch">

          <div className="rounded-[20px] overflow-hidden relative h-full group">
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="bg-white p-[30px] rounded-[18px] shadow flex flex-col justify-center">

            <h1 className="text-[28px] font-bold text-[#3F3D56] mb-2.5">
              {event.eventName}
            </h1>

            <p className="text-sm text-[#6A6A6A] mb-[18px]">
              {event.shortDescription}
            </p>

            <div className="flex flex-col gap-2.5 mb-[18px]">
              {metaItems.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-[#3F3D56] text-sm">
                  {icon}<span>{text}</span>
                </div>
              ))}
            </div>

            <div>

              {/* SHOW MESSAGE BEFORE REGISTRATION OPENS */}
              {registrationStatus === "not-open" && (
                <p className="text-sm mt-2 font-medium text-[#9B96E5]">
                  {registrationMessage}
                </p>
              )}

              {/* SHOW PROGRESS ONLY WHEN REGISTRATION IS OPEN */}
              {registrationStatus === "open" && (
                <>
                  <div className="flex justify-between mb-2 text-[13px] text-[#3F3D56]">
                    <span>Registration Progress</span>
                    <span>{progress}% Full</span>
                  </div>

                  <div className="w-full h-[10px] bg-[#E6E6E6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D8E8D1]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-xs mt-1.5 text-[#6A6A6A]">
                    {registered} of {capacity} spots filled
                  </p>

                  <p className="text-xs text-[#3F3D56] font-medium mt-1">
                    {remainingSeats > 0
                      ? `${remainingSeats} seats remaining`
                      : "No seats left"}
                  </p>

                  {registrationMessage && (
                    <p className="text-sm mt-2 font-medium text-[#9B96E5]">
                      {registrationMessage}
                    </p>
                  )}
                </>
              )}

            </div>

            <button
              onClick={handleRegister}
              disabled={isRegistered || isRegistrationClosed}
              className={`mt-4 w-full py-3 rounded-[14px] text-white font-semibold
              ${isRegistered
                  ? "bg-green-500 cursor-not-allowed"
                  : isFull
                    ? "bg-gray-400 cursor-not-allowed"
                    : registrationStatus !== "open"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#F08A6C] hover:bg-[#e47658]"
                }`}
            >
              {isRegistered
                ? "Registered ✓"
                : isFull
                  ? "Event Full"
                  : registrationStatus === "not-open"
                    ? "Registration Not Open"
                    : registrationStatus === "closed"
                      ? "Event Ended"
                      : "Register Now"}
            </button>

          </div>
        </div>

        <div className="bg-white p-10 rounded-[18px] shadow mb-[50px]">
          <h2 className="text-[28px] font-bold text-[#3F3D56] mb-5">
            About This Event
          </h2>
          <p className="text-[#5c5c5c] leading-[1.7]">
            {event.longDescription || "No description available."}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#3F3D56] mb-6">
            Event Details
          </h2>

          <div className="details-grid gap-6">
            {detailCards.map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white p-[30px] rounded-2xl text-center shadow"
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

      {popup && (
        <PopupCard
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
          action={popup.action}
        />
      )}

      <Footer />
    </div>
  );
}

export default EventDetails;