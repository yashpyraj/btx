import { useState } from "react";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CavGuideScreen from "./components/CavGuideScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState('main');

  if (currentScreen === 'cavGuide') {
    return <CavGuideScreen onClose={() => setCurrentScreen('main')} />;
  }

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <Features onOpenCavGuide={() => setCurrentScreen('cavGuide')} />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
