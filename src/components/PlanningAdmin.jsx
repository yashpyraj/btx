import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ChevronLeft,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Clock,
  MapPin,
  Search,
  Filter,
} from "lucide-react";

const CATEGORIES = [
  { value: "row", label: "ROW", color: "#ef4444" },
  { value: "townhall", label: "town hall", color: "#3b82f6" },
  { value: "passopening", label: "Pass opening", color: "#10b981" },
  { value: "statue", label: "statue", color: "#f59e0b" },
];

const ADMIN_PIN = "1234";

const PlanningAdmin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "00:00",
    end_date: "",
    end_time: "00:00",
    all_day: false,
    category: "row",
    color: "#ef4444",
    location: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("start_date", { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      start_date: "",
      start_time: "00:00",
      end_date: "",
      end_time: "00:00",
      all_day: false,
      category: "row",
      color: "#ef4444",
      location: "",
    });
    setEditingEvent(null);
    setErrorMessage("");
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (event) => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;

    setFormData({
      title: event.title,
      description: event.description || "",
      start_date: startDate.toISOString().split("T")[0],
      start_time: startDate.toTimeString().slice(0, 5),
      end_date: endDate ? endDate.toISOString().split("T")[0] : "",
      end_time: endDate ? endDate.toTimeString().slice(0, 5) : "",
      all_day: event.all_day || false,
      category: event.category || "row",
      color: event.color || "#ef4444",
      location: event.location || "",
    });
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const startDateTime = formData.all_day
      ? `${formData.start_date}T00:00:00`
      : `${formData.start_date}T${formData.start_time}:00`;

    let endDateTime = null;
    if (formData.end_date) {
      endDateTime = formData.all_day
        ? `${formData.end_date}T23:59:59`
        : `${formData.end_date}T${formData.end_time || formData.start_time}:00`;
    }

    const eventData = {
      title: formData.title,
      description: formData.description || null,
      start_date: startDateTime,
      end_date: endDateTime,
      all_day: formData.all_day,
      category: formData.category,
      color: formData.color,
      location: formData.location || null,
      updated_at: new Date().toISOString(),
    };

    if (editingEvent) {
      const { error } = await supabase
        .from("calendar_events")
        .update(eventData)
        .eq("id", editingEvent.id);

      if (error) {
        setErrorMessage(`Failed to update event: ${error.message}`);
        return;
      }

      fetchEvents();
      setShowModal(false);
      resetForm();
    } else {
      const { error } = await supabase.from("calendar_events").insert([eventData]);

      if (error) {
        setErrorMessage(`Failed to create event: ${error.message}`);
        return;
      }

      fetchEvents();
      setShowModal(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("calendar_events").delete().eq("id", id);
    if (!error) {
      fetchEvents();
      setDeleteConfirm(null);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDateTime = (dateStr, allDay) => {
    const date = new Date(dateStr);
    if (allDay) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-blue-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Planning Admin</h1>
            <p className="text-white/60 mt-2">Enter PIN to access</p>
          </div>

          <form onSubmit={handlePinSubmit}>
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                    pin.length > i
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-white/20 text-white/20"
                  } ${pinError && "border-red-500 bg-red-500/10"}`}
                >
                  {pin[i] ? "*" : ""}
                </div>
              ))}
            </div>

            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setPinError(false);
              }}
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
                      setPin((p) => p.slice(0, -1));
                    } else if (num !== "" && pin.length < 4) {
                      setPin((p) => p + num);
                    }
                    setPinError(false);
                  }}
                  className={`h-14 rounded-xl text-xl font-semibold transition-all ${
                    num === ""
                      ? "invisible"
                      : num === "del"
                        ? "bg-white/5 hover:bg-white/10 text-white/60"
                        : "bg-white/5 hover:bg-white/10 text-white"
                  }`}
                >
                  {num === "del" ? "DEL" : num}
                </button>
              ))}
            </div>

            {pinError && (
              <p className="text-red-400 text-center text-sm mb-4">Incorrect PIN</p>
            )}

            <button
              type="submit"
              disabled={pin.length !== 4}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded-xl font-semibold transition-all"
            >
              Access Admin Panel
            </button>
          </form>

          <button
            onClick={() => navigate("/planning")}
            className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl font-medium transition-all"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/planning")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <Calendar className="text-blue-400" size={36} />
                  Event Admin
                </h1>
                <p className="text-white/60 mt-1">Create and manage calendar events</p>
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all"
            >
              <Plus size={20} />
              Add Event
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-white/10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-white/40" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    <option value="all" className="bg-slate-800">
                      All Categories
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-slate-800">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {loading ? (
                <div className="text-center py-12 text-white/40">Loading events...</div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-white/20 mb-4" size={48} />
                  <p className="text-white/40">No events found</p>
                  <button
                    onClick={openCreateModal}
                    className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Create your first event
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-1 h-full min-h-[60px] rounded-full shrink-0"
                          style={{ backgroundColor: event.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-white font-semibold text-lg">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/60">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {formatDateTime(event.start_date, event.all_day)}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {event.location}
                                  </span>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-white/40 text-sm mt-2 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                                style={{
                                  backgroundColor: `${event.color}20`,
                                  color: event.color,
                                }}
                              >
                                {CATEGORIES.find((c) => c.value === event.category)?.label ||
                                  event.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(event)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium transition-all"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(event.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-all"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <p className="text-white/40 text-sm text-center">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-2xl my-8">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-sm text-white/60 mb-2">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = CATEGORIES.find((c) => c.value === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        color: cat?.color || "#3b82f6",
                      });
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-slate-800">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.all_day}
                    onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-white">All-day event</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Start Time {formData.all_day && "(disabled for all-day)"}
                  </label>
                  <input
                    type="time"
                    required={!formData.all_day}
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    disabled={formData.all_day}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">End Date (optional)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    End Time {formData.all_day && "(disabled for all-day)"}
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    disabled={formData.all_day}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter event location"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Event?</h3>
              <p className="text-white/60">
                This action cannot be undone. The event will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningAdmin;
