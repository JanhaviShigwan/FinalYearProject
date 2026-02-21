import { motion } from "framer-motion";
import events from "../data/events";

export default function TrendingEvents() {
  return (
    <section className="section">
      <h2 className="section-title">🔥 Trending Events</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className="card p-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-gray-500 text-sm">{event.date}</p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-secondary font-medium">
                {event.registrations} Registered
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn-secondary"
              >
                Register
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}