import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeaturedEventCard from "../components/FeatureEventsCard";
import EventCard from "../components/EventCard";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const API = "https://eventsphere-8sgd.onrender.com";

function Events() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState(12);

  const [searchParams] = useSearchParams();
  const categoryFromURL = searchParams.get("category");

  /* ── Fetch events ── */
  useEffect(() => {
    fetch(`${API}/api/events`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setFeaturedEvents(data.filter(e => e.isFeatured === true));
      })
      .catch(err => console.log(err));
  }, []);

  /* ── Category from URL ── */
  useEffect(() => {
    if (categoryFromURL) {
      setActiveCategory(categoryFromURL);
      setActiveStatus("All");
    }
  }, [categoryFromURL]);

  /* ── Derived data ── */
  const categories = ["All", ...new Set(events.map(e => e.category))];

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(`${event.date} ${event.time}`);
    if (eventDate > now) return "Upcoming";
    if (eventDate.toDateString() === now.toDateString()) return "Ongoing";
    return "Past";
  };

  const categoryFiltered =
    activeCategory === "All"
      ? events
      : events.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());

  const allCount      = categoryFiltered.length;
  const upcomingCount = categoryFiltered.filter(e => getEventStatus(e) === "Upcoming").length;
  const ongoingCount  = categoryFiltered.filter(e => getEventStatus(e) === "Ongoing").length;
  const pastCount     = categoryFiltered.filter(e => getEventStatus(e) === "Past").length;

  const statusOrder = { Ongoing: 1, Upcoming: 2, Past: 3 };

  const filteredEvents = (
    activeStatus === "All"
      ? categoryFiltered
      : categoryFiltered.filter(e => getEventStatus(e) === activeStatus)
  ).sort((a, b) => statusOrder[getEventStatus(a)] - statusOrder[getEventStatus(b)]);

  const statusTabs = [
    { label: "All",      count: allCount      },
    { label: "Upcoming", count: upcomingCount  },
    { label: "Ongoing",  count: ongoingCount   },
    { label: "Past",     count: pastCount      },
  ];

  /* ── Shared button classes ── */
  const filterBtn = (active) =>
    `border px-[18px] py-2.5 rounded-full cursor-pointer text-sm transition-all duration-200 ${
      active
        ? "bg-[#9B96E5] text-white border-transparent"
        : "bg-white border-[#ddd] hover:bg-[#F1F1F7]"
    }`;

  const tabBtn = (active) =>
    `px-[18px] py-2 border-none rounded-full cursor-pointer font-medium transition-all duration-200 ${
      active ? "bg-[#9B96E5] text-white" : "bg-transparent text-[#3F3D56]"
    }`;

  return (
    /* Wrapper — ::before animated grid kept in index.css as .events-page-wrapper */
    <div className="events-page-wrapper relative bg-[#F6F1EB] min-h-screen overflow-x-hidden">

      <Navbar />

      <div className="relative px-20 pt-[70px] pb-0 overflow-x-hidden z-[1]">

        {/* ── HERO ── */}
        <div className="relative z-[2] px-20 mb-20">
          <h1 className="text-[64px] font-bold text-[#3F3D56] mb-2.5">Explore Events</h1>
          <p className="text-lg text-[#6B6A7D] mb-9">Discover workshops, hackathons, fests and more</p>

          {/* Search */}
          <div className="flex items-center w-[420px] bg-white rounded-[40px] px-[18px] py-3 mb-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
            <Search size={18} className="text-[#9B96E5] shrink-0" />
            <input
              type="text"
              placeholder="Search events..."
              className="border-none outline-none ml-2.5 w-full text-[15px] bg-transparent"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-3 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                className={filterBtn(activeCategory === category)}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveStatus("All");
                  window.history.replaceState(
                    null, "",
                    category === "All" ? "/events" : `/events?category=${category}`
                  );
                }}
              >
                {category === "All" ? "All Events" : category}
              </button>
            ))}
          </div>
        </div>

        {/* ── FEATURED EVENTS ── */}
        {activeCategory === "All" && (
          <section className="px-20 py-10">
            <h2 className="text-[26px] font-semibold mb-8 text-[#3F3D56]">Featured Events</h2>
            {featuredEvents.slice(0, 2).map(event => (
              <FeaturedEventCard
                key={event._id}
                _id={event._id}
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

      {/* ── BROWSE EVENTS ── */}
      <section className="px-20 py-[60px]">
        <h2 className="text-[28px] font-bold mb-8 text-[#3F3D56]">
          {activeCategory === "All" ? "Browse Events" : `${activeCategory} Events`}
        </h2>

        {/* Status tabs */}
        <div className="flex gap-3 mb-8 bg-white p-1.5 rounded-[40px] w-fit shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
          {statusTabs.map(({ label, count }) => (
            <button
              key={label}
              className={tabBtn(activeStatus === label)}
              onClick={() => setActiveStatus(label)}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Events grid — auto-fill minmax(320px,1fr) kept in index.css as .events-grid */}
        <div className="events-grid gap-[30px]">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-[60px] text-lg text-[#6B6A7D] font-medium">
              No events found
            </div>
          ) : (
            filteredEvents.slice(0, visibleEvents).map(event => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>

        {/* Load more */}
        {visibleEvents < filteredEvents.length && (
          <div className="text-center mt-10">
            <button
              className="px-7 py-3 border-none rounded-full bg-[#9B96E5] text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-[#8A85DC]"
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