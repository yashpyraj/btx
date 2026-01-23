import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Swords, Shield, Users, Crown, Search, ChevronUp, ChevronDown, Server } from "lucide-react";

const KvKStatsScreen = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "highest_power", direction: "desc" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/kvk_u24065_1767953400618325.csv");
        const text = await response.text();
        const lines = text.split("\n");
        const headers = lines[0].split(",");

        const serverIndex = headers.indexOf("home_server");
        const highestPowerIndex = headers.indexOf("highest_power");
        const nameIndex = headers.indexOf("name");
        const allianceTagIndex = headers.indexOf("alliance_tag");
        const powerIndex = headers.indexOf("power");
        const unitsKilledIndex = headers.indexOf("units_killed");
        const factionIndex = headers.indexOf("faction");
        const killcountT5Index = headers.indexOf("killcount_t5");
        const manaSpentIndex = headers.indexOf("mana_spent");
        const unitsDeadIndex = headers.indexOf("units_dead");
        const unitsHealedIndex = headers.indexOf("units_healed");

        const parsedData = [];
        const serverSet = new Set();

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",");
          const server = values[serverIndex];
          if (server) {
            serverSet.add(server);
            parsedData.push({
              name: values[nameIndex],
              alliance_tag: values[allianceTagIndex],
              power: parseInt(values[powerIndex]) || 0,
              highest_power: parseInt(values[highestPowerIndex]) || 0,
              units_killed: parseInt(values[unitsKilledIndex]) || 0,
              faction: values[factionIndex],
              killcount_t5: parseInt(values[killcountT5Index]) || 0,
              mana_spent: parseInt(values[manaSpentIndex]) || 0,
              units_dead: parseInt(values[unitsDeadIndex]) || 0,
              units_healed: parseInt(values[unitsHealedIndex]) || 0,
              home_server: server,
            });
          }
        }

        const sortedServers = Array.from(serverSet).sort((a, b) => parseInt(a) - parseInt(b));
        setServers(sortedServers);
        setAllPlayers(parsedData);
        if (sortedServers.length > 0) {
          setSelectedServer(sortedServers[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading CSV:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const players = useMemo(() => {
    let filtered = selectedServer === "all"
      ? allPlayers
      : allPlayers.filter((p) => p.home_server === selectedServer);

    filtered.sort((a, b) => b.highest_power - a.highest_power);
    return filtered.slice(0, 200);
  }, [allPlayers, selectedServer]);

  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] - b[sortConfig.key];
      }
      return b[sortConfig.key] - a[sortConfig.key];
    });
  }, [players, sortConfig]);

  const filteredPlayers = useMemo(() => {
    return sortedPlayers.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.alliance_tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedPlayers, searchTerm]);

  const totalPower = players.reduce((sum, p) => sum + p.highest_power, 0);
  const totalKills = players.reduce((sum, p) => sum + p.units_killed, 0);
  const totalT5Kills = players.reduce((sum, p) => sum + p.killcount_t5, 0);
  const totalManaSpent = players.reduce((sum, p) => sum + p.mana_spent, 0);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "desc" ? (
      <ChevronDown className="inline w-4 h-4" />
    ) : (
      <ChevronUp className="inline w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            KvK Stats
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-amber-400" />
              <span className="text-white font-medium">Select Server</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedServer("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedServer === "all"
                    ? "bg-amber-500 text-slate-900"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
              >
                All Servers
              </button>
              {servers.map((server) => (
                <button
                  key={server}
                  onClick={() => setSelectedServer(server)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedServer === server
                      ? "bg-amber-500 text-slate-900"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  Server {server}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-4 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Players (Top 200)</span>
              </div>
              <p className="text-2xl font-bold text-white">{players.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Total Power</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(totalPower)}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <Swords className="w-5 h-5" />
                <span className="text-sm font-medium">Total Kills</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(totalKills)}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Total Mana Spent</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(totalManaSpent)}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or alliance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Alliance
                    </th>
                    {selectedServer === "all" && (
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Server
                      </th>
                    )}
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-amber-400 transition-colors"
                      onClick={() => handleSort("highest_power")}
                    >
                      Highest Power <SortIcon columnKey="highest_power" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-amber-400 transition-colors"
                      onClick={() => handleSort("power")}
                    >
                      Current Power <SortIcon columnKey="power" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-amber-400 transition-colors"
                      onClick={() => handleSort("units_killed")}
                    >
                      Kills <SortIcon columnKey="units_killed" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-amber-400 transition-colors"
                      onClick={() => handleSort("killcount_t5")}
                    >
                      T5 Kills <SortIcon columnKey="killcount_t5" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-amber-400 transition-colors"
                      onClick={() => handleSort("mana_spent")}
                    >
                      Mana Spent <SortIcon columnKey="mana_spent" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-amber-400 transition-colors"
                      onClick={() => handleSort("units_dead")}
                    >
                      Dead <SortIcon columnKey="units_dead" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredPlayers.map((player, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center w-8 h-8">
                          {index < 3 ? (
                            <span
                              className={`text-lg font-bold ${
                                index === 0
                                  ? "text-amber-400"
                                  : index === 1
                                  ? "text-slate-300"
                                  : "text-amber-600"
                              }`}
                            >
                              {index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">{player.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-700/50 rounded text-amber-400 text-sm font-medium">
                          {player.alliance_tag}
                        </span>
                      </td>
                      {selectedServer === "all" && (
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-slate-600/50 rounded text-cyan-400 text-sm font-medium">
                            {player.home_server}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <span className="text-blue-400 font-semibold">{formatNumber(player.highest_power)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-slate-300">{formatNumber(player.power)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-red-400 font-medium">{formatNumber(player.units_killed)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-emerald-400">{formatNumber(player.killcount_t5)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-cyan-400">{formatNumber(player.mana_spent)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-rose-400">{formatNumber(player.units_dead)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-center text-slate-500 text-sm">
            Showing top {filteredPlayers.length} players
            {selectedServer !== "all" ? ` from Server ${selectedServer}` : " across all servers"} by Highest Power
          </div>
        </div>
      </div>
    </div>
  );
};

export default KvKStatsScreen;
