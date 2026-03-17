import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PopupCard from "../components/PopUpCard";
import { MapPin, Calendar, Clock, Users, ArrowLeft, Tag, Sparkles } from "lucide-react";
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

        const res = await fetch(`${API_URL}/events/${id}`);
        const data = await res.json();
        setEvent(data);

        const student = JSON.parse(localStorage.getItem("eventSphereStudent"));

        if (student) {
          const check = await fetch(
            `${API_URL}/events/check-registration/${id}/${student._id}`
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

      const res = await fetch(`${API_URL}/events/register/${event._id}`, {
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

        } else if (data.type === "PROFILE_UNDER_REVIEW") {

          setPopup({
            title: "Profile Under Review",
            message: "Your profile is under review by admin. You can register after approval."
          });

        } else if (data.type === "PROFILE_REJECTED") {

          setPopup({
            title: "Profile Rejected",
            message: "Your profile was rejected. Please update your details and resubmit.",
            action: () => navigate("/settings")
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
    <div className="event-details-shell min-h-screen">
      <Navbar />
      <div className="relative z-[1] min-h-screen px-4 py-8 sm:px-6 lg:px-16 lg:py-10">{children}</div>
      <Footer />
    </div>
  );

  if (loading) return <Shell><p className="text-[#3F3D56]">Loading event details...</p></Shell>;
  if (!event) return <Shell><p className="text-[#3F3D56]">Event not found.</p></Shell>;

  const registered = event.registeredUsers || 0;
  const capacity = Math.max(event.totalCapacity || 1, 1);
  const remainingSeats = Math.max(capacity - registered, 0);
  const isFull = remainingSeats <= 0;
  const progress = Math.min(Math.round((registered / capacity) * 100), 100);

  /* -------------------------
     Registration Window Logic
  --------------------------*/

  const now = new Date();

  const parsedEventStart = new Date(`${event.date} ${event.time}`);
  const fallbackEventStart = new Date(event.date);
  const eventStart = Number.isNaN(parsedEventStart.getTime())
    ? fallbackEventStart
    : parsedEventStart;
  const hasValidEventStart = !Number.isNaN(eventStart.getTime());

  const registrationOpenDate = new Date(eventStart);
  if (hasValidEventStart) {
    registrationOpenDate.setDate(eventStart.getDate() - 14);
  }

  const eventEnd = new Date(eventStart);
  if (hasValidEventStart) {
    eventEnd.setHours(eventStart.getHours() + 3);
  }

  let registrationStatus = "open";
  let registrationMessage = "";

  if (hasValidEventStart && now < registrationOpenDate) {

    const diffDays = Math.ceil(
      (registrationOpenDate - now) / (1000 * 60 * 60 * 24)
    );

    registrationStatus = "not-open";
    registrationMessage = `Registration opens in ${diffDays} days`;

  }
  else if (hasValidEventStart && now > eventEnd) {

    registrationStatus = "closed";
    registrationMessage = "Event has ended";

  }
  else {

    const diffDays = hasValidEventStart
      ? Math.ceil((eventStart - now) / (1000 * 60 * 60 * 24))
      : null;

    if (diffDays !== null && diffDays <= 1) {
      registrationMessage = "Event starting soon";
    }

  }

  const formattedDate = hasValidEventStart
    ? eventStart.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    })
    : event.date;

  const formattedTime = event.time || "Time will be announced";

  const metaItems = [
    { icon: <MapPin size={16} />, text: event.venue || "Venue will be announced" },
    { icon: <Calendar size={16} />, text: formattedDate },
    { icon: <Clock size={16} />, text: formattedTime },
    { icon: <Users size={16} />, text: `${registered}/${capacity} registered` },
  ];

  const detailCards = [
    { icon: <MapPin size={20} />, label: "Venue", value: event.venue || "TBA" },
    { icon: <Calendar size={20} />, label: "Date", value: formattedDate },
    { icon: <Clock size={20} />, label: "Time", value: formattedTime },
    { icon: <Tag size={20} />, label: "Category", value: event.category || "General" },
  ];

  const isRegistrationClosed =
    registrationStatus === "not-open" ||
    registrationStatus === "closed" ||
    isFull;

  const registrationInfoMessage = registrationMessage ||
    (isRegistered
      ? "You are already registered for this event."
      : isFull
        ? "This event is currently full."
        : "Registration is open.");

  const registrationBannerClass =
    registrationStatus === "not-open"
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : registrationStatus === "closed"
        ? "bg-slate-100 border-slate-200 text-slate-600"
        : isFull
          ? "bg-rose-50 border-rose-200 text-rose-700"
          : "bg-emerald-50 border-emerald-200 text-emerald-700";

  return (
    <div className="event-details-shell min-h-screen">
      <Navbar />

      <div className="relative z-[1] min-h-screen px-4 pb-14 pt-8 sm:px-6 lg:px-16 lg:pb-16 lg:pt-10">

        <Link
          to="/events"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/90 px-4 py-2 font-medium text-[#3F3D56] shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        <section className="event-hero-grid mb-10 items-stretch gap-6 lg:mb-12 lg:gap-8">

          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] shadow-[0_26px_70px_rgba(40,30,70,0.22)] lg:min-h-[460px]">
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5" />

            <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
              {event.isFeatured && (
                <span className="rounded-full bg-[#F08A6C] px-3 py-1 text-xs font-semibold text-white">
                  Featured
                </span>
              )}

              {event.isTrending && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  Trending
                </span>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                <Sparkles size={14} />
                {event.category || "Campus Event"}
              </span>

              <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {event.eventName}
              </h1>

              <p className="mt-3 max-w-[720px] text-sm text-white/85 sm:text-base">
                {event.shortDescription}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {metaItems.map(({ icon, text }) => (
                  <div
                    key={text}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs text-white/95 backdrop-blur-sm sm:text-sm"
                  >
                    {icon}
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-[28px] border border-white/90 bg-white/95 p-6 shadow-[0_14px_40px_rgba(60,45,95,0.12)] backdrop-blur-sm sm:p-8">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A76B2]">
              Registration
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#2E2B44]">
              Secure Your Seat
            </h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${registrationBannerClass}`}>
              {registrationInfoMessage}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-[13px] text-[#3F3D56]">
                <span>Capacity</span>
                <span>{registered} / {capacity}</span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-[#ECEBF6]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#9B96E5] to-[#F08A6C]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-[#6A6A6A]">
                <span>
                  {remainingSeats > 0
                    ? `${remainingSeats} seats remaining`
                    : "No seats left"}
                </span>
                <span>{progress}% occupied</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#F8F8FC] p-3">
                <p className="text-xs text-[#6A6A6A]">Registered</p>
                <p className="mt-1 text-lg font-semibold text-[#2E2B44]">{registered}</p>
              </div>

              <div className="rounded-2xl bg-[#F8F8FC] p-3">
                <p className="text-xs text-[#6A6A6A]">Total Capacity</p>
                <p className="mt-1 text-lg font-semibold text-[#2E2B44]">{capacity}</p>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={isRegistered || isRegistrationClosed}
              className={`mt-7 w-full rounded-[14px] py-3.5 text-base font-semibold text-white transition
              ${isRegistered
                  ? "bg-green-500 cursor-not-allowed"
                  : isFull
                    ? "bg-gray-400 cursor-not-allowed"
                    : registrationStatus !== "open"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#F08A6C] hover:-translate-y-0.5 hover:bg-[#e47658]"
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
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.55fr,1fr] lg:gap-8">
          <div className="rounded-[24px] border border-white/85 bg-white/95 p-6 shadow-[0_10px_30px_rgba(60,45,95,0.1)] sm:p-8">
            <h2 className="text-[28px] font-bold text-[#2E2B44]">
              About This Event
            </h2>

            <p className="mt-4 leading-[1.9] text-[#4f4f60]">
              {event.longDescription || "No description available."}
            </p>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[24px] border border-white/85 bg-white/95 p-6 shadow-[0_10px_30px_rgba(60,45,95,0.1)] sm:p-7">
              <h2 className="mb-5 text-2xl font-bold text-[#2E2B44]">
                Event Details
              </h2>

              <div className="space-y-3.5">
                {detailCards.map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-[#EEEAF8] bg-[#FBFAFF] p-3.5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEEAFE] text-[#7A76B2]">
                      {icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-[#8a8a8a]">{label}</p>
                      <p className="text-sm font-semibold text-[#3F3D56]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="event-details-help-card rounded-[24px] p-6 text-[#2E2B44] shadow-[0_10px_24px_rgba(64,39,24,0.16)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B4E3F]">
                Quick Reminder
              </p>

              <h3 className="mt-2 text-xl font-bold">Keep your profile updated</h3>

              <p className="mt-2 text-sm text-[#5D4B44]">
                Complete profile details and verification status help avoid registration interruptions.
              </p>

              <button
                onClick={() => navigate("/settings")}
                className="mt-5 rounded-full bg-[#2E2B44] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1F1D31]"
              >
                Open Settings
              </button>
            </div>
          </aside>
        </section>

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