import { useState } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { GiSwordman, GiHorseHead, GiTreasureMap } from "react-icons/gi";

const CavGuideScreen = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <IoArrowBack className="text-xl" />
                <span className="text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-2xl font-zentry font-black text-white">
                <b>CAV GUIDE</b>
              </h1>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Build Overview */}
          <div className="mb-8 p-6 bg-gradient-to-r from-violet-900/20 to-blue-900/20 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <GiHorseHead className="text-3xl text-violet-400" />
              <h2 className="text-xl font-zentry font-black text-white">
                ~51% Sync Cav Build (5 Cavalry)
              </h2>
            </div>
            <p className="text-blue-50/80 mb-4">
              My personal Talent G1/G2/G3/G4 Cavalry
            </p>
            <p className="text-white/90 leading-relaxed">
              A flexible 5-Cav build balancing speed + damage, ideal for bursting + syncing 
              without sacrificing retreat control. This is the setup I personally use.
            </p>
          </div>

          {/* Formation & Setup */}
          <div className="mb-8">
            <h3 className="text-xl font-zentry font-black text-white mb-6 flex items-center gap-2">
              <GiTreasureMap className="text-violet-400" />
              Formation & Setup:
            </h3>

            <div className="grid gap-6">
              {heroData.map((hero) => (
                <div
                  key={hero.id}
                  className="bg-black/40 rounded-xl border border-white/10 p-6 hover:border-violet-400/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Hero Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{hero.position}</span>
                        <h4 className="text-lg font-zentry font-black text-white">
                          {hero.heroes.join(" / ")}
                        </h4>
                        <span className="text-violet-400 text-sm">— {hero.speed}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-white/60">Pet:</span>
                          <span className="text-blue-50">{hero.pet}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/60">Artifact:</span>
                          <span className="text-blue-50">{hero.artifact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hero Images */}
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div 
                          className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-lg border border-white/10 flex items-center justify-center cursor-pointer hover:border-violet-400/50 transition-all duration-300"
                          onClick={() => setSelectedHero({ ...hero, type: 'hero' })}
                        >
                          <img 
                            src={hero.heroImage} 
                            alt={`${hero.heroes.join('/')} heroes`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center">
                            <GiSwordman className="text-2xl text-violet-400" />
                          </div>
                        </div>
                        <span className="text-xs text-white/60 mt-1 block">Heroes</span>
                      </div>
                      
                      <div className="text-center">
                        <div 
                          className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-white/10 flex items-center justify-center cursor-pointer hover:border-green-400/50 transition-all duration-300"
                          onClick={() => setSelectedHero({ ...hero, type: 'talent' })}
                        >
                          <img 
                            src={hero.talentImage} 
                            alt={`${hero.heroes.join('/')} talent tree`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center">
                            <GiTreasureMap className="text-2xl text-green-400" />
                          </div>
                        </div>
                        <span className="text-xs text-white/60 mt-1 block">Talents</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camouflage Note */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
            <h4 className="text-lg font-zentry font-black text-yellow-400 mb-3 flex items-center gap-2">
              🪶 Note on Camouflage:
            </h4>
            <div className="space-y-2 text-sm text-yellow-50/90">
              <p>• Boosts speed by 20–40% only while hidden</p>
              <p>• Speed drops from ~52% → ~12% once battle starts</p>
              <p>• Retreat is difficult — either secure kills or protect the march</p>
              <div className="mt-3">
                <p className="font-semibold text-yellow-400">To stabilize speed:</p>
                <p>‣ Set to ~52% for syncing</p>
                <p>‣ Use 3 Movement points if retreat feels hard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedHero && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-black/80 rounded-xl border border-white/20 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-zentry font-black text-white">
                {selectedHero.heroes.join(" / ")} - {selectedHero.type === 'hero' ? 'Heroes' : 'Talent Tree'}
              </h3>
              <button
                onClick={() => setSelectedHero(null)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedHero.type === 'hero' ? selectedHero.heroImage : selectedHero.talentImage}
                alt={`${selectedHero.heroes.join('/')} ${selectedHero.type}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
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