import { motion } from "framer-motion";

export default function Hero() {
  return (
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
  );
}