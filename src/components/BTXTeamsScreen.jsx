import { useState, useEffect } from "react";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { GiTrident, GiSkullCrossedBones, GiCrown, GiSwordman, GiShield } from "react-icons/gi";
import { FaBolt } from "react-icons/fa";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const BTXTeamsScreen = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState(null);
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
      id: 'zeus',
      name: 'Team Zeus',
      title: 'Sky Dominators',
      description: 'Masters of lightning and thunder, commanding the heavens with divine power and strategic supremacy.',
      icon: <FaBolt className="text-4xl text-yellow-400" />,
      color: 'from-yellow-500/30 to-orange-500/30',
      borderColor: 'border-yellow-400',
      bgGradient: 'from-yellow-900/20 via-orange-900/20 to-yellow-900/20',
      image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg',
      members: [
        { name: 'Thunder King', role: 'Team Captain', power: 'Lightning Strike' },
        { name: 'Storm Caller', role: 'Strategist', power: 'Weather Control' },
        { name: 'Sky Guardian', role: 'Support', power: 'Divine Shield' },
        { name: 'Cloud Walker', role: 'Scout', power: 'Aerial Reconnaissance' }
      ],
      stats: {
        victories: 156,
        winRate: '89%',
        rank: 'Divine Tier',
        specialty: 'Aerial Combat'
      }
    },
    {
      id: 'poseidon',
      name: 'Team Poseidon',
      title: 'Ocean Rulers',
      description: 'Lords of the seas and earthquakes, wielding the power of tsunamis and controlling the depths of battle.',
      icon: <GiTrident className="text-4xl text-blue-400" />,
      color: 'from-blue-500/30 to-cyan-500/30',
      borderColor: 'border-blue-400',
      bgGradient: 'from-blue-900/20 via-cyan-900/20 to-blue-900/20',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
      members: [
        { name: 'Wave Master', role: 'Team Captain', power: 'Tsunami Force' },
        { name: 'Deep Sage', role: 'Strategist', power: 'Ocean Wisdom' },
        { name: 'Tide Turner', role: 'Support', power: 'Current Control' },
        { name: 'Reef Guardian', role: 'Defender', power: 'Coral Barrier' }
      ],
      stats: {
        victories: 142,
        winRate: '85%',
        rank: 'Divine Tier',
        specialty: 'Naval Warfare'
      }
    },
    {
      id: 'hades',
      name: 'Team Hades',
      title: 'Underworld Champions',
      description: 'Rulers of the underworld and shadows, commanding dark magic and the souls of fallen warriors.',
      icon: <GiSkullCrossedBones className="text-4xl text-purple-400" />,
      color: 'from-purple-500/30 to-red-500/30',
      borderColor: 'border-purple-400',
      bgGradient: 'from-purple-900/20 via-red-900/20 to-purple-900/20',
      image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg',
      members: [
        { name: 'Soul Reaper', role: 'Team Captain', power: 'Death Touch' },
        { name: 'Shadow Whisper', role: 'Strategist', power: 'Dark Prophecy' },
        { name: 'Bone Crusher', role: 'Assault', power: 'Necromancy' },
        { name: 'Void Walker', role: 'Infiltrator', power: 'Shadow Step' }
      ],
      stats: {
        victories: 134,
        winRate: '82%',
        rank: 'Divine Tier',
        specialty: 'Psychological Warfare'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-general overflow-x-hidden">
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
              BTX TEAMS
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
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            {shouldPlayVideo && <source src="/videos/cod.mp4" type="video/mp4" />}
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
          
          <p className="text-xl font-circular-web text-blue-50 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Join the divine forces of Zeus, Poseidon, or Hades in epic battles that will determine the fate of BTX
          </p>

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
                <span className="text-white font-zentry font-bold">Poseidon</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <div className="flex items-center gap-2">
                <GiSkullCrossedBones className="text-white text-xl" />
                <span className="text-white font-zentry font-bold">Hades</span>
              </div>
            </div>
          </div>

          <Button
            title="Choose Your Destiny"
            rightIcon={<TiLocationArrow />}
            containerClass="bg-violet-500 hover:bg-violet-600 text-white border-none"
          />
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <AnimatedTitle
            title="Choose Your <b>Divine</b> Alliance"
            containerClass="mb-16 !text-white text-center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {greekTeams.map((team, index) => (
              <motion.div
                key={team.id}
                className={`group relative bg-gradient-to-br ${team.bgGradient} rounded-3xl border-2 ${team.borderColor} overflow-hidden cursor-pointer shadow-2xl`}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
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
                onClick={() => setSelectedTeam(team)}
              >
                {/* Team Icon */}
                <div className="absolute top-6 right-6 z-20">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${team.color} border-2 ${team.borderColor} backdrop-blur-sm`}>
                    {team.icon}
                  </div>
                </div>

                {/* Background Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <motion.img
                    src={team.image}
                    alt={team.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                      e.target.src = "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg";
                    }}
                  />
                </div>

                {/* Team Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h3 className="text-3xl font-zentry font-black text-white mb-2">
                    {team.name}
                  </h3>
                  <p className="text-lg font-circular-web font-semibold text-gray-300 mb-3">
                    {team.title}
                  </p>
                  <p className="text-sm font-circular-web text-gray-400 mb-4 line-clamp-3">
                    {team.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-lg font-zentry font-black text-white">{team.stats.victories}</div>
                        <div className="text-xs text-gray-400">Victories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-zentry font-black text-white">{team.stats.winRate}</div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-circular-web font-semibold bg-gradient-to-r ${team.color} border ${team.borderColor}`}>
                      {team.stats.rank}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <AnimatedTitle
            title="Ready to <b>ascend</b> to <br /> <b>godhood</b>?"
            containerClass="mb-8 !text-white"
          />

          <p className="text-xl font-circular-web text-white/80 mb-12 max-w-2xl mx-auto">
            Choose your divine alliance and prove your worth among the gods. The fate of BTX rests in your hands.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Button
              title="Join Divine Battle"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-violet-500 hover:bg-violet-600 text-white"
            />
            <Button
              title="View Olympus Rankings"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-transparent border border-white/30 hover:bg-white/10 text-white"
            />
          </div>
        </div>
      </section>

      {/* Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className={`flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r ${selectedTeam.bgGradient}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-gradient-to-br ${selectedTeam.color} border-2 ${selectedTeam.borderColor}`}>
                  {selectedTeam.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-zentry font-black text-white tracking-wide">
                    {selectedTeam.name}
                  </h3>
                  <p className="text-lg font-circular-web text-gray-300">{selectedTeam.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110 p-2 hover:bg-white/10 rounded-full"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            
            <div className="p-6 bg-gray-900 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedTeam.image}
                    alt={selectedTeam.name}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  <p className="text-gray-300 font-circular-web mb-4">{selectedTeam.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-zentry font-black text-white">{selectedTeam.stats.victories}</div>
                      <div className="text-sm text-gray-400">Total Victories</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-zentry font-black text-white">{selectedTeam.stats.winRate}</div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-zentry font-black text-white mb-4">Team Members</h4>
                  <div className="space-y-3">
                    {selectedTeam.members.map((member, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-zentry font-black text-white">{member.name}</h5>
                          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">{member.role}</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          <span className="text-violet-400 font-semibold">Power:</span> {member.power}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <h5 className="font-zentry font-black text-white mb-2">Specialty</h5>
                    <p className="text-gray-300">{selectedTeam.stats.specialty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BTXTeamsScreen;