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

        <div className="relative z-10 text-center px-4">
          <AnimatedTitle
            title="Master the <b>Art</b> of <br /> Pet <b>Optimization</b>"
            containerClass="!text-white mb-8 drop-shadow-2xl"
          />

          <p className="text-xl font-circular-web text-blue-50 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Complete guide to pet strategies across all spending levels - from
            F2P to premium builds
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiCoins className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">
                  Low Spend
                </span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiWolfHead className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">
                  Mid Spend
                </span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiDragonHead className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">
                  High Spend
                </span>
              </div>
            </div>
          </div>

          <Button
            title="Explore Pets"
            rightIcon={<TiLocationArrow />}
            containerClass="bg-violet-500 hover:bg-violet-600 text-white border-none"
          />
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 bg-black">
        {/* Pet Tier Sections */}
        <div className="space-y-8">
          {petTiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl border border-gray-700 backdrop-blur-sm overflow-hidden shadow-xl`}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(tier.id)}
                className="w-full p-8 flex items-center justify-between hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-6 text-left">
                  <div
                    className={`p-4 rounded-2xl backdrop-blur-sm ${tier.id === "low-spend" ? "bg-green-500/20" : tier.id === "mid-spend" ? "bg-blue-500/20" : "bg-purple-500/20"}`}
                  >
                    {tier.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-zentry font-black text-white mb-2 tracking-wide">
                      {tier.title}
                    </h2>
                    <p className="text-violet-600 font-circular-web font-semibold text-xl tracking-wide mb-3">
                      {tier.subtitle}
                    </p>
                    <p className="text-blue-50 font-circular-web font-medium text-base max-w-4xl">
                      {tier.description}
                    </p>
                  </div>
                </div>
                <div className="text-white/70 p-2 bg-white/10 rounded-full">
                  {expandedSections[tier.id] ? (
                    <IoChevronUp className="text-2xl" />
                  ) : (
                    <IoChevronDown className="text-2xl" />
                  )}
                </div>
              </button>

              {/* Section Content */}
              {expandedSections[tier.id] && (
                <div className="px-8 pb-8">
                  <div className="border-t border-gray-700 pt-8">
                    <h3 className="text-2xl font-zentry font-black text-white mb-8 flex items-center gap-3 tracking-wide">
                      <GiTreasureMap className="text-violet-600" />
                      Pet Collection
                    </h3>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {tier.pets.map((pet, index) => (
                        <div
                          key={index}
                          className="group bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-600 p-6 hover:bg-gray-700/80 hover:shadow-xl transition-all duration-500"
                        >
                          <div className="text-center mb-4">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-violet-600 group-hover:border-violet-400 transition-all duration-300">
                              <img
                                src={pet.image}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg";
                                }}
                              />
                            </div>
                            <h4 className="text-xl font-zentry font-black text-white mb-2">
                              {pet.name}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-circular-web font-semibold ${
                                pet.cost === "Free"
                                  ? "bg-green-900/50 text-green-300 border border-green-700"
                                  : pet.cost === "Low"
                                    ? "bg-green-900/50 text-green-300 border border-green-700"
                                    : pet.cost === "Medium"
                                      ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                                      : "bg-purple-900/50 text-purple-300 border border-purple-700"
                              }`}
                            >
                              {pet.cost} Cost
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-700">
                              <span className="text-yellow-300 font-circular-web font-bold text-sm uppercase tracking-wider block mb-1">
                                Stats:
                              </span>
                              <span className="text-yellow-100 font-circular-web font-semibold text-sm">
                                {pet.stats}
                              </span>
                            </div>
                            <p className="text-gray-300 font-circular-web font-medium text-sm leading-relaxed">
                              {pet.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <section className="mt-20 relative py-20 bg-black rounded-3xl text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20" />

          <div className="relative z-10 text-center px-8">
            <AnimatedTitle
              title="Ready to <b>optimize</b> <br /> your <b>pets</b>?"
              containerClass="mb-8 !text-white"
            />

            <p className="text-xl font-circular-web text-white/80 mb-12 max-w-2xl mx-auto">
              Choose your spending strategy and build the perfect pet collection
              for your playstyle.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Button
                title="Join Alliance"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-violet-500 hover:bg-violet-600 text-white border-none"
              />
              <Button
                title="View Dashboard"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-transparent border border-white/30 hover:bg-white/10 text-white"
                onClick={() =>
                  window.open(
                    "https://yammydashboard.netlify.app/alliance/98ae3d53-0787-4bc8-8b75-38527eac3796",
                    "_blank"
                  )
                }
              />
            </div>
          </div>
        </section>
      </div>

      {/* Pet Modal */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-violet-900/50 to-blue-900/50">
              <h3 className="text-2xl font-zentry font-black text-white tracking-wide">
                {selectedTier.title}
              </h3>
              <button
                onClick={() => setSelectedTier(null)}
                className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110 p-2 hover:bg-white/10 rounded-full"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            <div className="p-6 bg-gray-900 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-4 md:grid-cols-2">
                {selectedTier.pets.map((pet, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-4">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="text-lg font-zentry font-black text-white mb-2">
                      {pet.name}
                    </h4>
                    <p className="text-sm text-gray-300">{pet.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetGuideScreen;
