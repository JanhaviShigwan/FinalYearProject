import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";
import { UserPlus, Search, Ticket, PartyPopper } from "lucide-react";
import hackathon from "../assets/hackathon.jpg";
import cultural from "../assets/cultural.jpg";
import tech from "../assets/tech.jpg";

function Home() {
  const events = [
      {
        title: "Hackathon 2026",
        date: "Mar 15",
        image: hackathon,
      },
      {
        title: "Cultural Fest",
        date: "Apr 02",
        image: cultural,
      },
      {
        title: "Tech Summit",
        date: "May 10",
        image: tech,
      },
    ];

     const trendingEvents = [
    {
      title: "Code Clash 2026",
      date: "March 15, 2026",
      location: "MIT Auditorium",
      registered: "342 registered",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      title: "Cultural Nite",
      date: "April 2, 2026",
      location: "Central Arena",
      registered: "578 registered",
      image:
        "https://ln.run/nku0G",
    },
    {
      title: "AI Workshop",
      date: "April 18, 2026",
      location: "Tech Lab 3",
      registered: "215 registered",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    },
    {
      title: "Sports Fest",
      date: "May 5, 2026",
      location: "Main Stadium",
      registered: "890 registered",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },
  ];

const categories = [
    {
      title: "Technical",
      description: "Coding contests & tech talks",
      icon: "💻",
    },
    {
      title: "Cultural",
      description: "Dance, music & art events",
      icon: "🎵",
    },
    {
      title: "Sports",
      description: "Tournaments & fitness challenges",
      icon: "🏆",
    },
    {
      title: "Workshops",
      description: "Hands-on learning sessions",
      icon: "🛠",
    },
    {
      title: "Hackathons",
      description: "Build, innovate & compete",
      icon: "🚀",
    },
  ];

const steps = [
    {
      icon: <UserPlus size={28} />,
      title: "Register",
      desc: "Create your free account in seconds",
    },
    {
      icon: <Search size={28} />,
      title: "Browse Events",
      desc: "Explore events by category or college",
    },
    {
      icon: <Ticket size={28} />,
      title: "Book Ticket",
      desc: "Reserve your spot with one click",
    },
    {
      icon: <PartyPopper size={28} />,
      title: "Attend & Enjoy",
      desc: "Show up and have a great time",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />

      <AnimatedSection>
        <section className="hero-section">
      <motion.div
        className="hero-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        {/* Trusted Badge */}
        <div className="hero-badge">
          ✨ Trusted by 20+ colleges nationwide
        </div>

        {/* Main Heading */}
        <h1 className="hero-title">
          Simplifying College Events,{" "}
          <span className="hero-gradient">
            One Click Away
          </span>
      </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Discover exciting events, connect with fellow students, and manage
          everything from registrations to attendance — all in one powerful platform.
        </p>

        {/* Buttons */}
        <div className="hero-buttons">
          <button className="hero-btn-primary">
            Explore Events →
          </button>

          <button className="hero-btn-secondary">
            Create Event
          </button>
        </div>

      </motion.div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
       <section className="event-preview-section">
      <div className="event-preview-container">
        {events.map((event, index) => (
          <div key={index} className="event-preview-card">
            <div className="event-preview-image-wrapper">
              <img
                src={event.image}
                alt={event.title}
                className="event-preview-image"
              />
            </div>

            <div className="event-preview-content">
              <h3>{event.title}</h3>
              <p>{event.date}</p>
            </div>
          </div>
        ))}
      </div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <section className="trending-section">
      <div className="trending-container">

        <h2 className="trending-title">
          Trending <span className="trending-gradient">Events</span>
        </h2>

        <p className="trending-subtitle">
          Don't miss out on the most popular events happening now
        </p>

        <div className="trending-grid">
          {trendingEvents.map((event, index) => (
            <div key={index} className="trending-card">

              <div className="trending-image-wrapper">
                <img
                  src={event.image}
                  alt={event.title}
                  className="trending-image"
                />
              </div>

              <div className="trending-content">
                <h3>{event.title}</h3>

                <div className="trending-info">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>
                  <p>👥 {event.registered}</p>
                </div>

                <button className="trending-btn">
                  Register Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <section className="categories-section">
      <div className="categories-container">

        <h2 className="categories-title">
          Browse <span className="categories-gradient">Categories</span>
        </h2>

        <p className="categories-subtitle">
          Find events that match your interests and passions
        </p>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">
                {cat.icon}
              </div>

              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
      </AnimatedSection>

      <AnimatedSection delay={0.5}>
        <section className="how-section">
      <div className="how-container">

        <h2 className="how-title">
          How It <span className="how-gradient">Works</span>
        </h2>

        <p className="how-subtitle">
          Get started in four simple steps
        </p>

        {/* Timeline */}
        <div className="how-timeline">
          <div className="how-line"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="how-step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="how-circle">
                <div className="how-number">{index + 1}</div>
                {step.icon}
              </div>

              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
      </AnimatedSection>

      <AnimatedSection delay={0.6}>
        <Footer />
      </AnimatedSection>
    </motion.div>
  );
}

export default Home;