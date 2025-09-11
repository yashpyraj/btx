import { useState } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { GiSwordman, GiHorseHead, GiTreasureMap } from "react-icons/gi";

const CavGuideScreen = ({ onClose }) => {
  const [selectedHero, setSelectedHero] = useState(null);

  const heroData = [
    {
      id: 1,
      position: "1️⃣",
      heroes: ["Emrys", "Bakshi"],
      speed: "51% Speed",
      pet: "Golden Roc",
      artifact: "Spring Blade",
      heroImage: "/img/emry.png",
      talentImage: "/img/talent-tree-1.png"
    },
    {
      id: 2,
      position: "2️⃣",
      heroes: ["Forondil", "Theodore"],
      speed: "51% Speed",
      pet: "Berserk Faedrake",
      artifact: "Oath of Stormpeak",
      heroImage: "/img/hero-pair-2.png",
      talentImage: "/img/talent-tree-2.png"
    },
    {
      id: 3,
      position: "3️⃣",
      heroes: ["Urag", "Tobin"],
      speed: "51% Speed",
      pet: "Blade Manticore",
      artifact: "Wolf-Howl Horn",
      heroImage: "/img/hero-pair-3.png",
      talentImage: "/img/talent-tree-3.png"
    },
    {
      id: 4,
      position: "4️⃣",
      heroes: ["Lieh-Shan", "Nëya"],
      speed: "52% out of battle, 12% in battle",
      pet: "Auric Warhound",
      artifact: "Lunaris",
      heroImage: "/img/niya.png",
      talentImage: "/img/talent-tree-4.png"
    },
    {
      id: 5,
      position: "5️⃣",
      heroes: ["Mardok", "Mogrog"],
      speed: "~50% Speed",
      pet: "Auric Warhound OR Blade Manticore",
      artifact: "KingSlayer (burst) OR Blink Artifacts (reposition)",
      heroImage: "/img/hero-pair-5.png",
      talentImage: "/img/talent-tree-5.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-general">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <IoArrowBack className="text-xl" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-3xl font-zentry font-black text-white tracking-wider">
                <b>CAV GUIDE</b>
              </h1>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Build Overview */}
          <div className="mb-12 p-8 bg-gradient-to-r from-violet-900/30 to-blue-900/30 rounded-2xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <GiHorseHead className="text-3xl text-violet-400" />
              <h2 className="text-2xl font-robert-medium font-black text-white tracking-wide">
                ~51% Sync Cav Build (5 Cavalry)
              </h2>
            </div>
            <p className="text-violet-300 mb-4 font-medium text-lg">
              My personal Talent G1/G2/G3/G4 Cavalry
            </p>
            <p className="text-blue-50/90 leading-relaxed text-base font-circular-web">
              A flexible 5-Cav build balancing speed + damage, ideal for bursting + syncing 
              without sacrificing retreat control. This is the setup I personally use.
            </p>
          </div>

          {/* Formation & Setup */}
          <div className="mb-8">
            <h3 className="text-2xl font-zentry font-black text-white mb-8 flex items-center gap-3 tracking-wide">
              <GiTreasureMap className="text-violet-400" />
              Formation & Setup:
            </h3>

            <div className="grid gap-8">
              {heroData.map((hero) => (
                <div
                  key={hero.id}
                  className="group bg-gradient-to-r from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/20 p-8 hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Hero Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                          {hero.position}
                        </span>
                        <h4 className="text-xl font-zentry font-black text-white tracking-wide">
                          {hero.heroes.join(" / ")}
                        </h4>
                        <span className="text-violet-300 text-base font-medium px-3 py-1 bg-violet-500/20 rounded-full border border-violet-400/30">
                          {hero.speed}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                          <span className="text-blue-300 font-semibold text-sm uppercase tracking-wider">Pet:</span>
                          <span className="text-blue-50 font-medium">{hero.pet}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                          <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wider">Artifact:</span>
                          <span className="text-yellow-50 font-medium">{hero.artifact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hero Images */}
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div 
                          className="w-32 h-32 bg-gradient-to-br from-violet-500/30 to-blue-500/30 rounded-xl border border-white/20 flex items-center justify-center cursor-pointer hover:border-violet-400/70 hover:scale-105 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
                          onClick={() => setSelectedHero({ ...hero, type: 'hero' })}
                        >
                          <img 
                            src={hero.heroImage} 
                            alt={`${hero.heroes.join('/')} heroes`}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center">
                            <GiSwordman className="text-2xl text-violet-400" />
                          </div>
                        </div>
                        <span className="text-sm text-white/70 mt-2 block font-medium">Heroes</span>
                      </div>
                      
                      <div className="text-center">
                        <div 
                          className="w-32 h-32 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl border border-white/20 flex items-center justify-center cursor-pointer hover:border-green-400/70 hover:scale-105 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20"
                          onClick={() => setSelectedHero({ ...hero, type: 'talent' })}
                        >
                          <img 
                            src={hero.talentImage} 
                            alt={`${hero.heroes.join('/')} talent tree`}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center">
                            <GiTreasureMap className="text-2xl text-green-400" />
                          </div>
                        </div>
                        <span className="text-sm text-white/70 mt-2 block font-medium">Talents</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camouflage Note */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/40 rounded-2xl p-8 backdrop-blur-sm">
            <h4 className="text-xl font-zentry font-black text-yellow-300 mb-4 flex items-center gap-3 tracking-wide">
              🪶 Note on Camouflage:
            </h4>
            <div className="space-y-3 text-base text-yellow-50/90 font-circular-web">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Boosts speed by 20–40% only while hidden
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Speed drops from ~52% → ~12% once battle starts
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Retreat is difficult — either secure kills or protect the march
              </p>
              <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                <p className="font-semibold text-yellow-300 mb-2 text-lg">To stabilize speed:</p>
                <p className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400">‣</span>
                  Set to ~52% for syncing
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-yellow-400">‣</span>
                  Use 3 Movement points if retreat feels hard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedHero && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-gradient-to-br from-black/90 to-gray-900/90 rounded-2xl border border-white/30 overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-xl font-zentry font-black text-white tracking-wide">
                {selectedHero.heroes.join(" / ")} - {selectedHero.type === 'hero' ? 'Heroes' : 'Talent Tree'}
              </h3>
              <button
                onClick={() => setSelectedHero(null)}
                className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedHero.type === 'hero' ? selectedHero.heroImage : selectedHero.talentImage}
                alt={`${selectedHero.heroes.join('/')} ${selectedHero.type}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-64 hidden items-center justify-center text-white/60">
                <div className="text-center">
                  {selectedHero.type === 'hero' ? <GiSwordman className="text-4xl mx-auto mb-2" /> : <GiTreasureMap className="text-4xl mx-auto mb-2" />}
                  <p>Image not available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CavGuideScreen;