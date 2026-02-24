import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/events.css";

export default function Events() {
  const categories = [
    "All",
    "Technical",
    "Cultural",
    "Sports",
    "Workshop",
    "Seminar",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  // 🎯 Category-based image collections
  const categoryImages = {
    Technical: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    ],
    Cultural: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063",
      "https://images.unsplash.com/photo-1464375117522-1311dd6d0cd7",
    ],
    Sports: [
      "https://images.unsplash.com/photo-1508098682722-e99c643e7f68",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
      "https://images.unsplash.com/photo-1505842465776-3bfd1881e3c9",
    ],
    Workshop: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      "https://images.unsplash.com/photo-1515169067868-5387ec356754",
      "https://images.unsplash.com/photo-1552664730-d307ca884978",
    ],
    Seminar: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    ],
  };

  // 🗂 Events Data
  const events = [
    {
      id: 1,
      title: "Hackathon 2026",
      category: "Technical",
      date: "12 March 2026",
      location: "Auditorium Hall",
      description:
        "Join us for an intense 24-hour coding competition where innovators build real-world solutions.",
    },
    {
      id: 2,
      title: "Cultural Fest",
      category: "Cultural",
      date: "18 March 2026",
      location: "Main Ground",
      description:
        "A grand celebration of music, dance, drama and creativity.",
    },
    {
      id: 3,
      title: "Football Tournament",
      category: "Sports",
      date: "25 March 2026",
      location: "Sports Complex",
      description:
        "Inter-college football championship with exciting prizes.",
    },
    {
      id: 4,
      title: "AI Workshop",
      category: "Workshop",
      date: "30 March 2026",
      location: "Lab 3",
      description:
        "Hands-on workshop on Artificial Intelligence and Machine Learning.",
    },
    {
      id: 5,
      title: "Startup Seminar",
      category: "Seminar",
      date: "5 April 2026",
      location: "Conference Hall",
      description:
        "Learn startup strategies from successful entrepreneurs.",
    },
  ];

  // 🖼 Generate stable random image per event (prevents image changing on filter)
  const eventsWithImages = useMemo(() => {
    return events.map((event) => {
      const images = categoryImages[event.category];
      const randomImage =
        images[Math.floor(Math.random() * images.length)];

      return {
        ...event,
        image: `${randomImage}?auto=format&fit=crop&w=800&q=80`,
      };
    });
  }, []);

  const filteredEvents =
    activeCategory === "All"
      ? eventsWithImages
      : eventsWithImages.filter(
          (event) => event.category === activeCategory
        );

  return (
    <>
      <Navbar />

      <motion.div
        className="events-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="events-title"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Explore Events
        </motion.h1>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`category-btn ${
                activeCategory === cat ? "active" : ""
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Animated Grid */}
        <motion.div layout className="events-grid">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -10 }}
                className="event-card"
              >
                <img src={event.image} alt={event.title} />

                <div className="event-content">
                  <span className="event-category">
                    {event.category}
                  </span>

                  <h3>{event.title}</h3>
                  <p>{event.date}</p>
                  <p>{event.location}</p>

                  {/* 🔥 View Details Linked */}
                  <Link to={`/events/${event.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="details-btn"
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <Footer />
    </>
  );
}