import Navbar from "./components/Navbar";
import Hero from "./components/HeroSection";
import TrendingEvents from "./components/TrendingEvents";
import Categories from "./components/CategoriesSection";
import Stats from "./components/StatsSection";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CategoriesSection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrendingEvents />
      <Categories />
      <Stats />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}

export default App;