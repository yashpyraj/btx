import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CavGuideScreen from "./components/CavGuideScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <main className="relative min-h-screen w-screen overflow-x-hidden">
          <NavBar />
          <Hero />
          <Features />
          <Contact />
          <Footer />
        </main>
      } />
      <Route path="/cav-guide" element={<CavGuideScreen />} />
    </Routes>
  );
}

export default App;
