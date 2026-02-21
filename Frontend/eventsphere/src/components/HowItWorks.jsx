import { motion } from "framer-motion";
import { UserPlus, Search, Ticket, PartyPopper } from "lucide-react";

export default function HowItWorks() {
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
  );
}