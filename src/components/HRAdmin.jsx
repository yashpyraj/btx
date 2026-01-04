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
  IoCheckmark,
  IoWarning,
  IoChevronBack,
  IoChevronForward,
  IoAlertCircle,
  IoDocumentText,
} from "react-icons/io5";
import { supabase } from "../lib/supabase";

const STATUS_OPTIONS = [
  { value: "away", label: "Away", color: "bg-yellow-500" },
  { value: "inactive", label: "Inactive", color: "bg-red-500" },
  { value: "limited", label: "Limited Activity", color: "bg-orange-500" },
  { value: "active", label: "Active", color: "bg-green-500" },
];

const WARNING_TYPES = [
  { value: "verbal", label: "Verbal", color: "bg-yellow-500" },
  { value: "written", label: "Written", color: "bg-orange-500" },
  { value: "final", label: "Final", color: "bg-red-500" },
  { value: "not_performing", label: "Not Performing", color: "bg-blue-500" },
  { value: "mob", label: "MOB", color: "bg-purple-500" },
];

const NOTE_CATEGORIES = [
  { value: "general", label: "General", color: "bg-slate-500" },
  { value: "performance", label: "Performance", color: "bg-blue-500" },
  { value: "behavior", label: "Behavior", color: "bg-orange-500" },
  { value: "positive", label: "Positive", color: "bg-green-500" },
  { value: "concern", label: "Concern", color: "bg-red-500" },
];

