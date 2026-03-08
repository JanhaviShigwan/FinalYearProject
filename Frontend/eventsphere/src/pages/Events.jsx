import React, { useEffect, useState } from "react";
import "../styles/events.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeaturedEventCard from "../components/FeatureEventsCard";
import EventCard from "../components/EventCard";
import { Search } from "lucide-react";
const API="https://eventsphere-8sgd.onrender.com"

function Events() {

  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState(12);

  /* =========================
     FETCH EVENTS
  ========================= */

  useEffect(() => {

    fetch(`${API}/api/events`)
      .then(res => res.json())
      .then(data => {

        setEvents(data);

        const featured = data.filter(event => event.isFeatured === true);
        setFeaturedEvents(featured);

      })
      .catch(err => console.log(err));

  }, []);

  /* =========================
     CATEGORY LIST FROM DB
  ========================= */

  const categories = [
    "All",
    ...new Set(events.map(event => event.category))
  ];

  /* =========================
     EVENT STATUS FUNCTION
  ========================= */

  const getEventStatus = (event) => {

    const now = new Date();
    const eventDate = new Date(`${event.date} ${event.time}`);

    if (eventDate > now) return "Upcoming";

    if (eventDate.toDateString() === now.toDateString())
      return "Ongoing";

    return "Past";

  };

  /* =========================
     CATEGORY FILTER
  ========================= */

  const categoryFilteredEvents =
    activeCategory === "All"
      ? events
      : events.filter(
          event =>
            event.category.toLowerCase() === activeCategory.toLowerCase()
        );

  /* =========================
     STATUS COUNTS (BASED ON CATEGORY)
  ========================= */

  const allCount = categoryFilteredEvents.length;

  const upcomingCount = categoryFilteredEvents.filter(
    e => getEventStatus(e) === "Upcoming"
  ).length;

  const ongoingCount = categoryFilteredEvents.filter(
    e => getEventStatus(e) === "Ongoing"
  ).length;

  const pastCount = categoryFilteredEvents.filter(
    e => getEventStatus(e) === "Past"
  ).length;

  /* =========================
     STATUS FILTER
  ========================= */

 let filteredEvents = categoryFilteredEvents;

if (activeStatus !== "All") {

  filteredEvents = categoryFilteredEvents.filter(
    event => getEventStatus(event) === activeStatus
  );

}

/* SORT EVENTS */

filteredEvents = filteredEvents.sort((a, b) => {

  const statusOrder = {
    Ongoing: 1,
    Upcoming: 2,
    Past: 3
  };

  const statusA = getEventStatus(a);
  const statusB = getEventStatus(b);

  return statusOrder[statusA] - statusOrder[statusB];

});

  return (

    <div className="events-page-wrapper">

      <Navbar />

      <div className="events-page">

        {/* HERO */}

        <div className="events-hero">

          <h1 className="events-title">Explore Events</h1>

          <p className="events-subtitle">
            Discover workshops, hackathons, fests and more
          </p>

          {/* SEARCH */}

          <div className="search-container">
            <Search size={18} className="search-icon" />

            <input
              type="text"
              placeholder="Search events..."
              className="search-input"
            />
          </div>

          {/* CATEGORY FILTERS */}

          <div className="event-filters">

            {categories.map(category => (

              <button
                key={category}
                className={`filter ${activeCategory === category ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveStatus("All");  // reset status
                }}
              >
                {category === "All" ? "All Events" : category}
              </button>

            ))}

          </div>

        </div>

        {/* FEATURED EVENTS */}

        {activeCategory === "All" && (

          <section className="featured-section">

            <h2 className="featured-heading">Featured Events</h2>

            {featuredEvents.slice(0,2).map(event => (

              <FeaturedEventCard
                key={event._id}
                category={event.category}
                title={event.eventName}
                description={event.shortDescription}
                date={`${event.date} • ${event.time}`}
                location={event.venue}
                users={`${event.registeredUsers}/${event.totalCapacity} registered`}
              />

            ))}

          </section>

        )}

      </div>

      {/* =========================
         BROWSE EVENTS
      ========================= */}

      <section className="browse-events-section">

        <h2 className="browse-heading">
          {activeCategory === "All"
            ? "Browse Events"
            : `${activeCategory} Events`}
        </h2>

        {/* STATUS FILTER TABS */}

        <div className="status-tabs">

          <button
            className={activeStatus === "All" ? "tab active" : "tab"}
            onClick={() => setActiveStatus("All")}
          >
            All ({allCount})
          </button>

          <button
            className={activeStatus === "Upcoming" ? "tab active" : "tab"}
            onClick={() => setActiveStatus("Upcoming")}
          >
            Upcoming ({upcomingCount})
          </button>

          <button
            className={activeStatus === "Ongoing" ? "tab active" : "tab"}
            onClick={() => setActiveStatus("Ongoing")}
          >
            Ongoing ({ongoingCount})
          </button>

          <button
            className={activeStatus === "Past" ? "tab active" : "tab"}
            onClick={() => setActiveStatus("Past")}
          >
            Past ({pastCount})
          </button>

        </div>

        {/* EVENTS GRID */}

        <div className="events-grid">

  {filteredEvents.length === 0 ? (

    <div className="no-events">
      No events found
    </div>

  ) : (

    filteredEvents.slice(0, visibleEvents).map(event => (

      <EventCard
        key={event._id}
        event={event}
      />

    ))

  )}

</div>

        {/* LOAD MORE */}

        {visibleEvents < filteredEvents.length && (

          <div className="load-more-container">

            <button
              className="load-more-btn"
              onClick={() => setVisibleEvents(prev => prev + 12)}
            >
              Load More Events
            </button>

          </div>

        )}

      </section>

      <Footer />

    </div>

  );

}

export default Events;