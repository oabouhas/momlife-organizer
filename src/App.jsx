import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const CATEGORIES = ["Baby", "School", "Work", "Social", "Self-care"];
const PRIORITIES = ["High", "Medium", "Low"];

const categoryConfig = {
  Baby:       { color: "#FF6B9D", bg: "#FFF0F5", icon: "🍼" },
  School:     { color: "#F59E0B", bg: "#FFFBEB", icon: "📚" },
  Work:       { color: "#3B82F6", bg: "#EFF6FF", icon: "💼" },
  Social:     { color: "#10B981", bg: "#ECFDF5", icon: "🌸" },
  "Self-care":{ color: "#8B5CF6", bg: "#F5F3FF", icon: "✨" },
};

const priorityConfig = {
  High:   { color: "#EF4444", label: "🔴 High" },
  Medium: { color: "#F59E0B", label: "🟡 Medium" },
  Low:    { color: "#10B981", label: "🟢 Low" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #FFF5F8;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background: linear-gradient(135deg, #FFF0F5 0%, #FFF5F0 50%, #F5F0FF 100%);
  }

  .sidebar {
    position: fixed;
    left: 0; top: 0;
    width: 72px;
    height: 100vh;
    background: white;
    border-right: 1px solid #FFE4EE;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    gap: 8px;
    z-index: 100;
    box-shadow: 4px 0 24px rgba(255,107,157,0.06);
  }

  .logo {
    font-size: 22px;
    margin-bottom: 16px;
  }

  .nav-btn {
    width: 48px; height: 48px;
    border-radius: 14px;
    border: none;
    background: transparent;
    font-size: 20px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    position: relative;
  }

  .nav-btn:hover { background: #FFF0F5; transform: scale(1.05); }
  .nav-btn.active { background: #FF6B9D; box-shadow: 0 4px 12px rgba(255,107,157,0.35); }

  .dark-btn {
    margin-top: auto;
    width: 44px; height: 44px;
    border-radius: 12px;
    border: 1px solid #FFE4EE;
    background: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dark-btn:hover { background: #FFF0F5; }

  .main {
    margin-left: 72px;
    padding: 32px 40px;
    max-width: 1100px;
  }

  .header {
    margin-bottom: 32px;
  }

  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    color: #1A1A2E;
    line-height: 1.2;
  }

  .header p {
    color: #9CA3AF;
    font-size: 14px;
    margin-top: 4px;
  }

  /* STATS */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    border: 1px solid #FFE4EE;
    text-align: center;
    box-shadow: 0 2px 12px rgba(255,107,157,0.06);
  }

  .stat-number {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: #FF6B9D;
  }

  .stat-label {
    font-size: 12px;
    color: #9CA3AF;
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* PROGRESS */
  .progress-wrap {
    background: white;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 24px;
    border: 1px solid #FFE4EE;
    box-shadow: 0 2px 12px rgba(255,107,157,0.06);
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #6B7280;
    margin-bottom: 10px;
  }

  .progress-track {
    height: 8px;
    background: #FFE4EE;
    border-radius: 99px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF6B9D, #FF9EC4);
    border-radius: 99px;
    transition: width 0.5s ease;
  }

  /* ADD TASK */
  .add-task-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid #FFE4EE;
    box-shadow: 0 2px 12px rgba(255,107,157,0.06);
  }

  .add-task-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    color: #1A1A2E;
    margin-bottom: 16px;
  }

  .input-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .task-input {
    flex: 1;
    min-width: 180px;
    padding: 12px 16px;
    border: 1.5px solid #FFE4EE;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    background: #FAFAFA;
    transition: border-color 0.2s;
  }

  .task-input:focus { border-color: #FF6B9D; background: white; }

  .select-input {
    padding: 12px 14px;
    border: 1.5px solid #FFE4EE;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    background: #FAFAFA;
    outline: none;
    cursor: pointer;
  }

  .add-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #FF6B9D, #FF9EC4);
    color: white;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(255,107,157,0.3);
  }

  .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,107,157,0.4); }
  .add-btn:active { transform: translateY(0); }

  /* FILTERS */
  .filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .filter-chip {
    padding: 8px 16px;
    border-radius: 99px;
    border: 1.5px solid #FFE4EE;
    background: white;
    font-size: 13px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    color: #6B7280;
  }

  .filter-chip:hover { border-color: #FF6B9D; color: #FF6B9D; }
  .filter-chip.active { background: #FF6B9D; border-color: #FF6B9D; color: white; font-weight: 600; }

  /* SEARCH */
  .search-wrap {
    position: relative;
    margin-bottom: 20px;
  }

  .search-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: #D1D5DB;
  }

  .search-input {
    width: 100%;
    padding: 12px 16px 12px 42px;
    border: 1.5px solid #FFE4EE;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    background: white;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input:focus { border-color: #FF6B9D; }

  /* TASKS */
  .task-list { display: flex; flex-direction: column; gap: 10px; }

  .task-card {
    background: white;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1.5px solid #FFE4EE;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    transition: all 0.2s;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .task-card:hover { box-shadow: 0 4px 16px rgba(255,107,157,0.12); transform: translateY(-1px); }

  .task-checkbox {
    width: 22px; height: 22px;
    border-radius: 6px;
    border: 2px solid #FFB3CC;
    background: white;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    font-size: 13px;
  }

  .task-checkbox.done { background: #FF6B9D; border-color: #FF6B9D; }

  .task-cat-badge {
    padding: 4px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .task-text {
    flex: 1;
    font-size: 14px;
    color: #1A1A2E;
    transition: all 0.2s;
  }

  .task-text.done { text-decoration: line-through; color: #D1D5DB; }

  .priority-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .task-actions { display: flex; gap: 6px; }

  .icon-btn {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: none;
    background: #F9F9F9;
    font-size: 14px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }

  .icon-btn:hover { background: #FFE4EE; transform: scale(1.1); }

  .edit-input {
    flex: 1;
    padding: 8px 12px;
    border: 1.5px solid #FF6B9D;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
  }

  .save-btn {
    padding: 8px 16px;
    background: #FF6B9D;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #D1D5DB;
  }

  .empty-state .emoji { font-size: 48px; margin-bottom: 12px; }
  .empty-state p { font-size: 15px; }

  /* CALENDAR */
  .calendar-layout {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
  }

  .react-calendar {
    border: 1.5px solid #FFE4EE !important;
    border-radius: 20px !important;
    padding: 16px !important;
    font-family: 'DM Sans', sans-serif !important;
    box-shadow: 0 2px 12px rgba(255,107,157,0.06) !important;
  }

  .react-calendar__tile--active {
    background: #FF6B9D !important;
    border-radius: 10px !important;
  }

  .react-calendar__tile:hover {
    background: #FFF0F5 !important;
    border-radius: 10px !important;
  }

  .appt-panel {
    background: white;
    border-radius: 20px;
    padding: 24px;
    border: 1.5px solid #FFE4EE;
    box-shadow: 0 2px 12px rgba(255,107,157,0.06);
  }

  .appt-panel h3 {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: #1A1A2E;
    margin-bottom: 20px;
  }

  .appt-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: #FFF0F5;
    border-radius: 12px;
    margin-bottom: 10px;
    animation: slideIn 0.3s ease;
  }

  .appt-time {
    font-size: 12px;
    color: #FF6B9D;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .appt-text { font-size: 14px; color: #1A1A2E; }

  /* CHAT */
  .chat-wrap {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 160px);
    background: white;
    border-radius: 24px;
    border: 1.5px solid #FFE4EE;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(255,107,157,0.06);
  }

  .chat-header {
    padding: 20px 24px;
    border-bottom: 1px solid #FFE4EE;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chat-avatar {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #FF6B9D, #FF9EC4);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }

  .chat-avatar-info h3 {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    color: #1A1A2E;
  }

  .chat-avatar-info p { font-size: 12px; color: #10B981; }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .msg {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    animation: slideIn 0.3s ease;
  }

  .msg.user { flex-direction: row-reverse; }

  .msg-bubble {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.5;
  }

  .msg.bot .msg-bubble {
    background: #FFF0F5;
    color: #1A1A2E;
    border-bottom-left-radius: 4px;
  }

  .msg.user .msg-bubble {
    background: linear-gradient(135deg, #FF6B9D, #FF9EC4);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .msg-icon {
    width: 32px; height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #FF6B9D, #FF9EC4);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .typing {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 4px 0;
  }

  .typing span {
    width: 7px; height: 7px;
    background: #FFB3CC;
    border-radius: 50%;
    animation: bounce 1.2s infinite;
  }

  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }

  .chat-input-row {
    padding: 16px 24px;
    border-top: 1px solid #FFE4EE;
    display: flex;
    gap: 10px;
  }

  .chat-input {
    flex: 1;
    padding: 12px 18px;
    border: 1.5px solid #FFE4EE;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    background: #FAFAFA;
    transition: border-color 0.2s;
  }

  .chat-input:focus { border-color: #FF6B9D; background: white; }

  .send-btn {
    width: 46px; height: 46px;
    background: linear-gradient(135deg, #FF6B9D, #FF9EC4);
    border: none;
    border-radius: 14px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(255,107,157,0.3);
  }

  .send-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,107,157,0.4); }
  .send-btn:disabled { opacity: 0.5; cursor: default; transform: none; }

  /* DARK MODE */
  .dark .app { background: linear-gradient(135deg, #1A1A2E, #16213E, #0F3460); }
  .dark .sidebar { background: #1E1E2E; border-color: #2A2A3E; }
  .dark .nav-btn:hover { background: #2A2A3E; }
  .dark .stat-card, .dark .progress-wrap, .dark .add-task-card, .dark .task-card,
  .dark .appt-panel, .dark .chat-wrap { background: #1E1E2E; border-color: #2A2A3E; }
  .dark .task-input, .dark .select-input, .dark .search-input, .dark .chat-input { background: #2A2A3E; border-color: #3A3A4E; color: white; }
  .dark .task-text { color: #E5E7EB; }
  .dark .header h1 { color: white; }
  .dark .appt-panel h3 { color: white; }
  .dark .appt-card { background: #2A2A3E; }
  .dark .appt-text { color: #E5E7EB; }
  .dark .filter-chip { background: #1E1E2E; border-color: #2A2A3E; color: #9CA3AF; }
  .dark .icon-btn { background: #2A2A3E; }
  .dark .msg.bot .msg-bubble { background: #2A2A3E; color: #E5E7EB; }
  .dark .chat-header { border-color: #2A2A3E; }
  .dark .chat-input-row { border-color: #2A2A3E; }

  /* MOBILE */
  @media (max-width: 768px) {
    .sidebar { width: 100%; height: 64px; flex-direction: row; justify-content: space-around; bottom: 0; top: auto; border-right: none; border-top: 1px solid #FFE4EE; padding: 0 16px; }
    .logo { display: none; }
    .dark-btn { margin-top: 0; margin-left: auto; }
    .main { margin-left: 0; margin-bottom: 64px; padding: 20px 16px; }
    .stats-row { grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .calendar-layout { grid-template-columns: 1fr; }
    .chat-wrap { height: calc(100vh - 200px); }
    .input-row { flex-direction: column; }
    .add-btn { width: 100%; }
  }
`;

export default function App() {
  const [view, setView] = useState("tasks");
  const [darkMode, setDarkMode] = useState(false);

  // Tasks
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Baby");
  const [priority, setPriority] = useState("High");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [appointmentText, setAppointmentText] = useState("");
  const [time, setTime] = useState("");

  // Chat
  const [messages, setMessages] = useState([
    { text: "Hi mama! 💖 I'm here to help you balance it all. Ask me anything — parenting, studying, self-care, or just need to vent!", type: "bot" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("mb_tasks");
    const savedDark = localStorage.getItem("mb_dark");
    const savedAppts = localStorage.getItem("mb_appointments");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedDark) setDarkMode(JSON.parse(savedDark));
    if (savedAppts) setAppointments(JSON.parse(savedAppts));
  }, []);

  useEffect(() => { localStorage.setItem("mb_tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem("mb_dark", JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem("mb_appointments", JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([{ text: task, category, priority, completed: false, id: Date.now() }, ...tasks]);
    setTask("");
  };

  const toggleComplete = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const startEdit = (t) => { setEditIndex(t.id); setEditText(t.text); };
  const saveEdit = () => { setTasks(tasks.map(t => t.id === editIndex ? { ...t, text: editText } : t)); setEditIndex(null); };

  const sortedFilteredTasks = tasks
    .filter(t => filter === "All" || t.category === filter)
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    });

  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const addAppointment = () => {
    if (!appointmentText.trim()) return;
    const key = selectedDate.toDateString();
    setAppointments({ ...appointments, [key]: [...(appointments[key] || []), { text: appointmentText, time, id: Date.now() }] });
    setAppointmentText(""); setTime("");
  };

  const deleteAppointment = (id) => {
    const key = selectedDate.toDateString();
    setAppointments({ ...appointments, [key]: (appointments[key] || []).filter(a => a.id !== id) });
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages(prev => [...prev, { text: userMsg, type: "user" }]);
    setIsTyping(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are Mama Assistant — a warm, empathetic AI companion for moms who are also students or professionals. You give practical, encouraging advice about parenting, studying, work-life balance, self-care, and managing stress. Keep responses concise (2-4 sentences), warm, and supportive. Use occasional emojis. Never give medical advice."
            },
            ...messages.filter(m => m.type !== "typing").map(m => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.text
            })),
            { role: "user", content: userMsg }
          ],
          max_tokens: 256,
          temperature: 0.8
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "I'm here for you! 💖 Try again in a moment.";
      setMessages(prev => [...prev, { text: reply, type: "bot" }]);
    } catch {
      setMessages(prev => [...prev, { text: "Oops, something went wrong. I'm still here for you! 💖", type: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className={darkMode ? "dark" : ""}>
      <style>{css}</style>
      <div className="app">

        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="logo">💖</div>
          {[
            { id: "tasks", icon: "✅", label: "Tasks" },
            { id: "calendar", icon: "📅", label: "Calendar" },
            { id: "chat", icon: "💬", label: "Chat" },
          ].map(n => (
            <button
              key={n.id}
              className={`nav-btn ${view === n.id ? "active" : ""}`}
              onClick={() => setView(n.id)}
              title={n.label}
            >
              {n.icon}
            </button>
          ))}
          <button className="dark-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </nav>

        {/* MAIN */}
        <main className="main">

          {/* TASKS VIEW */}
          {view === "tasks" && (
            <>
              <div className="header">
                <h1>{greeting}, Mama ✨</h1>
                <p>You're doing amazing — one task at a time.</p>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-number">{tasks.length}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{completed}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{tasks.length - completed}</div>
                  <div className="stat-label">Remaining</div>
                </div>
              </div>

              <div className="progress-wrap">
                <div className="progress-label">
                  <span>Today's Progress</span>
                  <span style={{ color: "#FF6B9D", fontWeight: 600 }}>{progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="add-task-card">
                <h3>Add a new task</h3>
                <div className="input-row">
                  <input
                    className="task-input"
                    placeholder="What do you need to do?"
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTask()}
                  />
                  <select className="select-input" value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c} {categoryConfig[c].icon}</option>)}
                  </select>
                  <select className="select-input" value={priority} onChange={e => setPriority(e.target.value)}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <button className="add-btn" onClick={addTask}>+ Add Task</button>
                </div>
              </div>

              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="filters">
                {["All", ...CATEGORIES].map(f => (
                  <button
                    key={f}
                    className={`filter-chip ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f !== "All" && categoryConfig[f]?.icon + " "}{f}
                  </button>
                ))}
              </div>

              <div className="task-list">
                {sortedFilteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="emoji">🌸</div>
                    <p>No tasks yet — you deserve a break mama!</p>
                  </div>
                ) : sortedFilteredTasks.map(t => (
                  <div key={t.id} className="task-card">
                    <div
                      className={`task-checkbox ${t.completed ? "done" : ""}`}
                      onClick={() => toggleComplete(t.id)}
                    >
                      {t.completed && "✓"}
                    </div>

                    <span
                      className="task-cat-badge"
                      style={{
                        background: categoryConfig[t.category]?.bg,
                        color: categoryConfig[t.category]?.color
                      }}
                    >
                      {categoryConfig[t.category]?.icon} {t.category}
                    </span>

                    {editIndex === t.id ? (
                      <>
                        <input
                          className="edit-input"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && saveEdit()}
                          autoFocus
                        />
                        <button className="save-btn" onClick={saveEdit}>Save</button>
                      </>
                    ) : (
                      <span className={`task-text ${t.completed ? "done" : ""}`}>{t.text}</span>
                    )}

                    <div
                      className="priority-dot"
                      style={{ background: priorityConfig[t.priority]?.color }}
                      title={t.priority + " priority"}
                    />

                    <div className="task-actions">
                      <button className="icon-btn" onClick={() => startEdit(t)} title="Edit">✏️</button>
                      <button className="icon-btn" onClick={() => deleteTask(t.id)} title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CALENDAR VIEW */}
          {view === "calendar" && (
            <>
              <div className="header">
                <h1>Your Calendar 📅</h1>
                <p>Stay on top of every appointment and milestone.</p>
              </div>
              <div className="calendar-layout">
                <Calendar value={selectedDate} onChange={setSelectedDate} />
                <div className="appt-panel">
                  <h3>📍 {selectedDate.toDateString()}</h3>
                  <div className="input-row" style={{ marginBottom: 20 }}>
                    <input
                      type="time"
                      className="task-input"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      style={{ width: 120, flex: "none" }}
                    />
                    <input
                      className="task-input"
                      placeholder="Add appointment..."
                      value={appointmentText}
                      onChange={e => setAppointmentText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addAppointment()}
                    />
                    <button className="add-btn" onClick={addAppointment}>+ Add</button>
                  </div>

                  {(appointments[selectedDate.toDateString()] || []).length === 0 ? (
                    <div className="empty-state" style={{ padding: "30px 20px" }}>
                      <div className="emoji" style={{ fontSize: 32 }}>📭</div>
                      <p>No appointments for this day</p>
                    </div>
                  ) : (appointments[selectedDate.toDateString()] || []).map(a => (
                    <div key={a.id} className="appt-card">
                      <div>
                        {a.time && <div className="appt-time">🕐 {a.time}</div>}
                        <div className="appt-text">{a.text}</div>
                      </div>
                      <button className="icon-btn" onClick={() => deleteAppointment(a.id)}>🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CHAT VIEW */}
          {view === "chat" && (
            <>
              <div className="header">
                <h1>Mama Assistant 💬</h1>
                <p>Your personal AI companion — always here to listen.</p>
              </div>
              <div className="chat-wrap">
                <div className="chat-header">
                  <div className="chat-avatar">🤱</div>
                  <div className="chat-avatar-info">
                    <h3>Mama Assistant</h3>
                    <p>● Online — powered by Llama 3.3</p>
                  </div>
                </div>

                <div className="chat-messages">
                  {messages.map((m, i) => (
                    <div key={i} className={`msg ${m.type}`}>
                      {m.type === "bot" && <div className="msg-icon">🤱</div>}
                      <div className="msg-bubble">{m.text}</div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="msg bot">
                      <div className="msg-icon">🤱</div>
                      <div className="msg-bubble">
                        <div className="typing">
                          <span /><span /><span />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="chat-input-row">
                  <input
                    className="chat-input"
                    placeholder="Ask me anything, mama..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    disabled={isTyping}
                  />
                  <button className="send-btn" onClick={sendMessage} disabled={isTyping}>↑</button>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}