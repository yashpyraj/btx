import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Settings,
  Download,
  Clock,
  MapPin,
  X,
  Filter,
  Grid3X3,
  List,
  CalendarDays,
} from "lucide-react";

const CATEGORIES = [
  { value: "event", label: "Event", color: "#3b82f6" },
  { value: "meeting", label: "Meeting", color: "#10b981" },
  { value: "reminder", label: "Reminder", color: "#f59e0b" },
  { value: "deadline", label: "Deadline", color: "#ef4444" },
  { value: "holiday", label: "Holiday", color: "#8b5cf6" },
  { value: "hr_activity", label: "HR Activity", color: "#06b6d4" },
  { value: "hr_warning", label: "HR Warning", color: "#dc2626" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PlanningScreen = () => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data: calendarData, error: calendarError } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("start_date", startOfMonth.toISOString())
      .lte("start_date", endOfMonth.toISOString())
      .order("start_date", { ascending: true });

    const { data: hrRecordsData, error: hrRecordsError } = await supabase
      .from("hr_player_records")
      .select("*")
      .or(`start_date.lte.${endOfMonth.toISOString().split('T')[0]},end_date.is.null`)
      .or(`end_date.gte.${startOfMonth.toISOString().split('T')[0]},end_date.is.null`)
      .order("start_date", { ascending: true });

    const { data: hrWarningsData, error: hrWarningsError } = await supabase
      .from("hr_warnings")
      .select("*")
      .gte("warning_date", startOfMonth.toISOString().split('T')[0])
      .lte("warning_date", endOfMonth.toISOString().split('T')[0])
      .order("warning_date", { ascending: true });

    const allEvents = [];

    if (!calendarError && calendarData) {
      allEvents.push(...calendarData);
    }

    if (!hrRecordsError && hrRecordsData) {
      const hrEvents = hrRecordsData.map(record => ({
        id: `hr_${record.id}`,
        title: `${record.player_name} - ${record.status}`,
        start_date: `${record.start_date}T00:00:00`,
        end_date: record.end_date ? `${record.end_date}T23:59:59` : null,
        category: "hr_activity",
        color: "#06b6d4",
        all_day: true,
        location: null,
        description: `Status: ${record.status}\nReason: ${record.reason || 'N/A'}\nNotes: ${record.notes || 'N/A'}\nAdded by: ${record.added_by}`,
        hr_type: "activity",
        hr_data: record
      }));
      allEvents.push(...hrEvents);
    }

    if (!hrWarningsError && hrWarningsData) {
      const warningEvents = hrWarningsData.map(warning => ({
        id: `warning_${warning.id}`,
        title: `⚠️ ${warning.player_name} - ${warning.warning_type}`,
        start_date: `${warning.warning_date}T00:00:00`,
        end_date: `${warning.warning_date}T23:59:59`,
        category: "hr_warning",
        color: "#dc2626",
        all_day: true,
        location: null,
        description: `Warning Type: ${warning.warning_type}\nReason: ${warning.reason}\nNotes: ${warning.notes || 'N/A'}\nIssued by: ${warning.issued_by}`,
        hr_type: "warning",
        hr_data: warning
      }));
      allEvents.push(...warningEvents);
    }

    allEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    setEvents(allEvents);
    setLoading(false);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventStartDate = new Date(event.start_date);
      const eventEndDate = event.end_date ? new Date(event.end_date) : eventStartDate;

      const dateToCheck = new Date(date);
      dateToCheck.setHours(0, 0, 0, 0);

      const startDate = new Date(eventStartDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(eventEndDate);
      endDate.setHours(0, 0, 0, 0);

      const isInRange = dateToCheck >= startDate && dateToCheck <= endDate;

      if (filterCategory === "all") return isInRange;
      return isInRange && event.category === filterCategory;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const takeScreenshot = async () => {
    if (calendarRef.current) {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `calendar-${MONTHS[currentDate.getMonth()]}-${currentDate.getFullYear()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter((event) => new Date(event.start_date) >= today)
      .slice(0, 5);
  };

  const days = getDaysInMonth();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <Calendar className="text-blue-400" size={36} />
                  Event Calendar
                </h1>
                <p className="text-white/60 mt-1">Plan and track all upcoming events</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={takeScreenshot}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-all"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Screenshot</span>
              </button>
              <button
                onClick={() => navigate("/planning-admin")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all"
              >
                <Settings size={18} />
                <span className="hidden sm:inline">Go to Admin</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4">
              <div
                ref={calendarRef}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 md:p-6 border-b border-white/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateMonth(-1)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => navigateMonth(1)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </h2>
                      <button
                        onClick={goToToday}
                        className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium transition-all"
                      >
                        Today
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className={`p-2 rounded-lg transition-all ${
                            filterCategory !== "all"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          <Filter size={20} />
                        </button>
                        {showFilters && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-20 overflow-hidden">
                            <button
                              onClick={() => {
                                setFilterCategory("all");
                                setShowFilters(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm transition-all ${
                                filterCategory === "all"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "text-white/60 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              All Categories
                            </button>
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat.value}
                                onClick={() => {
                                  setFilterCategory(cat.value);
                                  setShowFilters(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-all ${
                                  filterCategory === cat.value
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex bg-white/5 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode("month")}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === "month"
                              ? "bg-blue-500 text-white"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          <Grid3X3 size={18} />
                        </button>
                        <button
                          onClick={() => setViewMode("week")}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === "week"
                              ? "bg-blue-500 text-white"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          <CalendarDays size={18} />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-2 rounded-lg transition-all ${
                            viewMode === "list"
                              ? "bg-blue-500 text-white"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          <List size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {viewMode === "month" && (
                  <div className="p-2 md:p-4">
                    <div className="grid grid-cols-7 mb-2">
                      {DAYS.map((day) => (
                        <div
                          key={day}
                          className="p-2 md:p-3 text-center text-xs md:text-sm font-semibold text-white/40"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {days.map((dayObj, index) => {
                        const dayEvents = getEventsForDate(dayObj.date);
                        const today = isToday(dayObj.date);

                        return (
                          <div
                            key={index}
                            className={`min-h-[80px] md:min-h-[100px] p-1 md:p-2 rounded-lg transition-all ${
                              dayObj.isCurrentMonth
                                ? "bg-white/5 hover:bg-white/10"
                                : "bg-transparent"
                            } ${today ? "ring-2 ring-blue-500" : ""}`}
                          >
                            <span
                              className={`text-xs md:text-sm font-medium ${
                                today
                                  ? "text-blue-400"
                                  : dayObj.isCurrentMonth
                                    ? "text-white/80"
                                    : "text-white/20"
                              }`}
                            >
                              {dayObj.day}
                            </span>
                            <div className="mt-1 space-y-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <button
                                  key={event.id}
                                  onClick={() => setSelectedEvent(event)}
                                  className="w-full text-left px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium truncate transition-all hover:scale-105"
                                  style={{
                                    backgroundColor: `${event.color}20`,
                                    color: event.color,
                                    borderLeft: `3px solid ${event.color}`,
                                  }}
                                >
                                  {event.title}
                                </button>
                              ))}
                              {dayEvents.length > 3 && (
                                <span className="text-[10px] text-white/40 pl-1">
                                  +{dayEvents.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {viewMode === "list" && (
                  <div className="p-4 md:p-6">
                    {loading ? (
                      <div className="text-center py-12 text-white/40">Loading events...</div>
                    ) : events.length === 0 ? (
                      <div className="text-center py-12 text-white/40">
                        No events this month
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {events
                          .filter(
                            (e) => filterCategory === "all" || e.category === filterCategory
                          )
                          .map((event) => (
                            <button
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-1 h-full min-h-[60px] rounded-full"
                                  style={{ backgroundColor: event.color }}
                                />
                                <div className="flex-1">
                                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                                    {event.title}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/60">
                                    <span className="flex items-center gap-1">
                                      <Clock size={14} />
                                      {formatEventDate(event.start_date)}
                                      {!event.all_day && ` at ${formatTime(event.start_date)}`}
                                    </span>
                                    {event.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {event.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${event.color}20`,
                                    color: event.color,
                                  }}
                                >
                                  {CATEGORIES.find((c) => c.value === event.category)?.label ||
                                    event.category}
                                </span>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "week" && (
                  <div className="p-4 md:p-6">
                    <WeekView
                      currentDate={currentDate}
                      events={events}
                      filterCategory={filterCategory}
                      onEventClick={setSelectedEvent}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-1/4 space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="text-blue-400" size={20} />
                  Upcoming Events
                </h3>
                {upcomingEvents.length === 0 ? (
                  <p className="text-white/40 text-sm">No upcoming events</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: event.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                              {event.title}
                            </h4>
                            <p className="text-white/40 text-xs mt-0.5">
                              {formatEventDate(event.start_date)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-6">
                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const count = events.filter((e) => e.category === cat.value).length;
                    return (
                      <div
                        key={cat.value}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-white/80 text-sm">{cat.label}</span>
                        </div>
                        <span className="text-white/40 text-sm">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-4 md:p-6">
                <h3 className="text-lg font-bold text-white mb-2">Monthly Stats</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">{events.length}</p>
                    <p className="text-white/60 text-sm">Total Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-400">{upcomingEvents.length}</p>
                    <p className="text-white/60 text-sm">Upcoming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

const WeekView = ({ currentDate, events, filterCategory, onEventClick }) => {
  const getWeekDays = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDateAndHour = (date, hour) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      const isSameDay =
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
      const isSameHour = eventDate.getHours() === hour;
      if (filterCategory === "all") return isSameDay && isSameHour;
      return isSameDay && isSameHour && event.category === filterCategory;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="overflow-auto max-h-[600px]">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-8 border-b border-white/10 sticky top-0 bg-slate-800 z-10">
          <div className="p-2 text-white/40 text-xs" />
          {weekDays.map((date, i) => (
            <div
              key={i}
              className={`p-2 text-center ${isToday(date) ? "bg-blue-500/20" : ""}`}
            >
              <p className="text-white/40 text-xs">{DAYS[i]}</p>
              <p
                className={`text-lg font-bold ${isToday(date) ? "text-blue-400" : "text-white"}`}
              >
                {date.getDate()}
              </p>
            </div>
          ))}
        </div>

        <div>
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-white/5">
              <div className="p-2 text-white/40 text-xs text-right pr-4">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
              {weekDays.map((date, i) => {
                const hourEvents = getEventsForDateAndHour(date, hour);
                return (
                  <div
                    key={i}
                    className={`p-1 min-h-[50px] border-l border-white/5 ${
                      isToday(date) ? "bg-blue-500/5" : ""
                    }`}
                  >
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="w-full text-left px-2 py-1 rounded text-xs font-medium truncate mb-1"
                        style={{
                          backgroundColor: `${event.color}30`,
                          color: event.color,
                          borderLeft: `2px solid ${event.color}`,
                        }}
                      >
                        {event.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EventModal = ({ event, onClose }) => {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div
          className="h-2"
          style={{ backgroundColor: event.color }}
        />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block"
                style={{
                  backgroundColor: `${event.color}20`,
                  color: event.color,
                }}
              >
                {CATEGORIES.find((c) => c.value === event.category)?.label || event.category}
              </span>
              <h2 className="text-2xl font-bold text-white mt-2">{event.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <Clock size={18} className="text-blue-400" />
              <div>
                <p>{formatDate(event.start_date)}</p>
                {!event.all_day && (
                  <p className="text-white/60 text-sm">
                    {formatTime(event.start_date)}
                    {event.end_date && ` - ${formatTime(event.end_date)}`}
                  </p>
                )}
                {event.all_day && <p className="text-white/60 text-sm">All day</p>}
              </div>
            </div>

            {event.location && (
              <div className="flex items-center gap-3 text-white/80">
                <MapPin size={18} className="text-emerald-400" />
                <p>{event.location}</p>
              </div>
            )}

            {event.description && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanningScreen;
