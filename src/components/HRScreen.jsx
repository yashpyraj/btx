import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoArrowBack,
  IoCheckmark,
  IoDocumentText,
  IoSearch,
  IoTime,
  IoShield,
  IoChatbubbles,
  IoSend,
  IoCopy,
  IoClose,
  IoCheckmarkCircle,
  IoHourglass,
  IoEye,
  IoCloseCircle,
  IoArrowForward,
  IoSettings,
} from "react-icons/io5";
import { supabase } from "../lib/supabase";

const TICKET_TYPES = [
  { value: "report", label: "Report Issue", icon: "!", color: "from-red-500 to-rose-600" },
  { value: "request", label: "Request Help", icon: "?", color: "from-blue-500 to-cyan-600" },
  { value: "concern", label: "Raise Concern", icon: "!", color: "from-orange-500 to-amber-600" },
  { value: "feedback", label: "Feedback", icon: "+", color: "from-green-500 to-emerald-600" },
  { value: "appeal", label: "Appeal", icon: "A", color: "from-cyan-500 to-teal-600" },
  { value: "other", label: "Other", icon: "O", color: "from-slate-500 to-slate-600" },
];

const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "bg-slate-500", ring: "ring-slate-400" },
  { value: "normal", label: "Normal", color: "bg-blue-500", ring: "ring-blue-400" },
  { value: "high", label: "High", color: "bg-orange-500", ring: "ring-orange-400" },
  { value: "urgent", label: "Urgent", color: "bg-red-500", ring: "ring-red-400" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: IoHourglass, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  reviewing: { label: "Under Review", icon: IoEye, color: "text-blue-400", bg: "bg-blue-500/20" },
  resolved: { label: "Resolved", icon: IoCheckmarkCircle, color: "text-green-400", bg: "bg-green-500/20" },
  closed: { label: "Closed", icon: IoCloseCircle, color: "text-slate-400", bg: "bg-slate-500/20" },
};

