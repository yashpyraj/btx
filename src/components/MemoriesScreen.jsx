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
      title: "Chapter 1: The Birth of EXP",
      description: "EXP, originally named 'Ex Parvis Magna,' was founded by the gamer Butcher on the 91 server. In their very first season, EXP took on the entire server, especially their rivals CK, and came out victorious. After winning, everyone merged under the EXP banner.",
      image: "https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg",
      date: "Season 1",
      type: "Origin",
      isComingSoon: false,
    },
    {
      id: 2,
      title: "Chapter 2: Rivalry and Respect with BTR",
      description: "Over the next few seasons, EXP faced a powerful kingdom called BTR, full of top-tier players. To make the season more fun and balanced, BTR insisted for EXP to ally with HY and take them both on a 1v2 fight. Although EXP & HY eventually won, they couldn't completely dominate BTR and push them out of the final zone. This rivalry turned into mutual respect, and both sides admired each other's strength.",
      image: "https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg",
      date: "Season 2-3",
      type: "Rivalry",
      isComingSoon: false,
    },
    {
      id: 3,
      title: "Chapter 3: The OP Merge and Collapse",
      description: "After this temporary alliance, EXP and HY tried to merge into a new super-alliance called OP. However, the merge didn't go well, and OP fell apart. EXP had to rebuild from scratch, and they became a smaller alliance, but with a strong loyal core that stuck together.",
      image: "https://images.pexels.com/photos/1420440/pexels-photo-1420440.jpeg",
      date: "Season 4",
      type: "Rebuild",
      isComingSoon: false,
    },
    {
      id: 4,
      title: "Chapter 4: Reuniting with BTR as Allies",
      description: "In a later season, EXP and BTR ended up on the same side, this time forming an alliance rather than fighting each other. Together, they faced a new enemy and grew even closer. This friendship led them to consider a new kind of merge, one built on genuine camaraderie and community rather than just strength.",
      image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg",
      date: "Season 5",
      type: "Alliance",
      isComingSoon: false,
    },
    {
      id: 5,
      title: "Chapter 5: The Birth of BTX",
      description: "When BTR and EXP decided to merge, the game developers limited migration spots. So they had to do it in two waves—first BTR, then EXP, along with some new recruits from other servers. It took a few months but BTX was finally born—not just a big alliance, but a stable, friendly community of players who valued loyalty and friendship.",
      image: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
      date: "Season 6",
      type: "Foundation",
      isComingSoon: false,
    },
    {
      id: 6,
      title: "Larnak's Lost GH",
      description: "The legendary moment when Larnak lost his GH in the most unexpected way. A tale that will be told for generations.",
      image: "https://images.pexels.com/photos/1152854/pexels-photo-1152854.jpeg",
      date: "Season 7",
      type: "Epic Fail",
      isComingSoon: false,
    },
    {
      id: 7,
      title: "Midnight Raid Success",
      description: "That 3 AM raid that caught everyone by surprise. Pure chaos and pure victory.",
      image: "https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg",
      date: "Season 8",
      type: "Raid",
      isComingSoon: true,
    },
    {
      id: 8,
      title: "Championship Win",
      description: "The day we became champions. All the hard work paid off in glory.",
      image: "https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg",
      date: "Season 9",
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl overflow-hidden border-2 border-white/20 hover:border-violet-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/30"
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                  {/* Coming Soon Overlay */}
                  {memory.isComingSoon && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-yellow-400/30 border-3 border-yellow-400 text-yellow-400 text-2xl font-zentry font-black px-8 py-4 rounded-full shadow-xl">
                          COMING SOON
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  {!memory.isComingSoon && (
                    <div className="absolute top-6 left-6 bg-violet-600 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg">
                      {memory.type}
                    </div>
                  )}

                  {/* Like Button */}
                  {!memory.isComingSoon && (
                    <button
                      onClick={() => toggleLike(memory.id)}
                      className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      {likedMemories.has(memory.id) ? (
                        <IoHeart className="text-red-500 text-2xl" />
                      ) : (
                        <IoHeartOutline className="text-white text-2xl" />
                      )}
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-zentry font-black text-white">
                      {memory.title}
                    </h3>
                  </div>

                  <p className="text-base text-white/80 font-circular-web mb-5 leading-relaxed">
                    {memory.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-violet-400 font-bold text-base">{memory.date}</span>
                    {likedMemories.has(memory.id) && (
                      <span className="text-red-400 font-bold flex items-center gap-2 text-base">
                        <IoHeart className="text-xl" /> Liked
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
