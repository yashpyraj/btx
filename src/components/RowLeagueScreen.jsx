import { useState } from "react";
import { IoClose, IoArrowBack, IoTrophy, IoCalendar, IoTime, IoPeople } from "react-icons/io5";
import { GiSwordman, GiCrown, GiShield, GiBattleGear, GiTreasureMap } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const RowLeagueScreen = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');

  const tournamentData = {
    overview: {
      title: "Root of War Tournament",
      subtitle: "Epic battles await the strongest warriors",
      description: "Join the ultimate competition where alliances clash in strategic warfare. Prove your dominance and claim your place among legends.",
      stats: [
        { icon: <IoPeople />, label: "Participants", value: "500+" },
        { icon: <IoTrophy />, label: "Prize Pool", value: "$10,000" },
        { icon: <IoCalendar />, label: "Duration", value: "30 Days" },
        { icon: <IoTime />, label: "Battles Daily", value: "24/7" }
      ]
    },
    rules: [
      {
        title: "🏆 Tournament Format",
        content: [
          "• Single elimination bracket system",
          "• Best of 3 matches per round",
          "• Alliance vs Alliance battles",
          "• Maximum 50 members per alliance"
        ]
      },
      {
        title: "⚔️ Battle Rules",
        content: [
          "• All battles must be recorded",
          "• No external assistance allowed",
          "• Standard game rules apply",
          "• Fair play enforcement active"
        ]
      },
      {
        title: "🎯 Scoring System",
        content: [
          "• Victory: 3 points",
          "• Draw: 1 point",
          "• Defeat: 0 points",
          "• Bonus points for style and strategy"
        ]
      }
    ],
    prizes: [
      {
        rank: "1st Place",
        prize: "$5,000",
        rewards: ["Champion Title", "Exclusive Avatar", "Premium Resources"],
        icon: <GiCrown className="text-yellow-400" />
      },
      {
        rank: "2nd Place", 
        prize: "$3,000",
        rewards: ["Runner-up Title", "Special Badge", "Resource Pack"],
        icon: <GiShield className="text-gray-400" />
      },
      {
        rank: "3rd Place",
        prize: "$2,000", 
        rewards: ["Bronze Title", "Achievement Badge", "Bonus Resources"],
        icon: <GiBattleGear className="text-orange-400" />
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <GiTreasureMap /> },
    { id: 'rules', label: 'Rules', icon: <GiShield /> },
    { id: 'prizes', label: 'Prizes', icon: <IoTrophy /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-circular-web">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-white/10">
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
              <h1 className="text-3xl font-circular-web font-black text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text tracking-wider">
                ROW LEAGUE
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

        {/* Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full border border-red-400/50">
                <GiSwordman className="text-6xl text-red-400" />
              </div>
            </div>
            <h2 className="text-5xl font-circular-web font-black text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text mb-4 tracking-wide">
              {tournamentData.overview.title}
            </h2>
            <p className="text-xl text-orange-300 font-circular-web font-semibold mb-4">
              {tournamentData.overview.subtitle}
            </p>
            <p className="text-lg text-white/80 font-circular-web max-w-3xl mx-auto">
              {tournamentData.overview.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {tournamentData.overview.stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-black/60 to-gray-900/60 rounded-2xl border border-white/20 p-6 text-center backdrop-blur-sm">
                <div className="text-3xl text-orange-400 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-circular-web font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70 font-circular-web font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-black/60 rounded-2xl border border-white/20 p-2 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-circular-web font-semibold transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 rounded-2xl border border-white/20 p-8 backdrop-blur-sm">
            {selectedTab === 'overview' && (
              <div className="text-center">
                <h3 className="text-3xl font-circular-web font-black text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text mb-6">
                  Tournament Overview
                </h3>
                <p className="text-lg text-white/80 font-circular-web max-w-4xl mx-auto leading-relaxed">
                  The Root of War Tournament is the ultimate test of strategic warfare and alliance coordination. 
                  Compete against the best alliances from around the world in intense battles that will determine 
                  the true champions of war. With a massive prize pool and exclusive rewards, this tournament 
                  represents the pinnacle of competitive gaming.
                </p>
                <div className="mt-8">
                  <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-circular-web font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                    Register Your Alliance
                  </button>
                </div>
              </div>
            )}

            {selectedTab === 'rules' && (
              <div>
                <h3 className="text-3xl font-circular-web font-black text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text mb-8 text-center">
                  Tournament Rules
                </h3>
                <div className="space-y-6">
                  {tournamentData.rules.map((rule, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/40 rounded-2xl p-6 backdrop-blur-sm">
                      <h4 className="text-xl font-circular-web font-black text-red-300 mb-4">
                        {rule.title}
                      </h4>
                      <div className="space-y-2">
                        {rule.content.map((item, itemIndex) => (
                          <p key={itemIndex} className="text-white/90 font-circular-web font-medium">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'prizes' && (
              <div>
                <h3 className="text-3xl font-circular-web font-black text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text mb-8 text-center">
                  Prize Pool & Rewards
                </h3>
                <div className="space-y-6">
                  {tournamentData.prizes.map((prize, index) => (
                    <div key={index} className="bg-gradient-to-r from-black/60 to-gray-900/60 border border-white/20 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="text-4xl">
                          {prize.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-circular-web font-black text-white mb-2">
                            {prize.rank}
                          </h4>
                          <p className="text-3xl font-circular-web font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-3">
                            {prize.prize}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {prize.rewards.map((reward, rewardIndex) => (
                              <span key={rewardIndex} className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-circular-web font-semibold border border-orange-400/30">
                                {reward}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/40 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-circular-web font-black text-white mb-4">
                Ready to Join the Battle?
              </h3>
              <p className="text-white/80 font-circular-web mb-6 max-w-2xl mx-auto">
                Registration is now open! Gather your alliance and prepare for the ultimate test of strategy and skill.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-circular-web font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                  Register Now
                </button>
                <button className="border border-white/30 hover:border-white/50 text-white font-circular-web font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white/10">
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowLeagueScreen;