import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeaturedEventCard from "../components/FeatureEventsCard";
import EventCard from "../components/EventCard";
import { Search, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import API_URL from "../api";
import {
  getEventLifecycleLabel,
  getEventLifecycleStatus,
  getEventStartDateTime,
  isEventRegistrationOpen,
} from "../utils/eventStatus";

function Events() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [visibleEvents, setVisibleEvents] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams] = useSearchParams();
  const categoryFromURL = searchParams.get("category");

  /* ── Fetch events ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const getRegistrationCount = (event) => {
      if (!isEventRegistrationOpen(event)) {
        return 0;
      }

      const capacity = event.totalCapacity || 1;
      const maxRegistrations = Math.max(0, capacity - 1);
      return Math.floor(Math.random() * (maxRegistrations + 1));
    };

    const fetchEventsData = () => {
      fetch(`${API_URL}/events`)
        .then(res => res.json())
        .then(data => {
          const eventsWithRegistrations = data.map(event => ({
            ...event,
            registeredUsers: getRegistrationCount(event)
          }));
          setEvents(eventsWithRegistrations);
          setFeaturedEvents(eventsWithRegistrations.filter(e => e.isFeatured === true));
        })
        .catch(err => console.log(err));
    };

    fetchEventsData();

    const refreshInterval = setInterval(() => {
      fetchEventsData();
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, []);

  /* ── Category from URL ── */
  useEffect(() => {
    if (categoryFromURL) {
      setActiveCategory(categoryFromURL);
      setActiveStatus("All");
    }
  }, [categoryFromURL]);

  /* ── Derived data ── */
  const categories = [
    "All",
    ...new Set(events.map((e) => e.category).filter(Boolean))
  ];

  const getEventStatus = (event) => {
    return getEventLifecycleLabel(getEventLifecycleStatus(event));
  };

  /* Status priority for sorting */
  const statusPriority = {
    Live: 1,
    Upcoming: 2,
    Ended: 3
  };

  /* ── Category Filter ── */
  const categoryFiltered =
    activeCategory === "All"
      ? events
      : events.filter(e =>
          e.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  /* ── Search Filter ── */
  const searchFiltered = categoryFiltered.filter(event => {
    const query = searchQuery.toLowerCase();

    return (
      event.eventName?.toLowerCase().includes(query) ||
      event.category?.toLowerCase().includes(query) ||
      event.shortDescription?.toLowerCase().includes(query) ||
      event.organizer?.toLowerCase().includes(query) ||
      event.venue?.toLowerCase().includes(query)
    );
  });

  /* ── Status Counts ── */
  const allCount = searchFiltered.length;

  const upcomingCount = searchFiltered.filter(
    e => getEventStatus(e) === "Upcoming"
  ).length;

  const ongoingCount = searchFiltered.filter(
    e => getEventStatus(e) === "Live"
  ).length;

  const pastCount = searchFiltered.filter(
    e => getEventStatus(e) === "Ended"
  ).length;

  const statusTabs = [
    { label: "All", count: allCount },
    { label: "Upcoming", count: upcomingCount },
    { label: "Live", count: ongoingCount },
    { label: "Ended", count: pastCount }
  ];

  /* ── Status Filter ── */
  let filteredEvents =
    activeStatus === "All"
      ? searchFiltered
      : searchFiltered.filter(
          e => getEventStatus(e) === activeStatus
        );

  /* ── Sort events by status ── */
  filteredEvents = filteredEvents.sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);

    if (statusPriority[statusA] !== statusPriority[statusB]) {
      return statusPriority[statusA] - statusPriority[statusB];
    }

    const dateA = getEventStartDateTime(a);
    const dateB = getEventStartDateTime(b);

    const timeA = dateA ? dateA.getTime() : Number.MAX_SAFE_INTEGER;
    const timeB = dateB ? dateB.getTime() : Number.MAX_SAFE_INTEGER;

    return timeA - timeB;
  });

  useEffect(() => {
    setVisibleEvents(12);
  }, [activeCategory, activeStatus, searchQuery]);

  /* ── Shared button classes ── */
  const filterBtn = (active) =>
    `border px-[18px] py-2.5 rounded-full cursor-pointer text-sm transition-all duration-200 ${
      active
        ? "bg-[#9B96E5] text-white border-transparent"
        : "bg-white border-[#ddd] hover:bg-[#F1F1F7]"
    }`;

  const tabBtn = (active) =>
    `px-4 py-2 border-none rounded-full cursor-pointer font-medium text-sm transition-all duration-200 ${
      active
        ? "bg-[#9B96E5] text-white shadow"
        : "bg-transparent text-[#3F3D56] hover:bg-[#F0EEFA]"
    }`;

  return (
    <div className="events-page-wrapper events-shell relative min-h-screen overflow-x-hidden">

      <Navbar />

      <main className="relative z-[1] mx-auto w-full max-w-[1400px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pt-10">

        <section className="events-hero-panel overflow-hidden rounded-[32px] border border-white/90 p-5 shadow-[0_20px_65px_rgba(40,35,70,0.12)] sm:p-8 lg:p-10">
          <div className="relative z-[1] max-w-[900px]">

            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7A76B2] shadow-sm">
                <Sparkles size={14} />
                Discover Campus Energy
              </span>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#2D2B45] sm:text-5xl lg:text-6xl">
                Explore Events
              </h1>

              <p className="mt-3 max-w-[680px] text-base leading-relaxed text-[#6B6A7D] sm:text-lg">
                Find workshops, hackathons, fests, and networking sessions tailored to your interests.
              </p>

              <div className="mt-7 flex w-full items-center rounded-[40px] border border-white/90 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)] sm:max-w-[520px]">
                <Search size={18} className="shrink-0 text-[#9B96E5]" />
                <input
                  type="text"
                  placeholder="Search by event name, category, venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input ml-2.5 flex-1 bg-transparent text-sm text-[#3F3D56] outline-none sm:text-base"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {categories.map(category => (
                  <button
                    key={category}
                    className={filterBtn(activeCategory === category)}
                    onClick={() => {
                      setActiveCategory(category);
                      setActiveStatus("All");

                      window.history.replaceState(
                        null,
                        "",
                        category === "All"
                          ? "/events"
                          : `/events?category=${category}`
                      );
                    }}
                  >
                    {category === "All" ? "All Events" : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {activeCategory === "All" && searchQuery.trim() === "" && (
          <section className="mt-10 rounded-[28px] border border-white/90 bg-white/75 p-5 shadow-[0_12px_30px_rgba(50,45,90,0.08)] backdrop-blur-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#3F3D56] sm:text-[28px]">
                Featured Events
              </h2>

              <span className="rounded-full bg-[#EEEAFE] px-3 py-1 text-xs font-semibold text-[#6D68A8]">
                Top picks this week
              </span>
            </div>

            {featuredEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DAD4F4] bg-[#FBFAFF] p-8 text-center text-sm text-[#6B6A7D]">
                No featured events available right now.
              </div>
            ) : (
              featuredEvents.slice(0, 2).map(event => (
                <FeaturedEventCard
                  key={event._id}
                  _id={event._id}
                  category={event.category}
                  title={event.eventName}
                  description={event.shortDescription}
                  date={`${event.date} • ${event.time}`}
                  location={event.venue}
                  users={`${event.registeredUsers}/${event.totalCapacity} registered`}
                  image={event.eventImage}
                />
              ))
            )}
          </section>
        )}

        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[28px] font-bold text-[#3F3D56]">
              {activeCategory === "All"
                ? "Browse Events"
                : `${activeCategory} Events`}
            </h2>

            <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#6B6A7D] shadow-sm">
              {filteredEvents.length} result{filteredEvents.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="mb-8 flex w-fit flex-wrap gap-2 rounded-[24px] bg-white/90 p-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.06)]">
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

          <div className="events-grid gap-6 lg:gap-7">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[#D7D1F3] bg-white/75 px-5 py-14 text-center text-lg font-medium text-[#6B6A7D]">
                No events found for your current filters.
              </div>
            ) : (
              filteredEvents
                .slice(0, visibleEvents)
                .map(event => (
                  <EventCard key={event._id} event={event} />
                ))
            )}
          </div>

          {visibleEvents < filteredEvents.length && (
            <div className="mt-10 text-center">
              <button
                className="rounded-full bg-[#9B96E5] px-7 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8A85DC]"
                onClick={() => setVisibleEvents(prev => prev + 12)}
              >
                Load More Events
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Events;