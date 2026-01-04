import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoArrowBack,
  IoCheckmark,
  IoAlert,
  IoDocumentText,
  IoPersonCircle,
} from "react-icons/io5";
import { supabase } from "../lib/supabase";

const TICKET_TYPES = [
  { value: "report", label: "Report an Issue", color: "bg-red-500" },
  { value: "request", label: "Request Help", color: "bg-blue-500" },
  { value: "concern", label: "Raise a Concern", color: "bg-orange-500" },
  { value: "feedback", label: "Provide Feedback", color: "bg-green-500" },
  { value: "appeal", label: "Submit an Appeal", color: "bg-purple-500" },
  { value: "other", label: "Other", color: "bg-slate-500" },
];

const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "bg-slate-500" },
  { value: "normal", label: "Normal", color: "bg-blue-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "urgent", label: "Urgent", color: "bg-red-500" },
];

const HRTicketSubmit = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    player_name: "",
    player_id: "",
    ticket_type: "report",
    subject: "",
    description: "",
    priority: "normal",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.player_name || !formData.subject || !formData.description) return;

    setSubmitting(true);

    const { error } = await supabase.from("hr_tickets").insert([
      {
        player_name: formData.player_name,
        player_id: formData.player_id || null,
        ticket_type: formData.ticket_type,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        status: "pending",
      },
    ]);

    setSubmitting(false);

    if (!error) {
      setSubmitted(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoCheckmark className="text-4xl text-white" />
          </div>
          <h2 className="text-3xl font-zentry font-black text-white mb-3">
            Ticket Submitted!
          </h2>
          <p className="text-white/70 mb-2">
            Your ticket has been submitted successfully. Our HR team will review it and get back to you.
          </p>
          <p className="text-white/50 text-sm">
            Redirecting to home...
          </p>
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
              Submit HR Ticket
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
              <IoAlert className="text-2xl text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-zentry font-black text-white mb-2">
                Need Help from HR?
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Use this form to submit tickets for any HR-related matters including reports, requests, concerns, or feedback.
                All submissions are reviewed by our HR team and will be handled confidentially.
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-white/70 mb-2 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.player_name}
                  onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-white placeholder:text-white/40"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2 font-semibold">
                  Player ID <span className="text-white/40">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.player_id}
                  onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-white placeholder:text-white/40"
                  placeholder="Your player ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-3 font-semibold">
                Ticket Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TICKET_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, ticket_type: type.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.ticket_type === type.value
                        ? `${type.color} border-white/30 shadow-lg`
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-semibold text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2 font-semibold">
                Priority Level *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {PRIORITY_LEVELS.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: priority.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.priority === priority.value
                        ? `${priority.color} border-white/30 shadow-lg`
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-semibold text-sm">{priority.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2 font-semibold">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-white placeholder:text-white/40"
                placeholder="Brief summary of your ticket"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2 font-semibold">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-blue-400 focus:outline-none transition-colors resize-none text-white placeholder:text-white/40"
                placeholder="Please provide detailed information about your ticket. Include any relevant context, dates, or specific incidents..."
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 py-4 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <IoCheckmark className="text-xl" />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-start gap-3">
            <IoPersonCircle className="text-2xl text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-2">Need to check on a ticket?</h3>
              <p className="text-white/60 text-sm">
                HR administrators can view and manage all tickets through the HR Admin Panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRTicketSubmit;
