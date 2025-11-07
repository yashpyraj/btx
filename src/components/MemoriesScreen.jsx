import { useState } from "react";
import { IoArrowBack, IoClose, IoHeart, IoHeartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AnimatedTitle from "./AnimatedTitle";

const MemoriesScreen = () => {
  const navigate = useNavigate();
  const [likedMemories, setLikedMemories] = useState(new Set());

  const toggleLike = (id) => {
    setLikedMemories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const memories = [
    {
      id: 1,
      title: "Larnak's Lost GH",
      description: "The legendary moment when Larnak lost his GH in the most unexpected way. A tale that will be told for generations.",
      image: "https://images.pexels.com/photos/1152854/pexels-photo-1152854.jpeg",
      date: "Season 3",
      type: "Epic Fail",
      isComingSoon: false,
    },
    {
      id: 2,
      title: "First Alliance Victory",
      description: "When we claimed our first territory together. The beginning of our legendary journey.",
      image: "https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg",
      date: "Season 1",
      type: "Victory",
      isComingSoon: true,
    },
    {
      id: 3,
      title: "The Great Wall Defense",
      description: "24 hours of non-stop defense against overwhelming odds. We held the line.",
      image: "https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg",
      date: "Season 2",
      type: "Defense",
      isComingSoon: true,
    },
    {
      id: 4,
      title: "Midnight Raid Success",
      description: "That 3 AM raid that caught everyone by surprise. Pure chaos and pure victory.",
      image: "https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg",
      date: "Season 2",
      type: "Raid",
      isComingSoon: true,
    },
    {
      id: 5,
      title: "The Comeback",
      description: "Down to our last fortress, we rallied and turned the tide. Never give up.",
      image: "https://images.pexels.com/photos/1420440/pexels-photo-1420440.jpeg",
      date: "Season 3",
      type: "Victory",
      isComingSoon: true,
    },
    {
      id: 6,
      title: "Alliance Gathering",
      description: "When everyone was online at once. The server couldn't handle our power.",
      image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg",
      date: "Season 1",
      type: "Community",
      isComingSoon: true,
    },
    {
      id: 7,
      title: "Resource War",
      description: "The great resource battle that lasted a week. Strategy, teamwork, and determination.",
      image: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
      date: "Season 2",
      type: "Battle",
      isComingSoon: true,
    },
    {
      id: 8,
      title: "Championship Win",
      description: "The day we became champions. All the hard work paid off in glory.",
      image: "https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg",
      date: "Season 3",
      type: "Victory",
      isComingSoon: true,
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
              MEMORIES
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

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-violet-900/20 via-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedTitle
            title="Epic <b>Moments</b>"
            containerClass="mb-6"
          />
          <p className="text-xl text-white/70 font-circular-web max-w-2xl mx-auto leading-relaxed">
            Relive the legendary battles, unforgettable victories, and hilarious moments that defined our journey together.
          </p>
        </div>
      </section>

      {/* Memories Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Coming Soon Overlay */}
                  {memory.isComingSoon && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-yellow-400/20 border-2 border-yellow-400 text-yellow-400 text-lg font-zentry font-bold px-6 py-3 rounded-full">
                          COMING SOON
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  {!memory.isComingSoon && (
                    <div className="absolute top-4 left-4 bg-violet-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                      {memory.type}
                    </div>
                  )}

                  {/* Like Button */}
                  {!memory.isComingSoon && (
                    <button
                      onClick={() => toggleLike(memory.id)}
                      className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-300 hover:scale-110"
                    >
                      {likedMemories.has(memory.id) ? (
                        <IoHeart className="text-red-500 text-xl" />
                      ) : (
                        <IoHeartOutline className="text-white text-xl" />
                      )}
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-zentry font-bold text-white">
                      {memory.title}
                    </h3>
                  </div>

                  <p className="text-sm text-white/60 font-circular-web mb-4 line-clamp-3">
                    {memory.description}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-violet-400 font-semibold">{memory.date}</span>
                    {likedMemories.has(memory.id) && (
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        <IoHeart /> Liked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-12 text-center border-t border-white/10">
        <p className="text-white/50 font-circular-web text-sm">
          More memories coming soon...
        </p>
      </div>
    </div>
  );
};

export default MemoriesScreen;
