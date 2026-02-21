import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      className="section text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold mb-4">
        Simplifying College Events, One Click Away
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Discover, register, and manage campus events effortlessly.
      </p>

      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn-primary"
        >
          Explore Events
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn-secondary"
        >
          Create Event
        </motion.button>
      </div>
    </motion.section>
  );
}