const HRAdmin = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWarningForm, setShowWarningForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingWarning, setEditingWarning] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    player_name: "",
    status: "away",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    reason: "",
    notes: "",
    added_by: "",
  });
  const [warningFormData, setWarningFormData] = useState({
    player_name: "",
    player_id: "",
    warning_type: "verbal",
    warning_date: new Date().toISOString().split("T")[0],
    reason: "",
    notes: "",
    issued_by: "",
  });
  const [noteFormData, setNoteFormData] = useState({
    player_name: "",
    player_id: "",
    note: "",
    category: "general",
    added_by: "",
  });

  useEffect(() => {
    fetchRecords();
    fetchWarnings();
    fetchNotes();
    fetchTickets();
    fetchCalendarEvents();
  }, []);

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

  const fetchWarnings = async () => {
    const { data, error } = await supabase
      .from("hr_warnings")
      .select("*")
      .order("warning_date", { ascending: false });

    if (!error && data) {
      setWarnings(data);
    }
  };

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("hr_player_notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
  };

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("hr_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
  };

  const fetchCalendarEvents = async () => {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("start_date", { ascending: true });

    if (!error && data) {
      setCalendarEvents(data);
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
      setShowAddForm(false);
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

  const handleAddWarning = async (e) => {
    e.preventDefault();
    if (!warningFormData.player_name || !warningFormData.issued_by) return;

    const { error } = await supabase.from("hr_warnings").insert([warningFormData]);

    if (!error) {
      fetchWarnings();
      setShowWarningForm(false);
      resetWarningForm();
    }
  };

  const handleUpdateWarning = async (e) => {
    e.preventDefault();
    if (!editingWarning) return;

    const { error } = await supabase
      .from("hr_warnings")
      .update(warningFormData)
      .eq("id", editingWarning.id);

    if (!error) {
      fetchWarnings();
      setEditingWarning(null);
      setShowWarningForm(false);
      resetWarningForm();
    }
  };

  const handleDeleteWarning = async (id) => {
    if (!confirm("Are you sure you want to delete this warning?")) return;

    const { error } = await supabase.from("hr_warnings").delete().eq("id", id);

    if (!error) {
      fetchWarnings();
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteFormData.player_name || !noteFormData.note || !noteFormData.added_by) return;

    const { error } = await supabase.from("hr_player_notes").insert([noteFormData]);

    if (!error) {
      fetchNotes();
      setShowNoteForm(false);
      resetNoteForm();
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!editingNote) return;

    const { error } = await supabase
      .from("hr_player_notes")
      .update({
        ...noteFormData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingNote.id);

    if (!error) {
      fetchNotes();
      setEditingNote(null);
      setShowNoteForm(false);
      resetNoteForm();
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const { error } = await supabase.from("hr_player_notes").delete().eq("id", id);

    if (!error) {
      fetchNotes();
    }
  };

  const handleUpdateTicketStatus = async (id, newStatus) => {
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "resolved" || newStatus === "closed") {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("hr_tickets")
      .update(updateData)
      .eq("id", id);

    if (!error) {
      fetchTickets();
    }
  };

  const handleAssignTicket = async (id, assignedTo) => {
    const { error } = await supabase
      .from("hr_tickets")
      .update({
        assigned_to: assignedTo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      fetchTickets();
    }
  };

  const handleUpdateTicketPriority = async (id, newPriority) => {
    const { error } = await supabase
      .from("hr_tickets")
      .update({
        priority: newPriority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      fetchTickets();
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    const { error } = await supabase.from("hr_tickets").delete().eq("id", id);

    if (!error) {
      fetchTickets();
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

  const resetWarningForm = () => {
    setWarningFormData({
      player_name: "",
      player_id: "",
      warning_type: "verbal",
      warning_date: new Date().toISOString().split("T")[0],
      reason: "",
      notes: "",
      issued_by: "",
    });
  };

  const resetNoteForm = () => {
    setNoteFormData({
      player_name: "",
      player_id: "",
      note: "",
      category: "general",
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

  const startEditWarning = (warning) => {
    setEditingWarning(warning);
    setWarningFormData({
      player_name: warning.player_name,
      player_id: warning.player_id || "",
      warning_type: warning.warning_type,
      warning_date: warning.warning_date,
      reason: warning.reason,
      notes: warning.notes || "",
      issued_by: warning.issued_by,
    });
    setShowWarningForm(true);
  };

  const startEditNote = (note) => {
    setEditingNote(note);
    setNoteFormData({
      player_name: note.player_name,
      player_id: note.player_id || "",
      note: note.note,
      category: note.category,
      added_by: note.added_by,
    });
    setShowNoteForm(true);
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

  const getWarningBadge = (type) => {
    const warningType = WARNING_TYPES.find((w) => w.value === type);
    return (
      <span
        className={`${warningType?.color || "bg-gray-500"} px-3 py-1 rounded-full text-xs font-bold text-white`}
      >
        {warningType?.label || type}
      </span>
    );
  };

  const getNoteBadge = (category) => {
    const noteCategory = NOTE_CATEGORIES.find((c) => c.value === category);
    return (
      <span
        className={`${noteCategory?.color || "bg-gray-500"} px-3 py-1 rounded-full text-xs font-bold text-white`}
      >
        {noteCategory?.label || category}
      </span>
    );
  };

  const getTicketStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-500",
      reviewing: "bg-blue-500",
      resolved: "bg-green-500",
      closed: "bg-slate-500",
    };
    return (
      <span
        className={`${statusColors[status] || "bg-gray-500"} px-3 py-1 rounded-full text-xs font-bold text-white`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTicketPriorityBadge = (priority) => {
    const priorityColors = {
      low: "bg-slate-500",
      normal: "bg-blue-500",
      high: "bg-orange-500",
      urgent: "bg-red-500",
    };
    return (
      <span
        className={`${priorityColors[priority] || "bg-gray-500"} px-3 py-1 rounded-full text-xs font-bold text-white`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getTicketTypeBadge = (type) => {
    const typeColors = {
      report: "bg-red-500",
      request: "bg-blue-500",
      concern: "bg-orange-500",
      feedback: "bg-green-500",
      appeal: "bg-purple-500",
      other: "bg-slate-500",
    };
    return (
      <span
        className={`${typeColors[type] || "bg-gray-500"} px-3 py-1 rounded-full text-xs font-bold text-white`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getNotesByPlayer = () => {
    const playerNotes = {};
    notes.forEach((note) => {
      if (!playerNotes[note.player_name]) {
        playerNotes[note.player_name] = [];
      }
      playerNotes[note.player_name].push(note);
    });
    return playerNotes;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Ongoing";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getRecordsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return records.filter((record) => {
      const start = new Date(record.start_date);
      const end = record.end_date ? new Date(record.end_date) : new Date();
      return date >= start && date <= end;
    });
  };

  const getWarningsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return warnings.filter((w) => w.warning_date === dateStr);
  };

  const getCalendarEventsForDate = (date) => {
    return calendarEvents.filter((event) => {
      const eventStartDate = new Date(event.start_date);
      const eventEndDate = event.end_date ? new Date(event.end_date) : eventStartDate;

      const dateToCheck = new Date(date);
      dateToCheck.setHours(0, 0, 0, 0);

      const startDate = new Date(eventStartDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(eventEndDate);
      endDate.setHours(0, 0, 0, 0);

      return dateToCheck >= startDate && dateToCheck <= endDate;
    });
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayRecords = getRecordsForDate(date);
      const dayWarnings = getWarningsForDate(date);
      const dayCalendarEvents = getCalendarEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-white/10 rounded-lg p-2 ${
            isToday ? "bg-blue-500/20 border-blue-500/50" : "bg-white/5"
          } hover:bg-white/10 transition-colors overflow-hidden`}
        >
          <div className={`text-sm font-bold mb-1 ${isToday ? "text-blue-400" : "text-white/70"}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayCalendarEvents.slice(0, 1).map((event, idx) => (
              <div
                key={`c-${idx}`}
                className="text-[10px] px-1.5 py-0.5 rounded text-white truncate"
                style={{ backgroundColor: event.color }}
              >
                {event.title}
              </div>
            ))}
            {dayRecords.slice(0, 1).map((record, idx) => {
              const statusOption = STATUS_OPTIONS.find((s) => s.value === record.status);
              return (
                <div
                  key={idx}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${statusOption?.color} text-white truncate`}
                >
                  {record.player_name}
                </div>
              );
            })}
            {dayWarnings.slice(0, 1).map((warning, idx) => (
              <div
                key={`w-${idx}`}
                className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white truncate flex items-center gap-1"
              >
                <IoWarning className="text-[8px]" />
                {warning.player_name}
              </div>
            ))}
            {(dayCalendarEvents.length + dayRecords.length + dayWarnings.length > 3) && (
              <div className="text-[10px] text-white/50">
                +{dayCalendarEvents.length + dayRecords.length + dayWarnings.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-zentry font-black flex items-center gap-2">
            <IoCalendar className="text-blue-400" />
            Calendar View
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IoChevronBack />
            </button>
            <span className="font-semibold min-w-[150px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IoChevronForward />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm text-white/50 font-semibold py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{days}</div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 flex-wrap">
          <div className="text-sm text-white/60">Legend:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-xs text-white/60">Calendar Event</span>
          </div>
          {STATUS_OPTIONS.map((status) => (
            <div key={status.value} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${status.color}`} />
              <span className="text-xs text-white/60">{status.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-600" />
            <span className="text-xs text-white/60">Warning</span>
          </div>
        </div>
      </div>
    );
  };

  const getLastWarning = () => {
    if (warnings.length === 0) return null;
    return warnings[0];
  };

  const getLastWarningsByPlayer = () => {
    const playerWarnings = {};
    warnings.forEach((warning) => {
      if (!playerWarnings[warning.player_name]) {
        playerWarnings[warning.player_name] = warning;
      }
    });
    return Object.values(playerWarnings);
  };

  const lastWarning = getLastWarning();
  const lastWarningsByPlayer = getLastWarningsByPlayer();

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
              HR ADMIN
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderCalendar()}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <IoDocumentText className="text-2xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">HR Tickets</p>
                <p className="text-3xl font-zentry font-black">{tickets.length}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-white/60">
                Pending: {tickets.filter((t) => t.status === "pending").length}
              </span>
              <span className="text-xs text-white/60">
                Reviewing: {tickets.filter((t) => t.status === "reviewing").length}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <IoPerson className="text-2xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Player Activity</p>
                <p className="text-3xl font-zentry font-black">{records.length}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((status) => {
                const count = records.filter((r) => r.status === status.value).length;
                return (
                  <span key={status.value} className="text-xs text-white/60">
                    {status.label}: {count}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <IoAlertCircle className="text-2xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Last Warning</p>
                <p className="text-xl font-zentry font-black truncate">
                  {lastWarning ? lastWarning.player_name : "None"}
                </p>
              </div>
            </div>
            {lastWarning && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getWarningBadge(lastWarning.warning_type)}
                  <span className="text-xs text-white/60">
                    {formatDate(lastWarning.warning_date)}
                  </span>
                </div>
                <p className="text-xs text-white/50 truncate">{lastWarning.reason}</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-rose-600/20 rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <IoWarning className="text-2xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Warnings</p>
                <p className="text-3xl font-zentry font-black">{warnings.length}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {WARNING_TYPES.map((type) => {
                const count = warnings.filter((w) => w.warning_type === type.value).length;
                return (
                  <span key={type.value} className="text-xs text-white/60">
                    {type.label}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {lastWarningsByPlayer.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-zentry font-black mb-4 flex items-center gap-2">
              <IoAlertCircle className="text-orange-400" />
              Last Warnings by Player
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lastWarningsByPlayer.map((warning) => (
                <div
                  key={warning.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-bold shrink-0">
                      {warning.player_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold truncate">{warning.player_name}</span>
                        {warning.player_id && (
                          <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded">
                            ID: {warning.player_id}
                          </span>
                        )}
                        {getWarningBadge(warning.warning_type)}
                      </div>
                      <p className="text-sm text-white/60 truncate">{warning.reason}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                        <IoCalendar />
                        <span>{formatDate(warning.warning_date)}</span>
                        <span>by {warning.issued_by}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "tickets"
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            HR Tickets
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "activity"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Player Activity
          </button>
          <button
            onClick={() => setActiveTab("warnings")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "warnings"
                ? "bg-red-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "notes"
                ? "bg-slate-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Player Notes
          </button>
        </div>

        {activeTab === "tickets" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-zentry font-black">HR Tickets</h2>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <IoDocumentText className="text-6xl text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No tickets submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-zentry font-black text-white">
                              {ticket.subject}
                            </h3>
                            {getTicketTypeBadge(ticket.ticket_type)}
                            {getTicketPriorityBadge(ticket.priority)}
                            {getTicketStatusBadge(ticket.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                              <IoPerson />
                              <span>{ticket.player_name}</span>
                              {ticket.player_id && (
                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                                  ID: {ticket.player_id}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <IoCalendar />
                              <span>{formatDate(ticket.created_at)}</span>
                            </div>
                            {ticket.assigned_to && (
                              <span className="text-blue-400">
                                Assigned to: {ticket.assigned_to}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <IoTrash className="text-red-400" />
                        </button>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 mb-4">
                        <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                          {ticket.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/60">Status:</span>
                          <select
                            value={ticket.status}
                            onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value)}
                            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm focus:border-purple-400 focus:outline-none"
                          >
                            <option value="pending" className="bg-slate-800">Pending</option>
                            <option value="reviewing" className="bg-slate-800">Reviewing</option>
                            <option value="resolved" className="bg-slate-800">Resolved</option>
                            <option value="closed" className="bg-slate-800">Closed</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/60">Priority:</span>
                          <select
                            value={ticket.priority}
                            onChange={(e) => handleUpdateTicketPriority(ticket.id, e.target.value)}
                            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm focus:border-purple-400 focus:outline-none"
                          >
                            <option value="low" className="bg-slate-800">Low</option>
                            <option value="normal" className="bg-slate-800">Normal</option>
                            <option value="high" className="bg-slate-800">High</option>
                            <option value="urgent" className="bg-slate-800">Urgent</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/60">Assign to:</span>
                          <input
                            type="text"
                            value={ticket.assigned_to || ""}
                            onChange={(e) => handleAssignTicket(ticket.id, e.target.value)}
                            placeholder="HR member name"
                            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm focus:border-purple-400 focus:outline-none w-40"
                          />
                        </div>

                        {ticket.resolved_at && (
                          <div className="flex items-center gap-2 ml-auto">
                            <IoCheckmark className="text-green-400" />
                            <span className="text-sm text-white/60">
                              Resolved: {formatDate(ticket.resolved_at)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "activity" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-zentry font-black">Player Activity Records</h2>
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
                        <th className="text-left p-4 text-white/60 font-semibold">Player</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Status</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Period</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Reason</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Added By</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Actions</th>
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
                              <span className="font-semibold">{record.player_name}</span>
                            </div>
                          </td>
                          <td className="p-4">{getStatusBadge(record.status)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <IoCalendar className="text-white/40" />
                              <span>
                                {formatDate(record.start_date)} - {formatDate(record.end_date)}
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
          </>
        )}

        {activeTab === "warnings" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-zentry font-black">Warning Records</h2>
              <button
                onClick={() => {
                  setShowWarningForm(true);
                  setEditingWarning(null);
                  resetWarningForm();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                <IoAdd className="text-xl" />
                Add Warning
              </button>
            </div>

            {warnings.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <IoWarning className="text-6xl text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No warnings recorded yet.</p>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/60 font-semibold">Player</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Type</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Date</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Reason</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Issued By</th>
                        <th className="text-left p-4 text-white/60 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warnings.map((warning) => (
                        <tr
                          key={warning.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center font-bold">
                                {warning.player_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold block">{warning.player_name}</span>
                                {warning.player_id && (
                                  <span className="text-xs text-white/40">ID: {warning.player_id}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{getWarningBadge(warning.warning_type)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <IoCalendar className="text-white/40" />
                              <span>{formatDate(warning.warning_date)}</span>
                            </div>
                          </td>
                          <td className="p-4 text-white/70 max-w-xs truncate">
                            {warning.reason}
                          </td>
                          <td className="p-4 text-white/70">{warning.issued_by}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditWarning(warning)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <IoCreate className="text-blue-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteWarning(warning.id)}
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
          </>
        )}

        {activeTab === "notes" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-zentry font-black">Player Notes</h2>
              <button
                onClick={() => {
                  setShowNoteForm(true);
                  setEditingNote(null);
                  resetNoteForm();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl font-bold hover:shadow-lg hover:shadow-slate-500/30 transition-all"
              >
                <IoAdd className="text-xl" />
                Add Note
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <IoDocumentText className="text-6xl text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No notes yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(getNotesByPlayer()).map(([playerName, playerNotes]) => (
                  <div key={playerName} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="bg-white/5 p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center font-bold text-xl">
                          {playerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-zentry font-black text-white">{playerName}</h3>
                          <p className="text-sm text-white/60">{playerNotes.length} note{playerNotes.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {playerNotes.map((note) => (
                        <div key={note.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getNoteBadge(note.category)}
                              <span className="text-xs text-white/40">
                                {formatDate(note.created_at)} by {note.added_by}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditNote(note)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <IoCreate className="text-blue-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <IoTrash className="text-red-400" />
                              </button>
                            </div>
                          </div>
                          <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
              className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-zentry font-black">
                  {editingRecord ? "Edit Record" : "Add Activity Record"}
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
                    <label className="block text-sm text-white/60 mb-2">Player Name *</label>
                    <input
                      type="text"
                      value={formData.player_name}
                      onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="Enter player name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value} className="bg-slate-800">
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Reason</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="e.g., Vacation, Work, Personal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors resize-none"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Added By *</label>
                    <input
                      type="text"
                      value={formData.added_by}
                      onChange={(e) => setFormData({ ...formData, added_by: e.target.value })}
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

        {showWarningForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => {
              setShowWarningForm(false);
              setEditingWarning(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-zentry font-black">
                  {editingWarning ? "Edit Warning" : "Add Warning"}
                </h3>
                <button
                  onClick={() => {
                    setShowWarningForm(false);
                    setEditingWarning(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              <form onSubmit={editingWarning ? handleUpdateWarning : handleAddWarning}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Player Name *</label>
                      <input
                        type="text"
                        value={warningFormData.player_name}
                        onChange={(e) =>
                          setWarningFormData({ ...warningFormData, player_name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                        placeholder="Enter player name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Player ID</label>
                      <input
                        type="text"
                        value={warningFormData.player_id}
                        onChange={(e) =>
                          setWarningFormData({ ...warningFormData, player_id: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                        placeholder="Enter player ID"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Warning Type *</label>
                    <select
                      value={warningFormData.warning_type}
                      onChange={(e) =>
                        setWarningFormData({ ...warningFormData, warning_type: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                    >
                      {WARNING_TYPES.map((type) => (
                        <option key={type.value} value={type.value} className="bg-slate-800">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Warning Date *</label>
                    <input
                      type="date"
                      value={warningFormData.warning_date}
                      onChange={(e) =>
                        setWarningFormData({ ...warningFormData, warning_date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Reason *</label>
                    <input
                      type="text"
                      value={warningFormData.reason}
                      onChange={(e) =>
                        setWarningFormData({ ...warningFormData, reason: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                      placeholder="Reason for warning"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Notes</label>
                    <textarea
                      value={warningFormData.notes}
                      onChange={(e) =>
                        setWarningFormData({ ...warningFormData, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-orange-400 focus:outline-none transition-colors resize-none"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Issued By *</label>
                    <input
                      type="text"
                      value={warningFormData.issued_by}
                      onChange={(e) =>
                        setWarningFormData({ ...warningFormData, issued_by: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWarningForm(false);
                      setEditingWarning(null);
                    }}
                    className="flex-1 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <IoCheckmark className="text-xl" />
                    {editingWarning ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showNoteForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => {
              setShowNoteForm(false);
              setEditingNote(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-zentry font-black">
                  {editingNote ? "Edit Note" : "Add Player Note"}
                </h3>
                <button
                  onClick={() => {
                    setShowNoteForm(false);
                    setEditingNote(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              <form onSubmit={editingNote ? handleUpdateNote : handleAddNote}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Player Name *</label>
                      <input
                        type="text"
                        value={noteFormData.player_name}
                        onChange={(e) =>
                          setNoteFormData({ ...noteFormData, player_name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-slate-400 focus:outline-none transition-colors"
                        placeholder="Enter player name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Player ID</label>
                      <input
                        type="text"
                        value={noteFormData.player_id}
                        onChange={(e) =>
                          setNoteFormData({ ...noteFormData, player_id: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-slate-400 focus:outline-none transition-colors"
                        placeholder="Enter player ID"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Category *</label>
                    <select
                      value={noteFormData.category}
                      onChange={(e) =>
                        setNoteFormData({ ...noteFormData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-slate-400 focus:outline-none transition-colors"
                    >
                      {NOTE_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-slate-800">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Note *</label>
                    <textarea
                      value={noteFormData.note}
                      onChange={(e) =>
                        setNoteFormData({ ...noteFormData, note: e.target.value })
                      }
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-slate-400 focus:outline-none transition-colors resize-none"
                      placeholder="Enter your note about this player..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">Added By *</label>
                    <input
                      type="text"
                      value={noteFormData.added_by}
                      onChange={(e) =>
                        setNoteFormData({ ...noteFormData, added_by: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-slate-400 focus:outline-none transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNoteForm(false);
                      setEditingNote(null);
                    }}
                    className="flex-1 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl font-bold hover:shadow-lg hover:shadow-slate-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <IoCheckmark className="text-xl" />
                    {editingNote ? "Update" : "Save"}
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

export default HRAdmin;
