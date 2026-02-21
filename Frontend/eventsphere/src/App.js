import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/HeroSection";
import TrendingEvents from "./components/TrendingEvents";
import Categories from "./components/CategoriesSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import EventPreview from "./components/EventPreview";
import AnimatedSection from "./components/AnimatedSection";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />

      <AnimatedSection>
        <Hero />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <EventPreview />
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <TrendingEvents />
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <Categories />
      </AnimatedSection>

      <AnimatedSection delay={0.5}>
        <HowItWorks />
      </AnimatedSection>

      <AnimatedSection delay={0.6}>
        <Footer />
      </AnimatedSection>
    </motion.div>
  );
}

export default App;