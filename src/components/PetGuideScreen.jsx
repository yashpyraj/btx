import { useState, useEffect } from "react";
import {
  IoClose,
  IoArrowBack,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";
import {
  GiDragonHead,
  GiWolfHead,
  GiEagleHead,
  GiDiamonds,
  GiCoins,
  GiTreasureMap,
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";

const PetGuideScreen = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPlayVideo(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const petTiers = [
    {
      id: "low-spend",
      title: "Low Spend Strategy",
      subtitle: "Budget-Friendly Pet Options",
      description:
        "Maximize your efficiency with minimal investment. Perfect for F2P and low-spend players.",
      icon: <GiCoins className="text-3xl text-green-400" />,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-400/30",
      pets: [
        {
          name: "Forest Wolf",
          image:
            "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
          cost: "Free",
          stats: "ATK +15%, DEF +10%",
          description: "Reliable starter pet with solid all-around stats.",
        },
        {
          name: "Mountain Eagle",
          image:
            "https://images.pexels.com/photos/792416/pexels-photo-792416.jpeg",
          cost: "Low",
          stats: "SPD +20%, ATK +12%",
          description: "Speed-focused pet perfect for cavalry formations.",
        },
        {
          name: "River Turtle",
          image:
            "https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg",
          cost: "Low",
          stats: "DEF +25%, HP +15%",
          description: "Defensive powerhouse for tanky builds.",
        },
      ],
    },
    {
      id: "mid-spend",
      title: "Mid Spend Strategy",
      subtitle: "Balanced Investment Pets",
      description:
        "Optimal balance between cost and performance. Great value for moderate spenders.",
      icon: <GiWolfHead className="text-3xl text-blue-400" />,
      color: "from-blue-500/20 to-violet-500/20",
      borderColor: "border-blue-400/30",
      pets: [
        {
          name: "Golden Roc",
          image:
            "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg",
          cost: "Medium",
          stats: "ATK +25%, SPD +18%, CRIT +10%",
          description: "Versatile legendary pet with excellent combat stats.",
        },
        {
          name: "Frost Drake",
          image:
            "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg",
          cost: "Medium",
          stats: "ATK +30%, DEF +20%",
          description: "Powerful dragon with ice abilities and strong offense.",
        },
        {
          name: "Storm Phoenix",
          image:
            "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg",
          cost: "Medium",
          stats: "SPD +35%, ATK +22%, Resurrection",
          description: "Lightning-fast phoenix with revival abilities.",
        },
      ],
    },
    {
      id: "high-spend",
      title: "High Spend Strategy",
      subtitle: "Premium Elite Pets",
      description:
        "Top-tier pets for serious competitors. Maximum power for those who want the best.",
      icon: <GiDragonHead className="text-3xl text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-400/30",
      pets: [
        {
          name: "Celestial Dragon",
          image:
            "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg",
          cost: "High",
          stats: "ATK +40%, DEF +35%, SPD +30%, All Skills +15%",
          description: "Ultimate dragon pet with godlike stats and abilities.",
        },
        {
          name: "Void Leviathan",
          image:
            "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
          cost: "High",
          stats: "ATK +45%, HP +40%, Void Strike",
          description: "Legendary sea monster with devastating void attacks.",
        },
        {
          name: "Primordial Griffin",
          image:
            "https://images.pexels.com/photos/792416/pexels-photo-792416.jpeg",
          cost: "High",
          stats: "SPD +50%, ATK +35%, Flight Mastery",
          description:
            "Ancient griffin with unmatched speed and aerial dominance.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-general overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <IoArrowBack className="text-xl" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-3xl font-zentry font-black text-white tracking-wider">
              PET GUIDE
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-300 via-blue-300 to-yellow-300">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay={shouldPlayVideo}
            loop
            muted
            playsInline
            preload="none"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onLoadedData={() => setIsVideoLoaded(true)}
            style={{
              opacity: isVideoLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            {shouldPlayVideo && (
              <source src="/videos/cod.mp4" type="video/mp4" />
            )}
          </video>

          {/* Loading placeholder */}
          {!isVideoLoaded && shouldPlayVideo && (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-blue-900 to-black flex items-center justify-center">
              <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
            </div>
          )}

          {/* Video overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedTitle
            title="Pet <b>Guide</b>"
            containerClass="!text-white mb-12 drop-shadow-2xl"
          />

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/30 p-12 shadow-2xl">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full flex items-center justify-center border-4 border-yellow-400/50 animate-pulse">
                  <GiDragonHead className="text-6xl text-yellow-300" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  SOON
                </div>
              </div>

              <h2 className="text-5xl font-zentry font-black text-white tracking-wide">
                Coming Soon
              </h2>

              <p className="text-xl font-circular-web text-white/80 max-w-xl leading-relaxed">
                The ultimate pet optimization guide is currently being crafted. Stay tuned for comprehensive strategies across all spending levels.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 border border-white/30">
                  <div className="flex items-center gap-2">
                    <GiCoins className="text-white text-lg" />
                    <span className="text-white font-circular-web font-bold text-sm">
                      Low Spend
                    </span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 border border-white/30">
                  <div className="flex items-center gap-2">
                    <GiWolfHead className="text-white text-lg" />
                    <span className="text-white font-circular-web font-bold text-sm">
                      Mid Spend
                    </span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 border border-white/30">
                  <div className="flex items-center gap-2">
                    <GiDragonHead className="text-white text-lg" />
                    <span className="text-white font-circular-web font-bold text-sm">
                      High Spend
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 bg-black"></div>
    </div>
  );
};

export default PetGuideScreen;
