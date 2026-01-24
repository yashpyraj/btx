import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ChevronUp, ChevronDown, X, Sun, Moon, Settings, BarChart3, Users, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "../lib/supabase";

const STAT_OPTIONS = [
  { key: "highest_power", label: "Highest Power" },
  { key: "power", label: "Current Power" },
  { key: "units_killed", label: "Units Killed" },
  { key: "killcount_t5", label: "T5 Kills" },
  { key: "killcount_t4", label: "T4 Kills" },
  { key: "mana_spent", label: "Mana Spent" },
  { key: "units_dead", label: "Units Dead" },
  { key: "units_healed", label: "Units Healed" },
  { key: "merits", label: "Merits" },
];

const KvKStatsScreen = () => {
  const [startDatePlayers, setStartDatePlayers] = useState([]);
  const [endDatePlayers, setEndDatePlayers] = useState([]);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "highest_power", direction: "desc" });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isDark, setIsDark] = useState(true);

  const [availableDates, setAvailableDates] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [compareMode, setCompareMode] = useState(false);

  const [activeTab, setActiveTab] = useState("leaderboard");
  const [compareServers, setCompareServers] = useState([]);
  const [compareStat, setCompareStat] = useState("highest_power");
  const [serverRankingStat, setServerRankingStat] = useState("highest_power");

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (startDate) {
      fetchStartDateData();
    }
  }, [startDate]);

  useEffect(() => {
    if (compareMode && endDate) {
      fetchEndDateData();
    } else {
      setEndDatePlayers([]);
    }
  }, [compareMode, endDate]);

  const fetchAvailableDates = async () => {
    setLoading(true);
    try {
      const { data: uploads, error } = await supabase
        .from("kvk_uploads")
        .select("id, upload_date, record_count")
        .order("upload_date", { ascending: false });

      if (error) throw error;

      if (uploads && uploads.length > 0) {
        setAvailableDates(uploads);
        setStartDate(uploads[0].upload_date);
        if (uploads.length > 1) {
          setEndDate(uploads[1].upload_date);
        }
      }
    } catch (error) {
      console.error("Error fetching dates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStartDateData = async () => {
    setLoading(true);
    try {
      const upload = availableDates.find(u => u.upload_date === startDate);
      if (!upload) return;

      const { data: players, error } = await supabase
        .from("kvk_player_stats")
        .select("*")
        .eq("upload_id", upload.id);

      if (error) throw error;

      const serverSet = new Set();
      players.forEach(p => serverSet.add(p.home_server));
      const sortedServers = Array.from(serverSet).sort((a, b) => parseInt(a) - parseInt(b));

      setServers(sortedServers);
      setStartDatePlayers(players);
      setSelectedServer("all");
    } catch (error) {
      console.error("Error fetching start date data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEndDateData = async () => {
    try {
      const upload = availableDates.find(u => u.upload_date === endDate);
      if (!upload) return;

      const { data: players, error } = await supabase
        .from("kvk_player_stats")
        .select("*")
        .eq("upload_id", upload.id);

      if (error) throw error;

      setEndDatePlayers(players);
    } catch (error) {
      console.error("Error fetching end date data:", error);
    }
  };

  const allPlayers = compareMode && endDatePlayers.length > 0 ? endDatePlayers : startDatePlayers;

  const filteredByServer = useMemo(() => {
    if (selectedServer === "all") return allPlayers;
    return allPlayers.filter(p => p.home_server === selectedServer);
  }, [allPlayers, selectedServer]);

  const rankedPlayers = useMemo(() => {
    if (!compareMode || endDatePlayers.length === 0) {
      const sorted = [...filteredByServer].sort((a, b) => b[sortConfig.key] - a[sortConfig.key]);
      return sorted.map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
    }

    const endFiltered = selectedServer === "all" ? endDatePlayers : endDatePlayers.filter(p => p.home_server === selectedServer);
    const startFiltered = selectedServer === "all" ? startDatePlayers : startDatePlayers.filter(p => p.home_server === selectedServer);

    const sorted = [...endFiltered].sort((a, b) => b[sortConfig.key] - a[sortConfig.key]);

    return sorted.map((player, index) => {
      const oldPlayer = startFiltered.find(p => p.lord_id === player.lord_id);
      const statDiff = oldPlayer ? player[sortConfig.key] - oldPlayer[sortConfig.key] : 0;

      let oldRank = null;
      if (oldPlayer) {
        const oldSorted = [...startFiltered].sort((a, b) => b[sortConfig.key] - a[sortConfig.key]);
        oldRank = oldSorted.findIndex(p => p.lord_id === player.lord_id) + 1;
      }

      return {
        ...player,
        rank: index + 1,
        oldRank,
        statDiff,
        isNew: !oldPlayer,
      };
    });
  }, [filteredByServer, endDatePlayers, startDatePlayers, selectedServer, sortConfig.key, compareMode]);

  const sortedPlayers = useMemo(() => {
    return [...rankedPlayers].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] - b[sortConfig.key];
      }
      return b[sortConfig.key] - a[sortConfig.key];
    });
  }, [rankedPlayers, sortConfig]);

  const filteredPlayers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sortedPlayers.filter(player =>
      player.name.toLowerCase().includes(term) ||
      player.alliance_tag.toLowerCase().includes(term) ||
      player.lord_id.toString().includes(term)
    );
  }, [sortedPlayers, searchTerm]);

  const getPlayerServerRank = (player, stat) => {
    const serverPlayers = allPlayers.filter(p => p.home_server === player.home_server);
    const sorted = [...serverPlayers].sort((a, b) => b[stat] - a[stat]);
    return sorted.findIndex(p => p.lord_id === player.lord_id) + 1;
  };

  const serverStats = useMemo(() => {
    const stats = {};
    servers.forEach(server => {
      const serverPlayers = allPlayers.filter(p => p.home_server === server);
      const startServerPlayers = startDatePlayers.filter(p => p.home_server === server);

      stats[server] = {
        playerCount: serverPlayers.length,
        totalPower: serverPlayers.reduce((sum, p) => sum + p.highest_power, 0),
        totalKills: serverPlayers.reduce((sum, p) => sum + p.units_killed, 0),
        totalT5Kills: serverPlayers.reduce((sum, p) => sum + p.killcount_t5, 0),
        totalMana: serverPlayers.reduce((sum, p) => sum + p.mana_spent, 0),
        avgPower: serverPlayers.length > 0 ? serverPlayers.reduce((sum, p) => sum + p.highest_power, 0) / serverPlayers.length : 0,
      };

      if (compareMode && endDatePlayers.length > 0) {
        const oldTotalPower = startServerPlayers.reduce((sum, p) => sum + p.highest_power, 0);
        const oldTotalKills = startServerPlayers.reduce((sum, p) => sum + p.units_killed, 0);
        stats[server].powerDiff = stats[server].totalPower - oldTotalPower;
        stats[server].killsDiff = stats[server].totalKills - oldTotalKills;
      }
    });
    return stats;
  }, [allPlayers, startDatePlayers, endDatePlayers, servers, compareMode]);

  const serverRankings = useMemo(() => {
    const rankings = servers.map(server => {
      const serverPlayers = allPlayers.filter(p => p.home_server === server);
      const total = serverPlayers.reduce((sum, p) => sum + (p[serverRankingStat] || 0), 0);
      const avg = serverPlayers.length > 0 ? total / serverPlayers.length : 0;

      let oldRank = null;
      let totalDiff = 0;
      if (compareMode && endDatePlayers.length > 0) {
        const startServerPlayers = startDatePlayers.filter(p => p.home_server === server);
        const oldTotal = startServerPlayers.reduce((sum, p) => sum + (p[serverRankingStat] || 0), 0);
        totalDiff = total - oldTotal;

        const oldRankings = servers.map(s => {
          const sPlayers = startDatePlayers.filter(p => p.home_server === s);
          const sTotal = sPlayers.reduce((sum, p) => sum + (p[serverRankingStat] || 0), 0);
          return { server: s, total: sTotal };
        });
        oldRankings.sort((a, b) => b.total - a.total);
        oldRank = oldRankings.findIndex(r => r.server === server) + 1;
      }

      return { server, total, avg, playerCount: serverPlayers.length, oldRank, totalDiff };
    });
    return rankings.sort((a, b) => b.total - a.total);
  }, [allPlayers, startDatePlayers, endDatePlayers, servers, serverRankingStat, compareMode]);

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

  const toggleCompareServer = (server) => {
    setCompareServers(prev => {
      if (prev.includes(server)) {
        return prev.filter(s => s !== server);
      }
      if (prev.length < 4) {
        return [...prev, server];
      }
      return prev;
    });
  };

  const totalPower = filteredByServer.reduce((sum, p) => sum + p.highest_power, 0);
  const totalKills = filteredByServer.reduce((sum, p) => sum + p.units_killed, 0);
  const totalManaSpent = filteredByServer.reduce((sum, p) => sum + p.mana_spent, 0);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "desc" ? (
      <ChevronDown className="inline w-4 h-4" />
    ) : (
      <ChevronUp className="inline w-4 h-4" />
    );
  };

  if (loading && availableDates.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-gray-100"}`}>
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );
  }

  if (availableDates.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <div className={`fixed top-0 left-0 right-0 z-50 border-b ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className={`flex items-center gap-2 ${isDark ? "text-slate-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>KvK Stats</h1>
            <div className="flex items-center gap-2">
              <Link to="/kvk-admin" className={`p-2 rounded-lg ${isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                <Settings className="w-5 h-5" />
              </Link>
              <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className={`text-xl ${isDark ? "text-slate-400" : "text-gray-500"}`}>No KvK data available</p>
          <Link to="/kvk-admin" className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">
            Upload Data
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      <div className={`fixed top-0 left-0 right-0 z-50 border-b ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${isDark ? "text-slate-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>KvK Stats</h1>
          <div className="flex items-center gap-2">
            <Link to="/kvk-admin" className={`p-2 rounded-lg ${isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              <Settings className="w-5 h-5" />
            </Link>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === "leaderboard" ? (isDark ? "bg-emerald-600 text-white" : "bg-emerald-600 text-white") : (isDark ? "bg-slate-800 text-slate-300" : "bg-white text-gray-600 border border-gray-200")}`}
            >
              <Users className="w-4 h-4" />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === "compare" ? (isDark ? "bg-emerald-600 text-white" : "bg-emerald-600 text-white") : (isDark ? "bg-slate-800 text-slate-300" : "bg-white text-gray-600 border border-gray-200")}`}
            >
              <BarChart3 className="w-4 h-4" />
              Compare Servers
            </button>
            <button
              onClick={() => setActiveTab("rankings")}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === "rankings" ? (isDark ? "bg-emerald-600 text-white" : "bg-emerald-600 text-white") : (isDark ? "bg-slate-800 text-slate-300" : "bg-white text-gray-600 border border-gray-200")}`}
            >
              <Trophy className="w-4 h-4" />
              Server Rankings
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                  Compare between dates
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  {compareMode ? "Start Date" : "Select Date"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((upload) => (
                    <button
                      key={upload.upload_date}
                      onClick={() => setStartDate(upload.upload_date)}
                      className={`px-4 py-2 rounded font-medium ${
                        startDate === upload.upload_date
                          ? "bg-emerald-600 text-white"
                          : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {new Date(upload.upload_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </button>
                  ))}
                </div>
              </div>

              {compareMode && (
                <div>
                  <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    End Date
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((upload) => (
                      <button
                        key={upload.upload_date}
                        onClick={() => setEndDate(upload.upload_date)}
                        disabled={upload.upload_date === startDate}
                        className={`px-4 py-2 rounded font-medium ${
                          endDate === upload.upload_date
                            ? "bg-blue-600 text-white"
                            : upload.upload_date === startDate
                            ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                            : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {new Date(upload.upload_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {activeTab === "leaderboard" && (
            <>
              <div className="mb-6">
                <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Select Server</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedServer("all")}
                    className={`px-4 py-2 rounded font-medium ${
                      selectedServer === "all"
                        ? isDark ? "bg-white text-slate-900" : "bg-gray-900 text-white"
                        : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
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
                          ? isDark ? "bg-white text-slate-900" : "bg-gray-900 text-white"
                          : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {server}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className={`rounded-lg p-4 ${isDark ? "bg-slate-800" : "bg-white border border-gray-200"}`}>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Players</p>
                  <p className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{filteredByServer.length}</p>
                </div>
                <div className={`rounded-lg p-4 ${isDark ? "bg-slate-800" : "bg-white border border-gray-200"}`}>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Total Power</p>
                  <p className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(totalPower)}</p>
                </div>
                <div className={`rounded-lg p-4 ${isDark ? "bg-slate-800" : "bg-white border border-gray-200"}`}>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Total Kills</p>
                  <p className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(totalKills)}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-500" : "text-gray-400"}`} />
                  <input
                    type="text"
                    placeholder="Search by name, alliance, or lord ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full rounded-lg py-2.5 pl-10 pr-4 focus:outline-none ${
                      isDark
                        ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-slate-600"
                        : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300"
                    }`}
                  />
                </div>
              </div>

              <div className={`rounded-lg border overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Rank</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Player</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Alliance</th>
                        {selectedServer === "all" && (
                          <th className={`px-4 py-3 text-center text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Server</th>
                        )}
                        <th className={`px-4 py-3 text-right text-xs font-medium uppercase cursor-pointer ${isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`} onClick={() => handleSort("highest_power")}>
                          Power <SortIcon columnKey="highest_power" />
                        </th>
                        <th className={`px-4 py-3 text-right text-xs font-medium uppercase cursor-pointer ${isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`} onClick={() => handleSort("units_killed")}>
                          Kills <SortIcon columnKey="units_killed" />
                        </th>
                        <th className={`px-4 py-3 text-right text-xs font-medium uppercase cursor-pointer ${isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`} onClick={() => handleSort("killcount_t5")}>
                          T5 <SortIcon columnKey="killcount_t5" />
                        </th>
                        <th className={`px-4 py-3 text-right text-xs font-medium uppercase cursor-pointer ${isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`} onClick={() => handleSort("mana_spent")}>
                          Mana <SortIcon columnKey="mana_spent" />
                        </th>
                        {compareMode && endDatePlayers.length > 0 && (
                          <th className={`px-4 py-3 text-center text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Change</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-100"}`}>
                      {filteredPlayers.slice(0, 200).map((player) => (
                        <tr key={player.id} className={`cursor-pointer ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`} onClick={() => setSelectedPlayer(player)}>
                          <td className={`px-4 py-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">#{player.rank}</span>
                              {compareMode && player.oldRank && (
                                <span className={`text-xs ${player.rank < player.oldRank ? "text-green-400" : player.rank > player.oldRank ? "text-red-400" : "text-slate-500"}`}>
                                  {player.rank < player.oldRank ? `↑${player.oldRank - player.rank}` : player.rank > player.oldRank ? `↓${player.rank - player.oldRank}` : "−"}
                                </span>
                              )}
                              {compareMode && player.isNew && (
                                <span className="text-xs text-blue-400">NEW</span>
                              )}
                            </div>
                          </td>
                          <td className={`px-4 py-3 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{player.name}</td>
                          <td className={`px-4 py-3 ${isDark ? "text-slate-300" : "text-gray-600"}`}>{player.alliance_tag}</td>
                          {selectedServer === "all" && (
                            <td className={`px-4 py-3 text-center ${isDark ? "text-slate-400" : "text-gray-500"}`}>{player.home_server}</td>
                          )}
                          <td className={`px-4 py-3 text-right font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(player.highest_power)}</td>
                          <td className={`px-4 py-3 text-right ${isDark ? "text-slate-300" : "text-gray-600"}`}>{formatNumber(player.units_killed)}</td>
                          <td className={`px-4 py-3 text-right ${isDark ? "text-slate-300" : "text-gray-600"}`}>{formatNumber(player.killcount_t5)}</td>
                          <td className={`px-4 py-3 text-right ${isDark ? "text-slate-300" : "text-gray-600"}`}>{formatNumber(player.mana_spent)}</td>
                          {compareMode && endDatePlayers.length > 0 && (
                            <td className="px-4 py-3 text-center">
                              {player.statDiff !== 0 ? (
                                <div className={`flex items-center justify-center gap-1 ${player.statDiff > 0 ? "text-green-400" : "text-red-400"}`}>
                                  {player.statDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  <span className="text-xs font-medium">{formatNumber(Math.abs(player.statDiff))}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500">−</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className={`mt-4 text-center text-sm ${isDark ? "text-slate-500" : "text-gray-500"}`}>
                Showing {Math.min(filteredPlayers.length, 200)} of {filteredPlayers.length} players
                {selectedServer !== "all" ? ` from Server ${selectedServer}` : " across all servers"}
              </p>
            </>
          )}

          {activeTab === "compare" && (
            <div>
              <div className="mb-6">
                <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Select Servers to Compare (max 4)</p>
                <div className="flex flex-wrap gap-2">
                  {servers.map((server) => (
                    <button
                      key={server}
                      onClick={() => toggleCompareServer(server)}
                      className={`px-4 py-2 rounded font-medium ${
                        compareServers.includes(server)
                          ? "bg-emerald-600 text-white"
                          : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {server}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Compare By</p>
                <select
                  value={compareStat}
                  onChange={(e) => setCompareStat(e.target.value)}
                  className={`px-4 py-2 rounded-lg ${isDark ? "bg-slate-800 text-white border-slate-700" : "bg-white text-gray-900 border-gray-200"} border`}
                >
                  {STAT_OPTIONS.map(opt => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {compareServers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {compareServers.map((server) => {
                    const stats = serverStats[server];
                    const serverPlayers = allPlayers.filter(p => p.home_server === server);
                    const total = serverPlayers.reduce((sum, p) => sum + (p[compareStat] || 0), 0);
                    const avg = serverPlayers.length > 0 ? total / serverPlayers.length : 0;

                    return (
                      <div key={server} className={`rounded-lg p-6 ${isDark ? "bg-slate-800" : "bg-white border border-gray-200"}`}>
                        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Server {server}</h3>
                        <div className="space-y-3">
                          <div>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Players</p>
                            <p className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{stats.playerCount}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Total {STAT_OPTIONS.find(o => o.key === compareStat)?.label}</p>
                            <p className={`text-xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{formatNumber(total)}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Average</p>
                            <p className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(Math.round(avg))}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={`text-center py-8 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Select servers to compare</p>
              )}
            </div>
          )}

          {activeTab === "rankings" && (
            <div>
              <div className="mb-6">
                <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Rank By</p>
                <select
                  value={serverRankingStat}
                  onChange={(e) => setServerRankingStat(e.target.value)}
                  className={`px-4 py-2 rounded-lg ${isDark ? "bg-slate-800 text-white border-slate-700" : "bg-white text-gray-900 border-gray-200"} border`}
                >
                  {STAT_OPTIONS.map(opt => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={`rounded-lg border overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Rank</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Server</th>
                      <th className={`px-4 py-3 text-right text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Players</th>
                      <th className={`px-4 py-3 text-right text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Total {STAT_OPTIONS.find(o => o.key === serverRankingStat)?.label}</th>
                      <th className={`px-4 py-3 text-right text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Average</th>
                      {compareMode && endDatePlayers.length > 0 && (
                        <th className={`px-4 py-3 text-center text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Change</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-100"}`}>
                    {serverRankings.map((item, index) => (
                      <tr key={item.server} className={isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}>
                        <td className={`px-4 py-3 ${index < 3 ? (isDark ? "text-yellow-400" : "text-yellow-600") : (isDark ? "text-slate-400" : "text-gray-500")}`}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {index === 0 ? "1st" : index === 1 ? "2nd" : index === 2 ? "3rd" : `${index + 1}th`}
                            </span>
                            {compareMode && item.oldRank && (
                              <span className={`text-xs ${index + 1 < item.oldRank ? "text-green-400" : index + 1 > item.oldRank ? "text-red-400" : "text-slate-500"}`}>
                                {index + 1 < item.oldRank ? `↑${item.oldRank - (index + 1)}` : index + 1 > item.oldRank ? `↓${(index + 1) - item.oldRank}` : "−"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`px-4 py-3 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Server {item.server}</td>
                        <td className={`px-4 py-3 text-right ${isDark ? "text-slate-300" : "text-gray-600"}`}>{item.playerCount}</td>
                        <td className={`px-4 py-3 text-right font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{formatNumber(item.total)}</td>
                        <td className={`px-4 py-3 text-right ${isDark ? "text-slate-300" : "text-gray-600"}`}>{formatNumber(Math.round(item.avg))}</td>
                        {compareMode && endDatePlayers.length > 0 && (
                          <td className="px-4 py-3 text-center">
                            {item.totalDiff !== 0 ? (
                              <div className={`flex items-center justify-center gap-1 ${item.totalDiff > 0 ? "text-green-400" : "text-red-400"}`}>
                                {item.totalDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span className="text-xs font-medium">{formatNumber(Math.abs(item.totalDiff))}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">−</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedPlayer && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${isDark ? "bg-black/80" : "bg-black/50"}`}
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{selectedPlayer.name}</h2>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  [{selectedPlayer.alliance_tag}] - Server {selectedPlayer.home_server} - Lord ID: {selectedPlayer.lord_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className={`p-2 rounded ${isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className={`mb-6 p-4 rounded-lg ${isDark ? "bg-emerald-900/30 border border-emerald-700" : "bg-emerald-50 border border-emerald-200"}`}>
                <p className={`text-sm ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>Server {selectedPlayer.home_server} Rankings</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Power</p>
                    <p className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>#{getPlayerServerRank(selectedPlayer, "highest_power")}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Kills</p>
                    <p className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>#{getPlayerServerRank(selectedPlayer, "units_killed")}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>T5 Kills</p>
                    <p className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>#{getPlayerServerRank(selectedPlayer, "killcount_t5")}</p>
                  </div>
                </div>
              </div>

              <table className="w-full text-sm">
                <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-100"}`}>
                  <tr>
                    <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Highest Power</td>
                    <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.highest_power)}</td>
                  </tr>
                  <tr>
                    <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Current Power</td>
                    <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.power)}</td>
                  </tr>
                  <tr>
                    <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Merits</td>
                    <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.merits)}</td>
                  </tr>
                  <tr>
                    <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Units Dead</td>
                    <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.units_dead)}</td>
                  </tr>
                  <tr>
                    <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Units Healed</td>
                    <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.units_healed)}</td>
                  </tr>
                  <tr>
                    <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Mana Spent</td>
                    <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.mana_spent)}</td>
                  </tr>
                </tbody>
              </table>

              <div className={`mt-6 pt-4 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                <h3 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Kill Statistics</h3>
                <table className="w-full text-sm">
                  <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-100"}`}>
                    <tr>
                      <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Total Units Killed</td>
                      <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.units_killed)}</td>
                    </tr>
                    <tr>
                      <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>T5 Kills</td>
                      <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.killcount_t5)}</td>
                    </tr>
                    <tr>
                      <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>T4 Kills</td>
                      <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.killcount_t4)}</td>
                    </tr>
                    <tr>
                      <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>T3 Kills</td>
                      <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.killcount_t3)}</td>
                    </tr>
                    <tr>
                      <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>T2 Kills</td>
                      <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.killcount_t2)}</td>
                    </tr>
                    <tr>
                      <td className={`py-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>T1 Kills</td>
                      <td className={`py-3 text-right font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{formatNumber(selectedPlayer.killcount_t1)}</td>
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