const HRScreen = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("home");
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    player_name: "",
    player_id: "",
    ticket_type: "request",
    subject: "",
    description: "",
    priority: "normal",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.player_name || !formData.subject || !formData.description) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("hr_tickets")
      .insert([
        {
          player_name: formData.player_name,
          player_id: formData.player_id || null,
          ticket_type: formData.ticket_type,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority,
          status: "pending",
        },
      ])
      .select()
      .maybeSingle();

    setSubmitting(false);

    if (!error && data) {
      setSubmittedTicket(data);
      setFormData({
        player_name: "",
        player_id: "",
        ticket_type: "request",
        subject: "",
        description: "",
        priority: "normal",
      });
      setActiveView("success");
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    const searchId = lookupId.trim().toUpperCase();

    const { data, error } = await supabase
      .from("hr_tickets")
      .select("*")
      .eq("ticket_number", searchId)
      .maybeSingle();

    setLookupLoading(false);

    if (error) {
      setLookupError("An error occurred while searching.");
      return;
    }

    if (!data) {
      setLookupError("No ticket found with this ID. Please check and try again.");
      return;
    }

    setLookupResult(data);
  };

  const copyTicketId = () => {
    if (submittedTicket?.ticket_number) {
      navigator.clipboard.writeText(submittedTicket.ticket_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetForm = () => {
    setFormData({
      player_name: "",
      player_id: "",
      ticket_type: "request",
      subject: "",
      description: "",
      priority: "normal",
    });
    setSubmittedTicket(null);
    setActiveView("submit");
  };

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30"
        >
          <IoShield className="text-5xl text-white" />
        </motion.div>
        <h1 className="text-5xl font-zentry font-black text-white mb-4">
          HR Support Center
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Get help with any HR-related matters. Submit tickets, track progress, and stay informed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveView("submit")}
          className="group relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl p-8 border border-blue-500/30 text-left overflow-hidden hover:border-blue-400/50 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <IoSend className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-zentry font-black text-white mb-3">
              Submit a Ticket
            </h3>
            <p className="text-white/60 mb-4">
              Report issues, request help, or raise concerns with our HR team.
            </p>
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <span>Get started</span>
              <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveView("lookup")}
          className="group relative bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-3xl p-8 border border-emerald-500/30 text-left overflow-hidden hover:border-emerald-400/50 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
              <IoSearch className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-zentry font-black text-white mb-3">
              Check Ticket Status
            </h3>
            <p className="text-white/60 mb-4">
              Enter your ticket ID to view current status and updates.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span>Track ticket</span>
              <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
          <IoTime className="text-3xl text-blue-400 mx-auto mb-3" />
          <h4 className="font-semibold text-white mb-2">Quick Response</h4>
          <p className="text-white/50 text-sm">Tickets reviewed within 24 hours</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
          <IoShield className="text-3xl text-emerald-400 mx-auto mb-3" />
          <h4 className="font-semibold text-white mb-2">Confidential</h4>
          <p className="text-white/50 text-sm">All submissions handled privately</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
          <IoChatbubbles className="text-3xl text-cyan-400 mx-auto mb-3" />
          <h4 className="font-semibold text-white mb-2">Track Progress</h4>
          <p className="text-white/50 text-sm">Real-time status updates</p>
        </div>
      </div>
    </motion.div>
  );

  const renderSubmitForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-6 py-12"
    >
      <button
        onClick={() => setActiveView("home")}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
      >
        <IoArrowBack />
        <span>Back to HR Center</span>
      </button>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-zentry font-black text-white mb-3">
          Submit a Ticket
        </h2>
        <p className="text-white/60">
          Fill out the form below and our HR team will get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">1</span>
            Your Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.player_name}
                onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-white placeholder:text-white/40"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">
                Player ID <span className="text-white/40">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.player_id}
                onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-white placeholder:text-white/40"
                placeholder="Your player ID"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">2</span>
            Ticket Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TICKET_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, ticket_type: type.value })}
                className={`relative p-5 rounded-2xl border-2 transition-all ${
                  formData.ticket_type === type.value
                    ? "border-white/40 bg-gradient-to-br " + type.color + " shadow-xl"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  formData.ticket_type === type.value ? "bg-white/20" : "bg-white/10"
                }`}>
                  <span className="text-lg font-bold">{type.icon}</span>
                </div>
                <span className="font-semibold text-sm block">{type.label}</span>
                {formData.ticket_type === type.value && (
                  <motion.div
                    layoutId="typeIndicator"
                    className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  >
                    <IoCheckmark className="text-slate-900" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">3</span>
            Priority Level
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {PRIORITY_LEVELS.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: priority.value })}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.priority === priority.value
                    ? `border-white/40 ${priority.color} shadow-lg ring-2 ${priority.ring}`
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="font-semibold text-sm">{priority.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">4</span>
            Ticket Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-white placeholder:text-white/40"
                placeholder="Brief summary of your ticket"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all resize-none text-white placeholder:text-white/40"
                placeholder="Please provide detailed information. Include relevant context, dates, or specific incidents..."
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveView("home")}
            className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <IoSend className="text-xl" />
                Submit Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto px-6 py-16"
    >
      <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl rounded-3xl p-10 border border-emerald-500/30 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40"
        >
          <IoCheckmark className="text-5xl text-white" />
        </motion.div>

        <h2 className="text-4xl font-zentry font-black text-white mb-4">
          Ticket Submitted!
        </h2>
        <p className="text-white/70 mb-8">
          Your ticket has been received. Our HR team will review it and get back to you.
        </p>

        <div className="bg-white/10 rounded-2xl p-6 mb-8">
          <p className="text-white/60 text-sm mb-3">Your Ticket ID</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-mono font-bold text-white tracking-wider">
              {submittedTicket?.ticket_number}
            </span>
            <button
              onClick={copyTicketId}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <IoCheckmark className="text-emerald-400" />
              ) : (
                <IoCopy className="text-white/70" />
              )}
            </button>
          </div>
          <p className="text-white/50 text-sm mt-4">
            Save this ID to check your ticket status anytime.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetForm}
            className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-colors"
          >
            Submit Another
          </button>
          <button
            onClick={() => {
              setLookupId(submittedTicket?.ticket_number || "");
              setActiveView("lookup");
            }}
            className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            View Status
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderLookup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-6 py-12"
    >
      <button
        onClick={() => {
          setActiveView("home");
          setLookupResult(null);
          setLookupError(null);
        }}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
      >
        <IoArrowBack />
        <span>Back to HR Center</span>
      </button>

      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
          <IoSearch className="text-4xl text-white" />
        </div>
        <h2 className="text-4xl font-zentry font-black text-white mb-3">
          Check Ticket Status
        </h2>
        <p className="text-white/60">
          Enter your ticket ID to view the current status and updates.
        </p>
      </div>

      <form onSubmit={handleLookup} className="mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex gap-4">
            <input
              type="text"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value.toUpperCase())}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all text-white placeholder:text-white/40 font-mono text-lg tracking-wider"
              placeholder="HR-XXXXX"
            />
            <button
              type="submit"
              disabled={lookupLoading || !lookupId.trim()}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {lookupLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <IoSearch />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {lookupError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center"
          >
            <IoCloseCircle className="text-3xl text-red-400 mx-auto mb-3" />
            <p className="text-white/80">{lookupError}</p>
          </motion.div>
        )}

        {lookupResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/50 text-sm mb-1">Ticket</p>
                  <h3 className="text-2xl font-mono font-bold text-white">
                    {lookupResult.ticket_number}
                  </h3>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${STATUS_CONFIG[lookupResult.status]?.bg}`}>
                  {STATUS_CONFIG[lookupResult.status]?.icon && (
                    <span className={STATUS_CONFIG[lookupResult.status].color}>
                      {(() => {
                        const Icon = STATUS_CONFIG[lookupResult.status].icon;
                        return <Icon />;
                      })()}
                    </span>
                  )}
                  <span className={`font-semibold ${STATUS_CONFIG[lookupResult.status]?.color}`}>
                    {STATUS_CONFIG[lookupResult.status]?.label}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {lookupResult.subject}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>Type: {lookupResult.ticket_type}</span>
                    <span>Priority: {lookupResult.priority}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                    {lookupResult.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/50 text-sm mb-1">Submitted</p>
                    <p className="text-white font-medium">
                      {formatDate(lookupResult.created_at)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/50 text-sm mb-1">Last Updated</p>
                    <p className="text-white font-medium">
                      {formatDate(lookupResult.updated_at)}
                    </p>
                  </div>
                </div>

                {lookupResult.assigned_to && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-400 text-sm font-medium">
                      Assigned to: {lookupResult.assigned_to}
                    </p>
                  </div>
                )}

                {lookupResult.resolved_at && (
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
                    <p className="text-emerald-400 text-sm font-medium">
                      Resolved on: {formatDate(lookupResult.resolved_at)}
                    </p>
                  </div>
                )}

                {lookupResult.resolution_notes && (
                  <div className="bg-white/5 rounded-xl p-5">
                    <p className="text-white/50 text-sm mb-2">Resolution Notes</p>
                    <p className="text-white/80 whitespace-pre-wrap">
                      {lookupResult.resolution_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300"
            >
              <IoArrowBack className="text-xl" />
              <span className="text-sm font-semibold">Home</span>
            </button>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <IoDocumentText className="text-xl" />
              </div>
              <h1 className="text-xl font-zentry font-black text-white">
                HR Support
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate("/hr-admin")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-400/50 rounded-xl text-purple-300 hover:text-purple-200 transition-all duration-300 font-semibold"
          >
            <IoSettings className="text-lg" />
            <span className="text-sm">Admin Panel</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === "home" && renderHome()}
        {activeView === "submit" && renderSubmitForm()}
        {activeView === "success" && renderSuccess()}
        {activeView === "lookup" && renderLookup()}
      </AnimatePresence>
    </div>
  );
};

export default HRScreen;
