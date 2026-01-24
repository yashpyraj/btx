import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const CavGuideScreen = lazy(() => import("./components/CavGuideScreen"));
const RowLeagueScreen = lazy(() => import("./components/RowLeagueScreen"));
const PetGuideScreen = lazy(() => import("./components/PetGuideScreen"));
const BTXTeamsScreen = lazy(() => import("./components/BTXTeamsScreen"));
const MemoriesScreen = lazy(() => import("./components/MemoriesScreen"));
const HierarchyTree = lazy(() => import("./components/HierarchyTree"));
const HRScreen = lazy(() => import("./components/HRScreen"));
const PINProtectedAdmin = lazy(() => import("./components/PINProtectedAdmin"));
const PlanningScreen = lazy(() => import("./components/PlanningScreen"));
const PlanningAdmin = lazy(() => import("./components/PlanningAdmin"));
const KvKStatsScreen = lazy(() => import("./components/KvKStatsScreen"));
const KvKAdminWrapper = lazy(() => import("./components/KvKAdminWrapper"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="three-body">
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="relative min-h-screen w-full overflow-x-hidden">
            <NavBar />
            <Hero />
            <Features />
            <Contact />
            <Footer />
          </main>
        }
      />
      <Route
        path="/cav-guide"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <CavGuideScreen />
          </Suspense>
        }
      />
      <Route
        path="/row-league"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <RowLeagueScreen />
          </Suspense>
        }
      />
      <Route
        path="/pet-guide"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PetGuideScreen />
          </Suspense>
        }
      />
      <Route
        path="/btx-teams"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <BTXTeamsScreen />
          </Suspense>
        }
      />
      <Route
        path="/memories"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <MemoriesScreen />
          </Suspense>
        }
      />
      <Route
        path="/hierarchy"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <HierarchyTree />
          </Suspense>
        }
      />
      <Route
        path="/hr"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <HRScreen />
          </Suspense>
        }
      />
      <Route
        path="/hr-admin"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PINProtectedAdmin />
          </Suspense>
        }
      />
      <Route
        path="/planning"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PlanningScreen />
          </Suspense>
        }
      />
      <Route
        path="/planning-admin"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PlanningAdmin />
          </Suspense>
        }
      />
      <Route
        path="/kvk-stats"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <KvKStatsScreen />
          </Suspense>
        }
      />
      <Route
        path="/kvk-admin"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <KvKAdminWrapper />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
