import Navbar from "./components/Navbar";
import Hero from "./components/HeroSection";
import TrendingEvents from "./components/TrendingEvents";
import Categories from "./components/CategoriesSection";
import Stats from "./components/StatsSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import EventPreview from "./components/EventPreview";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <EventPreview />
      <TrendingEvents />
      <Categories />
      <Stats />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default App;