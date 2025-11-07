import { useState, useEffect } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import {
  GiTrident,
  GiSkullCrossedBones,
  GiCrown,
  GiSwordman,
  GiShield,
} from "react-icons/gi";
import { FaBolt } from "react-icons/fa";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const BTXTeamsScreen = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPlayVideo(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const greekTeams = [
    {
      id: "zeus",
      name: "Team Zeus",
      title: "Sky Dominators",
      description:
        "Masters of lightning and thunder, commanding the heavens with divine power and strategic supremacy.",
      icon: <FaBolt className="text-4xl text-yellow-400" />,
      color: "from-yellow-500/30 to-orange-500/30",
      borderColor: "border-yellow-400",
      bgGradient: "from-yellow-900/20 via-orange-900/20 to-yellow-900/20",
      image:
        "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg",
      members: [
        "BoatyMcBoatFace",
        "神农ᶦᵒⁿᶻ",
        "ᴿᵒʷRomolusRemus",
        "Poohpo0h",
        "ʙᴛxメ Leonhart",
        "Immortalized",
        "ᵂᴸ ᴛʜᴇ ʟɪᴏɴ",
        "ʸᵃˢᵘᵏᵉLASTOMANIA",
        "ᵇᵗˣASH",
        "KillèrBee",
        "Acz",
        "Erötic Sûshï 亗",
        "Kube",
        "Esvipe",
        "ᵘᵒᵘ wARIm",
        "Bªlbì",
        "wAKIm",
        "ʙᴛxAtilla",
        "ᴬᶠᵏJalalz",
        "Helixz",
        "Žøŗô",
        "Coer",
        "ᵂᴸ MOKA",
        "THE WALL",
        "Kapoios",
        "ᵘᵒᵘ ShadeZ",
        "ᵘᵒᵘ ᴢMᴇᴏWャ",
        "ᵏⁱⁿᵍChouchou",
        "ᵂᴸ Geekゝ",
        "EdriaИᴵᵁ",
        "ᵘᵒᵘ TUM",
        "OscarGlzᴹᵉˣ",
        "ᵘᵒᵘ LUCIFER",
        "ᵘᵒᵘ ZeüS",
        "ᵘᵒᵘ Tyo ˣ",
        "ᵇᵗˣ Cute Toes Kay",
        "Humble Hypraa",
        "YotaTacoma",
        "Ｆｌｅｘｉｅ",
        "ˣᴶᴸ",
        "ᵁʷᵁ AryaHornigold",
        "ʙᴛxメ Draco メ",
        "ᵘᵒᵘKaTouR",
        "Rоcket",
        "ᵇᵗˣMaupa",
        "CườngMT",
        "Enchantreṣs",
        "Cаstiel",
        "BetterCall grimJJ",
        "ᵘᵒᵘHayulz",
      ],
      stats: {
        victories: 156,
        winRate: "89%",
        rank: "Divine Tier",
        specialty: "Aerial Combat",
      },
    },
    {
      id: "poseidon",
      name: "Team Poseidon",
      title: "Ocean Rulers",
      description:
        "Lords of the seas and earthquakes, wielding the power of tsunamis and controlling the depths of battle.",
      icon: <GiTrident className="text-4xl text-blue-400" />,
      color: "from-blue-500/30 to-cyan-500/30",
      borderColor: "border-blue-400",
      bgGradient: "from-blue-900/20 via-cyan-900/20 to-blue-900/20",
      image:
        "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
      members: [
        "BLIИK",
        "S O R E N",
        "lIIIlIlllIlIllI",
        "Narr",
        "ᴅᴀʀᴋメ",
        "BaBaDemouz",
        "亗WIZ么RD",
        "Midget Shisó",
        "ᵘᵒᵘ Hvn",
        "the ONE",
        "ᵘʷᵘ",
        "ᴱᴰᴸ Ethylik",
        "Yvel",
        "CptnObvus",
        "Gothgirls Enjoyer",
        "ᴱᴰᴸ Larnak",
        "tacosbell",
        "Roland67",
        "Kumichan",
        "乂 ʞɔnp pǝuoʇS",
        "Azzaran",
        "ᴮᵗʳ ryaster ヅ",
        "GgstrsCreamSoup",
        "NolanCAV",
        "ᵂᴸ YAZᴱᴱᴰ气",
        "RadouX",
        "TheDeeTee",
        "Exquisite94",
        "SNEAK1453",
        "FerociousPaws",
        "Everglow",
        "Warby",
        "ZhiDark",
        "ᵘᵒᵘ kARim",
        "Don Snake",
        "Whiisp",
        "Niksøn",
        "ᴃᴛẍ MothyMax",
        "Seeo",
        "Titanik",
        "OMAR3221",
        "Plankton BTR",
        "Jw Child",
        "ᵘᵒᵘ Yᴀᴍᴀɴᴀᴋᴀ",
        "A K A R",
        "Mangó",
        "守 ᴍᴀᴅʙᴀʟʟ",
        "Don Po",
        "NolanINF",
        "Zeidrichsama",
        "ĐặngDanh ᵛᶰ㋡",
      ],
      stats: {
        victories: 142,
        winRate: "85%",
        rank: "Divine Tier",
        specialty: "Naval Warfare",
      },
    },
    {
      id: "hades",
      name: "Team Hades",
      title: "Underworld Champions",
      description:
        "Rulers of the underworld and shadows, commanding dark magic and the souls of fallen warriors.",
      icon: <GiSkullCrossedBones className="text-4xl text-purple-400" />,
      color: "from-purple-500/30 to-red-500/30",
      borderColor: "border-purple-400",
      bgGradient: "from-purple-900/20 via-red-900/20 to-purple-900/20",
      image:
        "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg",
      members: [
        "Humble Soju",
        "Joker7even",
        "Ｌ Ｉ Ａㆆᴗㆆ",
        "Pingᴰᴱᴹᴼᴺァ",
        "Nörthwölfş",
        "2K2Ę",
        "ᵘᵒᵘ kAZIm",
        "ᵂᴸ Hùmbłé M Á Ð",
        "ᵂᴸ Just SCɅRY ャ",
        "ᵂᴸSOLO LEVELING",
        "ᵘᵒᵘʟɪʙʀᴀᴅᴇʟ",
        "ᵂᴸDooM",
        "ᵂᴸ Slayゝ",
        "Qatarson",
        "boscat",
        "ᵘᵒᵘCarryBomber",
        "Gagster5",
        "Jack Daniels Farm",
        "ᵀᵒⁿᵗᵒⁿActéoOn",
        "Chemona",
        "ᴬᶠᴷᴊᴏᴋᴇʀꜰᴀᴋᴇ",
        "ᵘᵒᵘ tlne",
        "Ğarius",
        "KingYammy",
        "ᵂᴸ рăın",
        "T1이상혁TheGOAT",
        "ʙᴛxメsᴜᴘʀᴇᴍᴇ ʟᴇᴏ",
        "Farmer Nara",
        "ᵁʷᵁ TahLeV",
        "ᵘᵒᵘT BAG",
        "ᵂᴸSung Jinwoo",
        "メDaenerysメ",
        "デ愛 i S E K A i Z",
        "ᴬᶠᵏHoneyFox",
        "崔ＬｅＶｉ",
        "NIZZAAAAAAAA",
        "ᵘᵒᵘCarry B0",
        "ᴵᴹ Aba",
        "Ilúvatar",
        "Krokette",
        "Prof Diz",
        "Anak KOST",
        "ɢ ᴏ ʀ ɪ ʟ ʟ ᴀ ᴢ",
        "ᵘᵒᵘSouthside",
        "FaceOfBlade",
        "ᴿᵃᵍᵉ ioya",
        "Nhà Cái Kaokey",
        "ᵘᵒᵘShal2py",
        "Falkensr",
        "Ardnahc",
        "SugarWoogy",
      ],
      stats: {
        victories: 134,
        winRate: "82%",
        rank: "Divine Tier",
        specialty: "Psychological Warfare",
      },
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
              BTX TEAMS
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
            title="<b>Legendary</b> Greek <br /> Mythology <b>Teams</b>"
            containerClass="!text-white mb-8 drop-shadow-2xl"
          />

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <FaBolt className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">Zeus</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiTrident className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">
                  Poseidon
                </span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiSkullCrossedBones className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">Hades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {greekTeams.map((team, index) => (
              <motion.div
                key={team.id}
                className={`bg-gradient-to-br ${team.bgGradient} rounded-3xl border-2 ${team.borderColor} overflow-hidden shadow-2xl`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: index * 0.2,
                  },
                }}
                viewport={{ once: true }}
              >
                {/* Team Header */}
                <div className="p-8 border-b border-white/10">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 rounded-full bg-gradient-to-br ${team.color} border-2 ${team.borderColor}`}
                      >
                        {team.icon}
                      </div>
                      <div>
                        <h3 className="text-4xl font-zentry font-black text-white mb-1">
                          {team.name}
                        </h3>
                        <p className="text-lg text-white/70 font-circular-web">
                          {team.title}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-circular-web font-semibold bg-gradient-to-r ${team.color} border ${team.borderColor}`}
                    >
                      {team.stats.rank}
                    </div>
                  </div>
                  <p className="text-white/60 font-circular-web mt-4">
                    {team.description}
                  </p>
                </div>

                {/* Team Members Grid */}
                <div className="p-8">
                  <h4 className="text-2xl font-zentry font-black text-white mb-6 flex items-center gap-2">
                    Team Members
                    <span className="text-lg text-white/60 font-circular-web">
                      ({team.members.length})
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {team.members.map((member, memberIndex) => (
                      <motion.div
                        key={memberIndex}
                        className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.3,
                            delay: memberIndex * 0.01,
                          },
                        }}
                        viewport={{ once: true }}
                      >
                        <span className="text-white font-circular-web text-sm block text-center break-words">
                          {member}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Team Stats Footer */}
                <div className="p-6 bg-black/20 border-t border-white/10">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-white/60 text-sm font-circular-web mb-1">
                        Victories
                      </p>
                      <p className="text-2xl font-zentry font-black text-white">
                        {team.stats.victories}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-circular-web mb-1">
                        Win Rate
                      </p>
                      <p className="text-2xl font-zentry font-black text-white">
                        {team.stats.winRate}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-circular-web mb-1">
                        Rank
                      </p>
                      <p className="text-2xl font-zentry font-black text-white">
                        {team.stats.rank}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-circular-web mb-1">
                        Specialty
                      </p>
                      <p className="text-lg font-zentry font-black text-white">
                        {team.stats.specialty}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BTXTeamsScreen;
