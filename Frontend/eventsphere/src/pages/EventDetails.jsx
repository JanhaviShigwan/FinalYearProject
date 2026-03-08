import React, { useEffect, useState } from "react";
import "../styles/eventdetails.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
const API="https://eventsphere-8sgd.onrender.com";

function EventDetails() {

  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH EVENT BY ID
  ========================= */

  useEffect(() => {

    const fetchEvent = async () => {

      try {

        const res = await fetch(`${API}/api/events/${id}`);

        if (!res.ok) {
          throw new Error("Event not found");
        }

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

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <div className="view-details-wrapper">
        <Navbar />
        <div className="view-details-page">
          <p>Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="view-details-wrapper">
        <Navbar />
        <div className="view-details-page">
          <p>Event not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  /* =========================
     REGISTRATION PROGRESS
  ========================= */

  const registered = event.registeredUsers || 0;
  const capacity = event.totalCapacity || 1;

  const progress = Math.min(
    Math.round((registered / capacity) * 100),
    100
  );

  return (

    <div className="view-details-wrapper">

      <Navbar />

      <div className="view-details-page">

        <Link to="/events" className="back-link">
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        {/* HERO */}

        <div className="event-hero">

          <div className="event-image-wrapper">
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="event-image"
            />
          </div>

          <div className="event-info-card">

            <h1 className="event-title">
              {event.eventName}
            </h1>

            <p className="event-description">
              {event.shortDescription}
            </p>

            <div className="event-meta">

              <div className="meta-item">
                <MapPin size={18} />
                <span>{event.venue}</span>
              </div>

              <div className="meta-item">
                <Calendar size={18} />
                <span>{event.date}</span>
              </div>

              <div className="meta-item">
                <Clock size={18} />
                <span>{event.time}</span>
              </div>

              <div className="meta-item">
                <Users size={18} />
                <span>
                  {registered} / {capacity} registered
                </span>
              </div>

            </div>

            {/* PROGRESS */}

            <div className="progress-section">

              <div className="progress-header">
                <span>Registration Progress</span>
                <span>{progress}% Full</span>
              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>

              </div>

              <p className="progress-text">
                {registered} of {capacity} spots filled
              </p>

            </div>

            <button className="register-btn">
              Register Now
            </button>

          </div>

        </div>

        {/* ABOUT EVENT */}

        <div className="about-card">

          <h2 className="section-title">
            About This Event
          </h2>

          <p>
            {event.longDescription || "No description available."}
          </p>

        </div>

        {/* EVENT DETAILS */}

        <div className="details-wrapper">

          <h2 className="details-title">
            Event Details
          </h2>

          <div className="details-grid">

            <div className="detail-card">
              <div className="detail-icon"><MapPin size={26} /></div>
              <p className="detail-label">Venue</p>
              <p className="detail-value">{event.venue}</p>
            </div>

            <div className="detail-card">
              <div className="detail-icon"><Calendar size={26} /></div>
              <p className="detail-label">Date</p>
              <p className="detail-value">{event.date}</p>
            </div>

            <div className="detail-card">
              <div className="detail-icon"><Clock size={26} /></div>
              <p className="detail-label">Time</p>
              <p className="detail-value">{event.time}</p>
            </div>

            <div className="detail-card">
              <div className="detail-icon"><Users size={26} /></div>
              <p className="detail-label">Capacity</p>
              <p className="detail-value">{capacity}</p>
            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

}

export default EventDetails;