import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/eventdetails.css";
import hackathon from "../assets/hackathon.png";
import fest from "../assets/fest.png";
import workshop from "../assets/workshop.png";

export default function EventDetails() {
  const { id } = useParams();

  const events = [
    {
      id: "1",
      title: "Hackathon 2026",
      category: "Technical",
      date: "12 March 2026",
      location: "Auditorium Hall",
      description:
        "Join us for an intense 24-hour coding competition where innovators build real-world solutions. Exciting prizes and networking opportunities await!",
      image: hackathon,
        
    },
    {
      id: "2",
      title: "Cultural Fest",
      category: "Cultural",
      date: "18 March 2026",
      location: "Main Ground",
      description:
        "Experience music, dance, drama, and unforgettable performances from talented students. A celebration of creativity and culture.",
      image: fest,
    },
    {
      id: "3",
      title: "Football Tournament",
      category: "Sports",
      date: "25 March 2026",
      location: "Sports Complex",
      description:
        "Compete in our inter-college football championship and showcase your skills. Team spirit and sportsmanship at its best!",
      image: workshop,
    },
    {
      id: "4",
      title: "AI Workshop",
      category: "Workshop",
      date: "30 March 2026",
      location: "Lab 3",
      description:
        "Hands-on workshop on Artificial Intelligence and Machine Learning. Learn from industry experts and build smart solutions.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "5",
      title: "Startup Seminar",
      category: "Seminar",
      date: "5 April 2026",
      location: "Conference Hall",
      description:
        "Learn from successful entrepreneurs about launching startups, funding strategies, and business growth insights.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const event = events.find((e) => e.id === id);

  if (!event) {
    return <h2 style={{ padding: "100px" }}>Event Not Found</h2>;
  }

  return (
    <>
      <Navbar />

      <motion.div
        className="event-details-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Banner Image */}
        <motion.div
          className="event-banner"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img src={event.image} alt={event.title} />
        </motion.div>

        {/* Content */}
        <div className="event-details-container">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {event.title}
          </motion.h1>

          <p className="event-meta">
            {event.category} | {event.date} | {event.location}
          </p>

          <p className="event-description">{event.description}</p>

          <div className="details-buttons">
            <button className="register-btn">Register Now</button>

            <Link to="/events">
              <button className="back-btn">Back to Events</button>
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
}