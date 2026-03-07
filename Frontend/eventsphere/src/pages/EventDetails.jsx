import React from "react";
import "../styles/eventdetails.css";
import hacked from "../assets/hacked.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function ViewDetails() {
  return (
    <div className="view-details-wrapper">
      <Navbar />
      <div className="view-details-page">

        <Link to="/events" className="back-link">
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        {/* HERO SECTION */}
        <div className="event-hero">

          {/* IMAGE */}
          <div className="event-image-wrapper">
            <img
              src={hacked}
              alt="HackSphere Event"
              className="event-image"
            />
          </div>

          {/* EVENT INFO */}
          <div className="event-info-card">
            <h1 className="event-title">HackSphere 2026</h1>
            <p className="event-description">
              A 48-hour hackathon where students build innovative solutions to
              real-world problems. Prizes worth $10,000 up for grabs!
            </p>
            <div className="event-meta">
              <div className="meta-item">
                <MapPin size={18} />
                <span>Innovation Hub, Building A</span>
              </div>
              <div className="meta-item">
                <Calendar size={18} />
                <span>Mar 15, 2026</span>
              </div>
              <div className="meta-item">
                <Clock size={18} />
                <span>9:00 AM – 9:00 PM</span>
              </div>
              <div className="meta-item">
                <Users size={18} />
                <span>342 / 500 registered</span>
              </div>
            </div>

            {/* Progress */}
            <div className="progress-section">
              <div className="progress-header">
                <span>Registration Progress</span>
                <span>68% Full</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="progress-text">342 of 500 spots filled</p>
            </div>

            <button className="register-btn">Register Now</button>
          </div>

        </div>

        {/* ABOUT EVENT */}
        <div className="about-card">
          <h2 className="section-title">About This Event</h2>
          <p>
            HackSphere 2026 is the flagship hackathon of our university,
            bringing together the brightest minds from across the campus to
            collaborate, innovate, and create. Over the course of 48 intense
            hours, participants will work in teams of 2–4 to develop
            cutting-edge solutions addressing real-world challenges across
            themes like sustainability, healthcare, education, and smart cities.
          </p>
          <p>
            This year's edition features exciting additions including mentorship
            sessions with industry professionals from leading tech companies,
            hands-on workshops on emerging technologies like AI/ML and
            blockchain, and an expanded prize pool totaling $10,000.
          </p>
          <p>
            Meals, snacks, and beverages will be provided throughout the event.
            Participants will have access to high-speed internet, comfortable
            workstations, and recreational areas for breaks.
          </p>
        </div>

        {/* EVENT DETAILS */}
        <div className="details-wrapper">
          <h2 className="details-title">Event Details</h2>
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon"><MapPin size={26} /></div>
              <p className="detail-label">Venue</p>
              <p className="detail-value">Innovation Hub, Building A</p>
            </div>
            <div className="detail-card">
              <div className="detail-icon"><Calendar size={26} /></div>
              <p className="detail-label">Date</p>
              <p className="detail-value">Mar 15, 2026</p>
            </div>
            <div className="detail-card">
              <div className="detail-icon"><Clock size={26} /></div>
              <p className="detail-label">Time</p>
              <p className="detail-value">9:00 AM – 9:00 PM</p>
            </div>
            <div className="detail-card">
              <div className="detail-icon"><Users size={26} /></div>
              <p className="detail-label">Capacity</p>
              <p className="detail-value">500 spots</p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default ViewDetails;