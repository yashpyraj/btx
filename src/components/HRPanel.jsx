import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoClose,
  IoArrowBack,
  IoAdd,
  IoTrash,
  IoCreate,
  IoCalendar,
  IoPerson,
  IoTime,
  IoCheckmark,
  IoLockClosed,
} from "react-icons/io5";
import { supabase } from "../lib/supabase";

const HR_PIN = "1234";

const STATUS_OPTIONS = [
  { value: "away", label: "Away", color: "bg-yellow-500" },
  { value: "inactive", label: "Inactive", color: "bg-red-500" },
  { value: "limited", label: "Limited Activity", color: "bg-orange-500" },
  { value: "active", label: "Active", color: "bg-green-500" },
];

const HRPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    player_name: "",
    status: "away",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    reason: "",
    notes: "",
    added_by: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }
  }, [isAuthenticated]);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hr_player_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
    setLoading(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === HR_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!formData.player_name || !formData.added_by) return;

    const { error } = await supabase.from("hr_player_records").insert([
      {
        ...formData,
        end_date: formData.end_date || null,
      },
    ]);

    if (!error) {
      fetchRecords();
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    const { error } = await supabase
      .from("hr_player_records")
      .update({
        ...formData,
        end_date: formData.end_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingRecord.id);

    if (!error) {
      fetchRecords();
      setEditingRecord(null);
      resetForm();
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const { error } = await supabase
      .from("hr_player_records")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchRecords();
    }
  };

  const resetForm = () => {
    setFormData({
      player_name: "",
      status: "away",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      reason: "",
      notes: "",
      added_by: "",
    });
  };

  const startEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      player_name: record.player_name,
      status: record.status,
      start_date: record.start_date,
      end_date: record.end_date || "",
      reason: record.reason || "",
      notes: record.notes || "",
      added_by: record.added_by,
    });
    setShowAddForm(true);
  };

  const getStatusBadge = (status) => {
    const statusOption = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <span
        className={`${statusOption?.color || "bg-gray-500"} px-3 py-1 rounded-full text-xs font-bold text-white`}
      >
        {statusOption?.label || status}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Ongoing";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IoLockClosed className="text-4xl text-white" />
            </div>
            <h1 className="text-3xl font-zentry font-black text-white mb-2">
              HR Panel
            </h1>
            <p className="text-white/60">Enter PIN to access</p>
          </div>

          <form onSubmit={handlePinSubmit}>
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-xl border-2 ${
                    pin.length > i
                      ? "border-blue-400 bg-blue-500/20"
                      : "border-white/20 bg-white/5"
                  } flex items-center justify-center text-2xl font-bold text-white transition-all`}
                >
                  {pin.length > i ? "*" : ""}
                </div>
              ))}
            </div>

            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="sr-only"
              autoFocus
            />

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"].map((num, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (num === "del") {
                      setPin(pin.slice(0, -1));
                    } else if (num !== "" && pin.length < 4) {
                      setPin(pin + num);
                    }
                  }}
                  className={`h-14 rounded-xl font-bold text-xl transition-all ${
                    num === ""
                      ? "invisible"
                      : "bg-white/10 hover:bg-white/20 text-white active:scale-95"
                  }`}
                >
                  {num === "del" ? "DEL" : num}
                </button>
              ))}
            </div>

            {pinError && (
              <p className="text-red-400 text-center text-sm mb-4">
                Incorrect PIN. Try again.
              </p>
            )}

            <button
              type="submit"
              disabled={pin.length !== 4}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Unlock
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 py-3 text-white/60 hover:text-white transition-colors text-sm"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300"
            >
              <IoArrowBack className="text-xl" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-zentry font-black text-white">
              HR PANEL
            </h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-white/70 hover:text-red-400 transition-all"
          >
            <IoLockClosed />
            <span className="text-sm">Lock</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-zentry font-black mb-2">
              Player Activity Tracker
            </h2>
            <p className="text-white/60">
              Track player absences and activity status
            </p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingRecord(null);
              resetForm();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <IoAdd className="text-xl" />
            Add Record
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {STATUS_OPTIONS.map((status) => {
            const count = records.filter((r) => r.status === status.value).length;
            return (
              <div
                key={status.value}
                className="bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="text-white/60 text-sm">{status.label}</span>
                </div>
                <p className="text-4xl font-zentry font-black">{count}</p>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <IoPerson className="text-6xl text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No records yet. Add your first one!</p>
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60 font-semibold">
                      Player
                    </th>
                    <th className="text-left p-4 text-white/60 font-semibold">
                      Status
                    </th>
                    <th className="text-left p-4 text-white/60 font-semibold">
                      Period
                    </th>
                    <th className="text-left p-4 text-white/60 font-semibold">
                      Reason
                    </th>
                    <th className="text-left p-4 text-white/60 font-semibold">
                      Added By
                    </th>
                    <th className="text-left p-4 text-white/60 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold">
                            {record.player_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold">
                            {record.player_name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(record.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <IoCalendar className="text-white/40" />
                          <span>
                            {formatDate(record.start_date)} -{" "}
                            {formatDate(record.end_date)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-white/70 max-w-xs truncate">
                        {record.reason || "-"}
                      </td>
                      <td className="p-4 text-white/70">{record.added_by}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(record)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <IoCreate className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <IoTrash className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => {
              setShowAddForm(false);
              setEditingRecord(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-zentry font-black">
                  {editingRecord ? "Edit Record" : "Add New Record"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRecord(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              <form onSubmit={editingRecord ? handleUpdateRecord : handleAddRecord}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Player Name *
                    </label>
                    <input
                      type="text"
                      value={formData.player_name}
                      onChange={(e) =>
                        setFormData({ ...formData, player_name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="Enter player name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                          className="bg-slate-800"
                        >
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({ ...formData, start_date: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Reason
                    </label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="e.g., Vacation, Work, Personal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors resize-none"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Added By *
                    </label>
                    <input
                      type="text"
                      value={formData.added_by}
                      onChange={(e) =>
                        setFormData({ ...formData, added_by: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingRecord(null);
                    }}
                    className="flex-1 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <IoCheckmark className="text-xl" />
                    {editingRecord ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRPanel;
