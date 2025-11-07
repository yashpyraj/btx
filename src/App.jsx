import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CavGuideScreen from "./components/CavGuideScreen";
import RowLeagueScreen from "./components/RowLeagueScreen";
import PetGuideScreen from "./components/PetGuideScreen";
import BTXTeamsScreen from "./components/BTXTeamsScreen";
import MemoriesScreen from "./components/MemoriesScreen";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="relative min-h-screen w-screen overflow-x-hidden">
            <NavBar />
            <Hero />
            <Features />
            <Contact />
            <Footer />
          </main>
        }
      />
      <Route path="/cav-guide" element={<CavGuideScreen />} />
      <Route path="/row-league" element={<RowLeagueScreen />} />
      <Route path="/pet-guide" element={<PetGuideScreen />} />
      <Route path="/btx-teams" element={<BTXTeamsScreen />} />
      <Route path="/memories" element={<MemoriesScreen />} />
    </Routes>
  );
}

export default App;
