import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import TriageSection from "../components/TriageSection";
import AccessSection from "../components/AccessSection";
import Footer from "../components/Footer";

function Home({ darkMode, setDarkMode }) {
  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app light-mode"
      }
    >
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main>
        <Hero />

        <Features />

        <HowItWorks />

        <TriageSection />

        <AccessSection />
      </main>

      <Footer />
    </div>
  );
}

export default Home;