import React from "react";
import "../styles/events.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import hackathon from "../assets/hackathon.png"
import fest from "../assets/fest.png"
import FeaturedEventCard from "../components/FeatureEventsCard";
import { Search } from "lucide-react";

function Events() {
  return (
    <div className="events-page-wrapper">

      {/* Grid background layer */}
      <div className="events-grid-bg" />

      <Navbar />

      <div className="events-page">

        {/* HERO SECTION */}
        <div className="events-hero">

          <h1 className="events-title">Explore Events</h1>

          <p className="events-subtitle">
            Discover workshops, hackathons, fests and more
          </p>

          {/* SEARCH BAR */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              className="search-input"
            />
          </div>

          {/* FILTERS */}
          <div className="event-filters">
            <button className="filter active">All Events</button>
            <button className="filter">Technical</button>
            <button className="filter">Cultural</button>
            <button className="filter">Sports</button>
            <button className="filter">Workshops</button>
            <button className="filter">Hackathons</button>
          </div>

        </div>
      </div>


      {/* FEATURED EVENTS SECTION */}

      <section className="featured-section">

        <h2 className="featured-heading">Featured Events</h2>

        {/* FEATURED CARD 1 */}

        <FeaturedEventCard
          category="Hackathons"
          title="HackSphere 2026"
          description="A 48-hour hackathon where students build innovative solutions to real-world problems. Prizes worth $10,000 up for grabs!"
          date="Mar 15, 2026 • 9:00 AM - 9:00 PM"
          location="Innovation Hub, Building A"
          users="342/500 registered (68% full)"
          image={hackathon}
        />

        {/* FEATURED CARD 2 */}

        <FeaturedEventCard
          category="Cultural"
          title="Spring Cultural Fest"
          description="The biggest cultural extravaganza of the year with performances, art exhibitions, and food stalls from around the world."
          date="Mar 20, 2026 • 10:00 AM - 10:00 PM"
          location="Main Amphitheater"
          users="1200/2000 registered (60% full)"
          image={fest}
        />

      </section>

      <Footer />

    </div>
  );
}

export default Events;