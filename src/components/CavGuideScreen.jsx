import { useState } from "react";
import { IoClose, IoArrowBack, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { GiSwordman, GiHorseHead, GiTreasureMap, GiCrossedSwords, GiShield } from "react-icons/gi";

const CavGuideScreen = ({ onClose }) => {
  const [selectedHero, setSelectedHero] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const buildData = [
    {
      id: 'cav-vs-cav',
      title: '~31% Cavalry vs Cavalry Set-ups',
      subtitle: 'G1/G2/G3/G4 Cavalry',
      description: 'A Cavalry counter set-up built purely for damage. You\'ll win any 5v5 Cavalry fight by following the Order Hit Target I shared here: (Link for the guide in Discord)',
      icon: <GiCrossedSwords className="text-3xl text-red-400" />,
      heroData: [
        {
          id: 1,
          position: "1️⃣",
          heroes: ["Bakshi", "Emrys"],
          speed: "31% Speed",
          pet: "Golden Roc",
          artifact: "Spring Blade",
          heroImage: "/img/emry.png",
          talentImage: "/img/talent-tree-1.png"
        },
        {
          id: 2,
          position: "2️⃣",
          heroes: ["Theodore", "Forondil"],
          speed: "31% Speed",
          pet: "Berserk Faedrake",
          artifact: "Oath of Stormpeak",
          heroImage: "/img/hero-pair-2.png",
          talentImage: "/img/talent-tree-2.png"
        },
        {
          id: 3,
          position: "3️⃣",
          heroes: ["Urag", "Tobin"],
          speed: "31% Speed",
          pet: "Blade Manticore",
          artifact: "Wolf-Howl Horn",
          heroImage: "/img/hero-pair-3.png",
          talentImage: "/img/talent-tree-3.png"
        },
        {
          id: 4,
          position: "4️⃣",
          heroes: ["Lieh-Shan", "Nëya"],
          speed: "50% out of battle, 10% in battle",
          pet: "Auric Warhound",
          artifact: "Lunaris",
          heroImage: "/img/niya.png",
          talentImage: "/img/talent-tree-4.png"
        },
        {
          id: 5,
          position: "5️⃣",
          heroes: ["Mardok", "Mogro"],
          speed: "32% Speed",
          pet: "Auric Warhound OR Blade Manticore",
          artifact: "KingSlayer (burst) OR Blink Artifacts (reposition)",
          heroImage: "/img/hero-pair-5.png",
          talentImage: "/img/talent-tree-5.png"
        }
      ],
      specialNotes: [
        {
          title: "🪶 Note on Lunaris Artifact:",
          content: [
            "Lunaris grants +40% speed, and Nëya adds +10%, totaling +50% speed outside battle.",
            "In combat, Lunaris drops off, leaving only 10% speed from Nëya.",
            "This march will be faster than the rest, so:",
            "✅ Take the risk with one faster march—works well in short fights.",
            "🔄 Or skip Lunaris and use Bakshi's talent tree for full sync.",
            "🎯 Pick burst damage or synced control—your call."
          ]
        },
        {
          title: "📝 Quick Note on 5th March",
          content: [
            "I personally prefer using Skogul or Goresh with Torc artifact as the 5th march.",
            "In strict 5v5 Cavalry duels, this is not recommended, as 4 Cav + 1 Infantry usually loses to full 5 Cav.",
            "Most players will ignore your Infantry march and focus fire on your cavalry, which weakens your overall pressure.",
            "But in team fights, this setup shines. Replacing your 5th Cavalry with Skogul/Goresh + Torc adds major frontline value:",
            "They:",
            "• Draw aggro with Torc",
            "• Deal strong counterattacks when surrounded by enemy Cav",
            "• Block movement & soak damage, forcing enemies to hit them — which is amazing for trades and protects your DPS",
            "🔥 Great in ball fights and close-range clashes"
          ]
        }
      ]
    },
    {
      id: 'sync-cav',
      title: '~51% Sync Cav Build (5 Cavalry) My personal Talent',
      subtitle: 'G1/G2/G3/G4 Cavalry',
      description: 'A flexible 5-Cav build balancing speed + damage, ideal for bursting + syncing without sacrificing retreat control. This is the setup I personally use.',
      icon: <GiShield className="text-3xl text-blue-400" />,
      heroData: [
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
          heroImage: "/img/hero-pair-4.png",
          talentImage: "/img/talent-tree-4.png"
        },
        {
          id: 5,
          position: "5️⃣",
          heroes: ["Mardok", "Mogrog"],
          speed: "~50% Speed",
          pet: "Auric Warhound",
          artifact: "KingSlayer (burst) OR Blink Artifacts (reposition)",
          heroImage: "/img/niya.png",
          talentImage: "/img/talent-tree-5.png"
        }
      ],
      specialNotes: [
        {
          title: "🪶 Note on Camouflage:",
          content: [
            "Boosts speed by 20–40% only while hidden",
            "Speed drops from ~52% → ~12% once battle starts",
            "Retreat is difficult — either secure kills or protect the march",
            "To stabilize speed:",
            "‣ Set to ~52% for syncing",
            "‣ Use 3 Movement points if retreat feels hard"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-circular-web">
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
                <span className="text-sm font-semibold">Back</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-3xl font-circular-web font-black text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-purple-400 bg-clip-text tracking-wider">
                CAV GUIDE
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
          {/* Accordion Sections */}
          <div className="space-y-6">
            {buildData.map((build) => (
              <div key={build.id} className="bg-gradient-to-r from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/20 backdrop-blur-sm overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(build.id)}
                  className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-6 text-left">
                    {build.icon}
                    <div>
                      <h2 className="text-3xl font-circular-web font-black text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-purple-400 bg-clip-text tracking-wide">
                        {build.title}
                      </h2>
                      <p className="text-violet-300 font-circular-web font-semibold text-xl tracking-wide mt-2">
                        {build.subtitle}
                      </p>
                      <p className="text-blue-50/90 font-circular-web font-medium text-base mt-3 max-w-4xl">
                        {build.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-white/70">
                    {expandedSections[build.id] ? (
                      <IoChevronUp className="text-2xl" />
                    ) : (
                      <IoChevronDown className="text-2xl" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {expandedSections[build.id] && (
                  <div className="px-8 pb-8">
                    <div className="border-t border-white/10 pt-8">
                      <h3 className="text-2xl font-circular-web font-black text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-purple-400 bg-clip-text mb-8 flex items-center gap-3 tracking-wide">
                        <GiTreasureMap className="text-violet-400" />
                        🛡️ Formation & Setup:
                      </h3>

                      <div className="space-y-6">
                        {build.heroData.map((hero) => (
                          <div
                            key={hero.id}
                            className="group bg-gradient-to-r from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/20 p-6 hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 backdrop-blur-sm"
                          >
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Hero Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                  <span className="text-3xl font-circular-web font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                                    {hero.position}
                                  </span>
                                  <h4 className="text-xl font-circular-web font-black text-white tracking-wide">
                                    {hero.heroes.join(" / ")}
                                  </h4>
                                  <span className="text-violet-300 text-base font-circular-web font-semibold px-3 py-1 bg-violet-500/20 rounded-full border border-violet-400/30">
                                    {hero.speed}
                                  </span>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                                    <span className="text-blue-300 font-circular-web font-bold text-sm uppercase tracking-wider">Pet:</span>
                                    <span className="text-blue-50 font-circular-web font-semibold text-base">{hero.pet}</span>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                                    <span className="text-yellow-300 font-circular-web font-bold text-sm uppercase tracking-wider">Artifact:</span>
                                    <span className="text-yellow-50 font-circular-web font-semibold text-base">{hero.artifact}</span>
                                  </div>
                                </div>

                                {/* Hero-specific notes */}
                                {hero.notes && (
                                  <div className="mt-4 space-y-2">
                                    {hero.notes.map((note, index) => (
                                      <p key={index} className="text-sm text-blue-50/80 font-circular-web font-medium">
                                        {note}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Hero Images */}
                              <div className="flex gap-4">
                                <div className="text-center">
                                  <div 
                                    className="w-24 h-24 bg-gradient-to-br from-violet-500/30 to-blue-500/30 rounded-xl border border-white/20 flex items-center justify-center cursor-pointer hover:border-violet-400/70 hover:scale-105 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
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
                                      <GiSwordman className="text-xl text-violet-400" />
                                    </div>
                                  </div>
                                  <span className="text-sm text-white/70 mt-2 block font-circular-web font-semibold">Heroes</span>
                                </div>
                                
                                <div className="text-center">
                                  <div 
                                    className="w-24 h-24 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl border border-white/20 flex items-center justify-center cursor-pointer hover:border-green-400/70 hover:scale-105 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20"
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
                                      <GiTreasureMap className="text-xl text-green-400" />
                                    </div>
                                  </div>
                                  <span className="text-sm text-white/70 mt-2 block font-circular-web font-semibold">Talents</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Special Notes */}
                      {build.specialNotes && (
                        <div className="mt-8 space-y-6">
                          {build.specialNotes.map((note, index) => (
                            <div key={index} className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/40 rounded-2xl p-6 backdrop-blur-sm">
                              <h4 className="text-xl font-circular-web font-black text-yellow-300 mb-4 tracking-wide">
                                {note.title}
                              </h4>
                              <div className="space-y-2">
                                {note.content.map((line, lineIndex) => (
                                  <p key={lineIndex} className="text-base text-yellow-50/90 font-circular-web font-medium leading-relaxed">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedHero && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-gradient-to-br from-black/90 to-gray-900/90 rounded-2xl border border-white/30 overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-2xl font-circular-web font-black text-white tracking-wide">
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