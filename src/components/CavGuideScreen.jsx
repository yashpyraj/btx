import { useState } from "react";
import { IoClose, IoArrowBack, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { GiSwordman, GiHorseHead, GiTreasureMap, GiCrossedSwords, GiShield, GiCrown } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";

const CavGuideScreen = () => {
  const navigate = useNavigate();
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
      description: 'A Cavalry counter set-up built purely for damage. You\'ll win any 5v5 Cavalry fight by following the Order Hit Target I shared here.',
      icon: <GiCrossedSwords className="text-3xl text-red-400" />,
      color: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-400/30',
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
      id: 'sync-cav-mu-hsiang',
      title: '~51% Sync Cav Build with Mu Hsiang',
      subtitle: 'G1/G2/G3/G4 Cavalry',
      description: 'Delivers high damage, synchronized speeds, and no overlapping heroes, so you get maximum value from your stamina. ⚔️🏇 Use this when you need reliable flanks, strong bursts, and precise march sync',
      icon: <GiHorseHead className="text-3xl text-green-400" />,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-400/30',
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
          heroes: ["Forondil", "Kinnara"],
          speed: "51% Speed",
          pet: "Berserk Faedrake",
          artifact: "Oath of Stormpeak",
          heroImage: "/img/hero-pair-2.png",
          talentImage: "/img/talent-tree-2.png",
          notes: [
            "🔸 Mu Hsiang is ideal here — she boosts Berserk's damage significantly",
            "🔸 If Mu Hsiang is used elsewhere, Kinnara still fits great",
            "🔸 Alternative picks: Nika, Mu Hsiang, Mogro (if not used elsewhere)"
          ]
        },
        {
          id: 3,
          position: "3️⃣",
          heroes: ["Theodore", "Alistair"],
          speed: "49% Speed",
          pet: "Blade Manticore (or Golden Roc)",
          artifact: "Sorland Blade OR Blink Artifact",
          heroImage: "/img/hero-pair-3.png",
          talentImage: "/img/talent-tree-3.png",
          notes: [
            "🔸 Depends on playstyle: Theodore / Alistair OR Alistair / Theodore",
            "🔸 Note: Don't expect much from this march. They won't provide strong value on their own, but their role is to support with the artifact and rage cycle.",
            "🔸 Alternatively, make Alistair the main commander and swap the Sorland Blade for Blink artifact to create more utility with mobility."
          ]
        },
        {
          id: 4,
          position: "4️⃣",
          heroes: ["Urag", "Tobin"],
          speed: "51% Speed",
          pet: "Blade Manticore",
          artifact: "Wolf-Howl Horn",
          heroImage: "/img/hero-pair-4.png",
          talentImage: "/img/talent-tree-4.png"
        },
        {
          id: 5,
          position: "5️⃣",
          heroes: ["Lieh-Shan", "Nëya"],
          speed: "~51% speed (up to 56%)",
          pet: "Auric Warhound",
          artifact: "Lunaris",
          heroImage: "/img/niya.png",
          talentImage: "/img/talent-tree-5.png",
          notes: [
            "🔹 Camouflage makes the march harder to spot, but Lunaris complicates speed. It grants 20% to 40% speed while camouflaged (depends on level), but vanishes once battle begins.",
            "🔸 Note: Speed drops from ~52% (40% artifact + 10% hero + 2% talent) to ~12% once battle starts.",
            "🔸 This makes retreating difficult - Be sure of securing kills, or Protect the march and avoid exposing it",
            "🔸 To stabilize and sync: I made it 52% to line up with the other marches, If retreating feels hard, put all 3 points on Movement for better speed stabilization",
            "🔹 Keeps speed around 51–52%, syncing with Theodore's 49%",
            "🔹 Prevents overlap, lag, or delayed recall issues"
          ]
        }
      ],
      specialNotes: []
    },
    {
      id: 'sync-cav',
      title: '~51% Sync Cav Build (5 Cavalry) My personal Talent',
      subtitle: 'G1/G2/G3/G4 Cavalry',
      description: 'A flexible 5-Cav build balancing speed + damage, ideal for bursting + syncing without sacrificing retreat control. This is the setup I personally use.',
      icon: <GiShield className="text-3xl text-blue-400" />,
      color: 'from-blue-500/20 to-violet-500/20',
      borderColor: 'border-blue-400/30',
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
    <div className="min-h-screen bg-[#dfdff0] text-black font-general overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <IoArrowBack className="text-xl" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-3xl font-zentry font-black text-white tracking-wider">
              CAV GUIDE
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
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
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/cod.mp4" type="video/mp4" />
          </video>
          {/* Video overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-4">
          <AnimatedTitle
            title="Master the <b>Art</b> of <br /> Cavalry <b>Combat</b>"
            containerClass="!text-white mb-8 drop-shadow-2xl"
          />
          
          <p className="text-xl font-circular-web text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Comprehensive guides for dominating the battlefield with strategic cavalry formations
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiCrossedSwords className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">3 Build Types</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiSwordman className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">15+ Heroes</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiCrown className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">Pro Strategies</span>
              </div>
            </div>
          </div>

          <Button
            title="Start Learning"
            rightIcon={<TiLocationArrow />}
            containerClass="bg-violet-500 hover:bg-violet-600 text-white border-none"
          />
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Build Sections */}
        <div className="space-y-8">
          {buildData.map((build) => (
            <div key={build.id} className={`bg-gradient-to-r ${build.color} rounded-3xl border ${build.borderColor} backdrop-blur-sm overflow-hidden shadow-xl`}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(build.id)}
                className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-center gap-6 text-left">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    {build.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-zentry font-black text-black mb-2 tracking-wide">
                      {build.title}
                    </h2>
                    <p className="text-violet-600 font-circular-web font-semibold text-xl tracking-wide mb-3">
                      {build.subtitle}
                    </p>
                    <p className="text-black/80 font-circular-web font-medium text-base max-w-4xl">
                      {build.description}
                    </p>
                  </div>
                </div>
                <div className="text-black/70 p-2 bg-white/10 rounded-full">
                  {expandedSections[build.id] ? (
                    <IoChevronUp className="text-2xl" />
                  ) : (
                    <IoChevronDown className="text-2xl" />
                  )}
                </div>
              </button>

              {/* Section Content */}
              {expandedSections[build.id] && (
                <div className="px-8 pb-8">
                  <div className="border-t border-black/10 pt-8">
                    <h3 className="text-2xl font-zentry font-black text-black mb-8 flex items-center gap-3 tracking-wide">
                      <GiTreasureMap className="text-violet-600" />
                      Formation & Setup
                    </h3>

                    <div className="grid gap-6">
                      {build.heroData.map((hero) => (
                        <div
                          key={hero.id}
                          className="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-6 hover:bg-white/80 hover:shadow-xl transition-all duration-500"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Hero Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl font-zentry font-black text-violet-600">
                                  {hero.position}
                                </span>
                                <h4 className="text-xl font-zentry font-black text-black tracking-wide">
                                  {hero.heroes.join(" / ")}
                                </h4>
                                <span className="text-blue-600 text-base font-circular-web font-semibold px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                                  {hero.speed}
                                </span>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <span className="text-blue-600 font-circular-web font-bold text-sm uppercase tracking-wider">Pet:</span>
                                  <span className="text-blue-800 font-circular-web font-semibold text-base">{hero.pet}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                  <span className="text-yellow-600 font-circular-web font-bold text-sm uppercase tracking-wider">Artifact:</span>
                                  <span className="text-yellow-800 font-circular-web font-semibold text-base">{hero.artifact}</span>
                                </div>
                              </div>

                              {/* Hero-specific notes */}
                              {hero.notes && (
                                <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  {hero.notes.map((note, index) => (
                                    <p key={index} className="text-sm text-gray-700 font-circular-web font-medium">
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
                                  className="w-24 h-24 bg-gradient-to-br from-violet-200 to-blue-200 rounded-xl border border-violet-300 flex items-center justify-center cursor-pointer hover:border-violet-500 hover:scale-105 transition-all duration-300 group-hover:shadow-lg"
                                  onClick={() => setSelectedHero({ ...hero, type: 'hero' })}
                                >
                                  <img 
                                    src={hero.heroImage} 
                                    alt={`${hero.heroes.join('/')} heroes`}
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-full h-full hidden items-center justify-center">
                                    <GiSwordman className="text-xl text-violet-600" />
                                  </div>
                                </div>
                                <span className="text-sm text-black/70 mt-2 block font-circular-web font-semibold">Heroes</span>
                              </div>
                              
                              <div className="text-center">
                                <div 
                                  className="w-24 h-24 bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl border border-green-300 flex items-center justify-center cursor-pointer hover:border-green-500 hover:scale-105 transition-all duration-300 group-hover:shadow-lg"
                                  onClick={() => setSelectedHero({ ...hero, type: 'talent' })}
                                >
                                  <img 
                                    src={hero.talentImage} 
                                    alt={`${hero.heroes.join('/')} talent tree`}
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-full h-full hidden items-center justify-center">
                                    <GiTreasureMap className="text-xl text-green-600" />
                                  </div>
                                </div>
                                <span className="text-sm text-black/70 mt-2 block font-circular-web font-semibold">Talents</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special Notes */}
                    {build.specialNotes.length > 0 && (
                      <div className="mt-8 space-y-6">
                        {build.specialNotes.map((note, index) => (
                          <div key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-2xl p-6 backdrop-blur-sm">
                            <h4 className="text-xl font-zentry font-black text-yellow-800 mb-4 tracking-wide">
                              {note.title}
                            </h4>
                            <div className="space-y-2">
                              {note.content.map((line, lineIndex) => (
                                <p key={lineIndex} className="text-base text-yellow-900 font-circular-web font-medium leading-relaxed">
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

        {/* Call to Action */}
        <section className="mt-20 relative py-20 bg-black rounded-3xl text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20" />
          
          <div className="relative z-10 text-center px-8">
            <AnimatedTitle
              title="Ready to <b>dominate</b> <br /> the <b>battlefield</b>?"
              containerClass="mb-8 !text-white"
            />
            
            <p className="text-xl font-circular-web text-white/80 mb-12 max-w-2xl mx-auto">
              Master these cavalry formations and become an unstoppable force in Face of Blade.
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
                onClick={() => window.open('https://yammydashboard.netlify.app/alliance/98ae3d53-0787-4bc8-8b75-38527eac3796', '_blank')}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Image Modal */}
      {selectedHero && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-blue-50">
              <h3 className="text-2xl font-zentry font-black text-black tracking-wide">
                {selectedHero.heroes.join(" / ")} - {selectedHero.type === 'hero' ? 'Heroes' : 'Talent Tree'}
              </h3>
              <button
                onClick={() => setSelectedHero(null)}
                className="text-black/70 hover:text-black transition-all duration-300 hover:scale-110 p-2 hover:bg-black/5 rounded-full"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            <div className="p-6 bg-white">
              <img
                src={selectedHero.type === 'hero' ? selectedHero.heroImage : selectedHero.talentImage}
                alt={`${selectedHero.heroes.join('/')} ${selectedHero.type}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-64 hidden items-center justify-center text-black/60">
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