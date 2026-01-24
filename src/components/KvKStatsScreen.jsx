import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ChevronUp, ChevronDown, X } from "lucide-react";

const KvKStatsScreen = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "highest_power", direction: "desc" });
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/kvk_u24065_1767953400618325.csv");
        const text = await response.text();
        const lines = text.split("\n");
        const headers = lines[0].split(",");

        const columnIndexes = {
          home_server: headers.indexOf("home_server"),
          highest_power: headers.indexOf("highest_power"),
          name: headers.indexOf("name"),
          alliance_tag: headers.indexOf("alliance_tag"),
          power: headers.indexOf("power"),
          units_killed: headers.indexOf("units_killed"),
          faction: headers.indexOf("faction"),
          merits: headers.indexOf("merits"),
          legion_power: headers.indexOf("legion_power"),
          tech_power: headers.indexOf("tech_power"),
          building_power: headers.indexOf("building_power"),
          hero_power: headers.indexOf("hero_power"),
          units_dead: headers.indexOf("units_dead"),
          units_healed: headers.indexOf("units_healed"),
          city_sieges: headers.indexOf("city_sieges"),
          defeats: headers.indexOf("defeats"),
          victories: headers.indexOf("victories"),
          gold_spent: headers.indexOf("gold_spent"),
          wood_spent: headers.indexOf("wood_spent"),
          stone_spent: headers.indexOf("stone_spent"),
          mana_spent: headers.indexOf("mana_spent"),
          gems_spent: headers.indexOf("gems_spent"),
          killcount_t5: headers.indexOf("killcount_t5"),
          killcount_t4: headers.indexOf("killcount_t4"),
          killcount_t3: headers.indexOf("killcount_t3"),
          killcount_t2: headers.indexOf("killcount_t2"),
          killcount_t1: headers.indexOf("killcount_t1"),
          resources_given: headers.indexOf("resources_given"),
          helps_given: headers.indexOf("helps_given"),
        };

        const parsedData = [];
        const serverSet = new Set();

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",");
          const server = values[columnIndexes.home_server];
          if (server) {
            serverSet.add(server);
            parsedData.push({
              name: values[columnIndexes.name],
              alliance_tag: values[columnIndexes.alliance_tag],
              power: parseInt(values[columnIndexes.power]) || 0,
              highest_power: parseInt(values[columnIndexes.highest_power]) || 0,
              units_killed: parseInt(values[columnIndexes.units_killed]) || 0,
              faction: values[columnIndexes.faction],
              merits: parseInt(values[columnIndexes.merits]) || 0,
              legion_power: parseInt(values[columnIndexes.legion_power]) || 0,
              tech_power: parseInt(values[columnIndexes.tech_power]) || 0,
              building_power: parseInt(values[columnIndexes.building_power]) || 0,
              hero_power: parseInt(values[columnIndexes.hero_power]) || 0,
              units_dead: parseInt(values[columnIndexes.units_dead]) || 0,
              units_healed: parseInt(values[columnIndexes.units_healed]) || 0,
              city_sieges: parseInt(values[columnIndexes.city_sieges]) || 0,
              defeats: parseInt(values[columnIndexes.defeats]) || 0,
              victories: parseInt(values[columnIndexes.victories]) || 0,
              gold_spent: parseInt(values[columnIndexes.gold_spent]) || 0,
              wood_spent: parseInt(values[columnIndexes.wood_spent]) || 0,
              stone_spent: parseInt(values[columnIndexes.stone_spent]) || 0,
              mana_spent: parseInt(values[columnIndexes.mana_spent]) || 0,
              gems_spent: parseInt(values[columnIndexes.gems_spent]) || 0,
              killcount_t5: parseInt(values[columnIndexes.killcount_t5]) || 0,
              killcount_t4: parseInt(values[columnIndexes.killcount_t4]) || 0,
              killcount_t3: parseInt(values[columnIndexes.killcount_t3]) || 0,
              killcount_t2: parseInt(values[columnIndexes.killcount_t2]) || 0,
              killcount_t1: parseInt(values[columnIndexes.killcount_t1]) || 0,
              resources_given: parseInt(values[columnIndexes.resources_given]) || 0,
              helps_given: parseInt(values[columnIndexes.helps_given]) || 0,
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-white">KvK Stats</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-2">Select Server</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedServer("all")}
                className={`px-4 py-2 rounded font-medium ${
                  selectedServer === "all"
                    ? "bg-white text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                All
              </button>
              {servers.map((server) => (
                <button
                  key={server}
                  onClick={() => setSelectedServer(server)}
                  className={`px-4 py-2 rounded font-medium ${
                    selectedServer === server
                      ? "bg-white text-slate-900"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {server}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Players</p>
              <p className="text-xl font-bold text-white">{players.length}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Total Power</p>
              <p className="text-xl font-bold text-white">{formatNumber(totalPower)}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Total Kills</p>
              <p className="text-xl font-bold text-white">{formatNumber(totalKills)}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Total Mana Spent</p>
              <p className="text-xl font-bold text-white">{formatNumber(totalManaSpent)}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or alliance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
              />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                      Player
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                      Alliance
                    </th>
                    {selectedServer === "all" && (
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">
                        Server
                      </th>
                    )}
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-white"
                      onClick={() => handleSort("highest_power")}
                    >
                      Highest Power <SortIcon columnKey="highest_power" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-white"
                      onClick={() => handleSort("power")}
                    >
                      Current <SortIcon columnKey="power" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-white"
                      onClick={() => handleSort("units_killed")}
                    >
                      Kills <SortIcon columnKey="units_killed" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-white"
                      onClick={() => handleSort("killcount_t5")}
                    >
                      T5 <SortIcon columnKey="killcount_t5" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-white"
                      onClick={() => handleSort("mana_spent")}
                    >
                      Mana <SortIcon columnKey="mana_spent" />
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-white"
                      onClick={() => handleSort("units_dead")}
                    >
                      Dead <SortIcon columnKey="units_dead" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredPlayers.map((player, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-700/50 cursor-pointer"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                      <td className="px-4 py-3 text-white font-medium">{player.name}</td>
                      <td className="px-4 py-3 text-slate-300">{player.alliance_tag}</td>
                      {selectedServer === "all" && (
                        <td className="px-4 py-3 text-center text-slate-400">{player.home_server}</td>
                      )}
                      <td className="px-4 py-3 text-right text-white font-medium">{formatNumber(player.highest_power)}</td>
                      <td className="px-4 py-3 text-right text-slate-300">{formatNumber(player.power)}</td>
                      <td className="px-4 py-3 text-right text-slate-300">{formatNumber(player.units_killed)}</td>
                      <td className="px-4 py-3 text-right text-slate-300">{formatNumber(player.killcount_t5)}</td>
                      <td className="px-4 py-3 text-right text-slate-300">{formatNumber(player.mana_spent)}</td>
                      <td className="px-4 py-3 text-right text-slate-300">{formatNumber(player.units_dead)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-center text-slate-500 text-sm">
            Showing top {filteredPlayers.length} players
            {selectedServer !== "all" ? ` from Server ${selectedServer}` : " across all servers"}
          </p>
        </div>
      </div>

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-lg border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedPlayer.name}</h2>
                <p className="text-sm text-slate-400">[{selectedPlayer.alliance_tag}] - Server {selectedPlayer.home_server}</p>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-700">
                  <tr>
                    <td className="py-3 text-slate-400">Highest Power</td>
                    <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.highest_power)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-400">Current Power</td>
                    <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.power)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-400">Merits</td>
                    <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.merits)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-400">Units Dead</td>
                    <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.units_dead)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-400">Units Healed</td>
                    <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.units_healed)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-400">Mana Spent</td>
                    <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.mana_spent)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 pt-4 border-t border-slate-700">
                <h3 className="text-white font-semibold mb-3">Kill Statistics</h3>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-700">
                    <tr>
                      <td className="py-3 text-slate-400">Total Units Killed</td>
                      <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.units_killed)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-400">T5 Kills</td>
                      <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.killcount_t5)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-400">T4 Kills</td>
                      <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.killcount_t4)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-400">T3 Kills</td>
                      <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.killcount_t3)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-400">T2 Kills</td>
                      <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.killcount_t2)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-400">T1 Kills</td>
                      <td className="py-3 text-right text-white font-semibold">{formatNumber(selectedPlayer.killcount_t1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KvKStatsScreen;
