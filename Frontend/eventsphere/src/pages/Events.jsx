import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

    // 🎲 Random image generator
    const getRandomImage = (category) => {
        const images = categoryImages[category];
        return images[Math.floor(Math.random() * images.length)];
    };

    const events = [
        {
            id: 1,
            title: "Hackathon 2026",
            category: "Technical",
            date: "12 March 2026",
            location: "Auditorium Hall",
        },
        {
            id: 2,
            title: "Cultural Fest",
            category: "Cultural",
            date: "18 March 2026",
            location: "Main Ground",
        },
        {
            id: 3,
            title: "Football Tournament",
            category: "Sports",
            date: "25 March 2026",
            location: "Sports Complex",
        },
        {
            id: 4,
            title: "AI Workshop",
            category: "Workshop",
            date: "30 March 2026",
            location: "Lab 3",
        },
        {
            id: 5,
            title: "Startup Seminar",
            category: "Seminar",
            date: "5 April 2026",
            location: "Conference Hall",
        },
    ];

    const filteredEvents =
        activeCategory === "All"
            ? events
            : events.filter((event) => event.category === activeCategory);

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
                            className={`category-btn ${activeCategory === cat ? "active" : ""
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
                                <img
                                    src={`${getRandomImage(event.category)}?auto=format&fit=crop&w=800&q=80`}
                                    alt={event.title}
                                />

                                <div className="event-content">
                                    <span className="event-category">
                                        {event.category}
                                    </span>

                                    <h3>{event.title}</h3>
                                    <p>{event.date}</p>
                                    <p>{event.location}</p>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="details-btn"
                                    >
                                        View Details
                                    </motion.button>
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