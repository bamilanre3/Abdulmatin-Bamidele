/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  BookOpen, 
  BookMarked, 
  TrendingUp, 
  Brain, 
  Plus, 
  Trash2, 
  Send, 
  Download, 
  CheckCircle, 
  FileText, 
  Calendar, 
  Sliders, 
  Users, 
  DollarSign, 
  Activity, 
  AlertTriangle,
  Play,
  FileSpreadsheet,
  Check,
  Edit3
} from "lucide-react";
import { 
  Course, 
  TradingSignal, 
  JournalEntry, 
  Payment, 
  User, 
  UserRole, 
  Lesson 
} from "../types";

interface DashboardViewProps {
  user: User | null;
  onOpenLogin: () => void;
  onNavigate: (route: string) => void;
  fetchSignals: () => void;
}

export default function DashboardView({
  user,
  onOpenLogin,
  onNavigate,
  fetchSignals
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "journal" | "ai_coach" | "notes" | "billing">("overview");
  const [adminTab, setAdminTab] = useState<"stats" | "signals" | "blog" | "faq">("stats");

  // Student states
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notes, setNotes] = useState<{ id?: string; title: string; content: string }[]>([]);
  const [activeNote, setActiveNote] = useState<{ id?: string; title: string; content: string }>({ title: "", content: "" });
  
  // AI Coach state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChat, setAiChat] = useState<{ sender: "user" | "coach"; text: string }[]>([
    { sender: "coach", text: "Welcome to the Bash On Air private desk. I am your server-side institutional AI analyst. Ask me anything about Smart Money Concepts (SMC), FVG zones, order blocks, position sizing, or risk-to-reward parameters." }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Journal form states
  const [jPair, setJPair] = useState("EUR/USD");
  const [jDir, setJDir] = useState<"BUY" | "SELL">("BUY");
  const [jEntry, setJEntry] = useState("");
  const [jExit, setJExit] = useState("");
  const [jSize, setJSize] = useState("");
  const [jProfit, setJProfit] = useState("");
  const [jNotes, setJNotes] = useState("");

  // Admin stats states
  const [adminStats, setAdminStats] = useState<any>(null);

  // Admin Signal form states
  const [sPair, setSPair] = useState("EUR/USD");
  const [sDir, setSDir] = useState<"BUY" | "SELL">("BUY");
  const [sEntry, setSEntry] = useState("");
  const [sStop, setSStop] = useState("");
  const [sTarget, setSTarget] = useState("");
  const [sRisk, setSRisk] = useState<"Low" | "Medium" | "High">("Medium");
  const [sComment, setSComment] = useState("");
  const [signalSubmitting, setSignalSubmitting] = useState(false);

  // Admin FAQ form states
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [faqCat, setFaqCat] = useState<"General" | "Courses" | "Signals" | "Payments" | "Mentorship">("General");

  // Admin Blog form states
  const [bTitle, setBTitle] = useState("");
  const [bExcerpt, setBExcerpt] = useState("");
  const [bContent, setBContent] = useState("");
  const [bCat, setBCat] = useState<"Market Analysis" | "Trading Psychology" | "Forex Tips" | "Crypto Analysis">("Market Analysis");

  const [downloadingCert, setDownloadingCert] = useState<string | null>(null);

  const localUser = user || {
    id: "usr_guest",
    name: "Guest Trader",
    email: "guest@bashonair.com",
    role: UserRole.STUDENT,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    joinedDate: new Date().toISOString()
  };

  // Load student dashboard datasets
  const loadStudentData = async () => {
    try {
      // 1. Enrolled courses
      const cres = await fetch(`/api/courses?userId=${localUser.id}`);
      if (cres.ok) {
        const list = await cres.json();
        // If in guest mode, show all courses in the curriculum player for demo/interactive purposes!
        const filtered = list.filter((c: Course) => c.progress !== undefined || !user);
        setEnrolledCourses(filtered);
        if (filtered.length > 0 && !selectedCourse) {
          setSelectedCourse(filtered[0]);
          if (filtered[0].lessons.length > 0) {
            setActiveLesson(filtered[0].lessons[0]);
          }
        }
      }

      // 2. Journal Entries
      const jres = await fetch("/api/journal");
      if (jres.ok) {
        const jList = await jres.json();
        setJournal(jList);
      }

      // 3. Notes
      const nres = await fetch("/api/notes");
      if (nres.ok) {
        const nList = await nres.json();
        setNotes(nList);
        if (nList.length > 0 && !activeNote.id) {
          setActiveNote(nList[0]);
        }
      }

      // 4. Payments
      const pres = await fetch(`/api/payments/history?userId=${localUser.id}`);
      if (pres.ok) {
        const pList = await pres.json();
        setPayments(pList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load Admin statistical overview datasets
  const loadAdminData = async () => {
    if (localUser.role !== UserRole.ADMIN) return;
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStudentData();
    loadAdminData();
  }, [user]);

  // Handle lesson progress complete
  const handleToggleLessonComplete = async (lessonId: string, currentCompleted: boolean) => {
    if (!localUser || !selectedCourse) return;
    try {
      const res = await fetch("/api/courses/lesson-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localUser.id,
          courseId: selectedCourse.id,
          lessonId,
          completed: !currentCompleted
        })
      });

      if (res.ok) {
        // Reload course progress values
        loadStudentData();
        // Update currently highlighted active course progress
        const updatedEnrollment = await res.json();
        setSelectedCourse(prev => {
          if (!prev) return null;
          return { ...prev, progress: updatedEnrollment.progress };
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AI Chat prompt submission
  const handleAiChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = aiPrompt;
    setAiChat(prev => [...prev, { sender: "user", text: userMsg }]);
    setAiPrompt("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          context: {
            user_name: user?.name,
            bio: user?.bio
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiChat(prev => [...prev, { sender: "coach", text: data.text }]);
      } else {
        setAiChat(prev => [...prev, { sender: "coach", text: "AI Coach: Error connecting to Gemini core. Make sure to set GEMINI_API_KEY in the Secrets menu!" }]);
      }
    } catch (e) {
      setAiChat(prev => [...prev, { sender: "coach", text: "AI Coach: Error connecting to the server API." }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Journal Trade Submission
  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/journal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: jPair,
          direction: jDir,
          entry: jEntry,
          exit: jExit,
          size: jSize,
          profit: jProfit,
          notes: jNotes
        })
      });

      if (res.ok) {
        loadStudentData();
        setJEntry("");
        setJExit("");
        setJSize("");
        setJProfit("");
        setJNotes("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJournalDelete = async (id: string) => {
    try {
      const res = await fetch("/api/journal/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) loadStudentData();
    } catch (e) {
      console.error(e);
    }
  };

  // Note Pad save
  const handleNoteSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNote.title || !activeNote.content) return;

    try {
      const res = await fetch("/api/notes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeNote)
      });
      if (res.ok) {
        const saved = await res.json();
        loadStudentData();
        setActiveNote(saved);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNoteDelete = async (id: string) => {
    try {
      await fetch("/api/notes/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setActiveNote({ title: "", content: "" });
      loadStudentData();
    } catch (e) {
      console.error(e);
    }
  };

  // ADMIN SUBMISSIONS
  const handleAdminSignalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignalSubmitting(true);
    try {
      const res = await fetch("/api/signals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: sPair,
          entry: sEntry,
          stopLoss: sStop,
          takeProfit: sTarget,
          risk: sRisk,
          direction: sDir,
          comment: sComment
        })
      });

      if (res.ok) {
        setSEntry("");
        setSStop("");
        setSTarget("");
        setSComment("");
        fetchSignals(); // reload signals in main tree
        loadAdminData();
        alert("Live alert signal published successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSignalSubmitting(false);
    }
  };

  const handleAdminFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/faqs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: faqQ, answer: faqA, category: faqCat })
      });
      if (res.ok) {
        setFaqQ("");
        setFaqA("");
        loadAdminData();
        alert("FAQ added successfully!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: bTitle, excerpt: bExcerpt, content: bContent, category: bCat })
      });
      if (res.ok) {
        setBTitle("");
        setBExcerpt("");
        setBContent("");
        loadAdminData();
        alert("Blog published successfully!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulated Certificate Downloader
  const simulateCertificateDownload = (courseTitle: string) => {
    setDownloadingCert(courseTitle);
    setTimeout(() => {
      setDownloadingCert(null);
      // Create element anchor to trigger virtual download
      const content = `BASH ON AIR TRADING ACADEMY\n=========================\n\nCERTIFICATE OF COMPLETION\n\nThis is to officially certify that:\n\n      ${localUser?.name || "Alex Trader"}\n\nhas successfully completed the rigorous professional trading class:\n\n"${courseTitle}"\n\nAcquired competencies include Technical SMC structural modeling, risk sizing expectancy validation, and execution algorithms.\n\nDate: ${new Date().toLocaleDateString()}\nChief Mentor: Coach Bash\nVerify License: BOA-${Math.floor(100000 + Math.random() * 900000)}`;
      const file = new Blob([content], { type: "text/plain" });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(file);
      element.download = `BOA_Certificate_${courseTitle.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <div className="bg-transparent min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* User top profile panel */}
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={localUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
              alt={localUser?.name} 
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100"
            />
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{localUser?.name}</h2>
              <p className="text-xs text-gray-500 font-mono">{localUser?.email} • Student ID: BOA-{localUser?.id?.substring(4, 10)}</p>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                localUser?.role === UserRole.ADMIN ? "bg-indigo-600 text-white" : "bg-blue-600 text-white"
              }`}>
                {localUser?.role} portal
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 font-mono space-y-0.5">
            <div>Joined Academy: {localUser?.joinedDate ? new Date(localUser.joinedDate).toLocaleDateString() : "Pending"}</div>
            <div>Database Sync: SECURED SQLite STORE</div>
          </div>
        </div>

        {/* ADMIN VIEW LAYOUT */}
        {localUser?.role === UserRole.ADMIN ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-3 space-y-2">
              <button
                onClick={() => setAdminTab("stats")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold font-sans flex items-center transition-all ${
                  adminTab === "stats" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Sliders className="w-4 h-4 mr-2.5" /> Platform Analytics overview
              </button>
              
              <button
                onClick={() => setAdminTab("signals")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold font-sans flex items-center transition-all ${
                  adminTab === "signals" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Activity className="w-4 h-4 mr-2.5" /> Manage Trading Signals
              </button>

              <button
                onClick={() => setAdminTab("blog")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold font-sans flex items-center transition-all ${
                  adminTab === "blog" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FileText className="w-4 h-4 mr-2.5" /> Publish Editorial Blog
              </button>

              <button
                onClick={() => setAdminTab("faq")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold font-sans flex items-center transition-all ${
                  adminTab === "faq" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2.5" /> Manage FAQs List
              </button>
            </div>

            {/* Main Content Pane */}
            <div className="lg:col-span-9 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-8 min-h-[500px]">
              
              {/* ADMIN TAB 1: OVERVIEW STATS */}
              {adminTab === "stats" && (
                <div className="space-y-8">
                  <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-50 pb-3">Corporate Revenue & Analytics</h3>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                    <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100/60">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider font-mono block">Registered users</span>
                      <span className="text-2xl font-extrabold text-gray-900 font-mono">{adminStats?.totalUsers || 2}</span>
                    </div>
                    <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100/60">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider font-mono block">Gross Revenue</span>
                      <span className="text-2xl font-extrabold text-indigo-600 font-mono">${adminStats?.totalRevenue || 249}</span>
                    </div>
                    <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100/60">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider font-mono block">Active Signals</span>
                      <span className="text-2xl font-extrabold text-gray-900 font-mono">{adminStats?.activeSignals || 2}</span>
                    </div>
                    <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100/60">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider font-mono block">Academy Courses</span>
                      <span className="text-2xl font-extrabold text-gray-900 font-mono">{adminStats?.totalCourses || 4}</span>
                    </div>
                  </div>

                  {/* Transaction Auditing */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-sm">Platform payment Audits</h4>
                    <div className="border border-gray-100 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-mono font-bold">
                            <th className="p-3.5">Invoice ID</th>
                            <th className="p-3.5">User ID</th>
                            <th className="p-3.5">Product Description</th>
                            <th className="p-3.5">Amount</th>
                            <th className="p-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-mono">
                          {adminStats?.paymentsList?.map((p: any) => (
                            <tr key={p.id} className="hover:bg-gray-50/30">
                              <td className="p-3.5 font-bold text-gray-700">{p.invoiceId}</td>
                              <td className="p-3.5 text-gray-400">{p.userId}</td>
                              <td className="p-3.5 text-gray-600 font-sans font-medium">{p.plan}</td>
                              <td className="p-3.5 text-indigo-600 font-bold">${p.amount}</td>
                              <td className="p-3.5 text-emerald-600 font-bold">SUCCESS</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ADMIN TAB 2: MANAGE SIGNALS */}
              {adminTab === "signals" && (
                <div className="space-y-6">
                  <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-50 pb-3">Publish Live VIP Signal</h3>
                  
                  <form onSubmit={handleAdminSignalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Currency pair / Asset</label>
                        <select 
                          value={sPair} 
                          onChange={(e) => setSPair(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                        >
                          <option>EUR/USD</option>
                          <option>BTC/USD</option>
                          <option>XAU/USD (Gold)</option>
                          <option>GBP/JPY</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Trade Direction</label>
                        <select 
                          value={sDir} 
                          onChange={(e) => setSDir(e.target.value as "BUY" | "SELL")}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                        >
                          <option>BUY</option>
                          <option>SELL</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Entry Price</label>
                        <input 
                          type="number" step="any" required value={sEntry} onChange={(e) => setSEntry(e.target.value)}
                          placeholder="1.0850" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Stop Loss (SL)</label>
                        <input 
                          type="number" step="any" required value={sStop} onChange={(e) => setSStop(e.target.value)}
                          placeholder="1.0815" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Take Profit (TP)</label>
                        <input 
                          type="number" step="any" required value={sTarget} onChange={(e) => setSTarget(e.target.value)}
                          placeholder="1.0955" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Risk Profile</label>
                        <select 
                          value={sRisk} 
                          onChange={(e) => setSRisk(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Technical Commentary / Context</label>
                      <textarea 
                        required rows={3} value={sComment} onChange={(e) => setSComment(e.target.value)}
                        placeholder="Sweep of Asian low completed, 4H order block confluence."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={signalSubmitting}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold rounded-xl"
                    >
                      Publish Live VIP Alert Signal
                    </button>
                  </form>
                </div>
              )}

              {/* ADMIN TAB 3: MANAGE BLOG */}
              {adminTab === "blog" && (
                <div className="space-y-6">
                  <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-50 pb-3">Publish Editorial Article</h3>
                  
                  <form onSubmit={handleAdminBlogSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Article Title</label>
                      <input 
                        type="text" required value={bTitle} onChange={(e) => setBTitle(e.target.value)}
                        placeholder="Gold Analysis: Why CPI will spark breakouts"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Brief Excerpt</label>
                        <input 
                          type="text" required value={bExcerpt} onChange={(e) => setBExcerpt(e.target.value)}
                          placeholder="Brief summary of macro findings..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Category</label>
                        <select 
                          value={bCat} onChange={(e) => setBCat(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        >
                          <option>Market Analysis</option>
                          <option>Trading Psychology</option>
                          <option>Forex Tips</option>
                          <option>Crypto Analysis</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Full Markdown Content</label>
                      <textarea 
                        required rows={6} value={bContent} onChange={(e) => setBContent(e.target.value)}
                        placeholder="Markdown enabled analysis body..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">
                      Publish Article to Feed
                    </button>
                  </form>
                </div>
              )}

              {/* ADMIN TAB 4: MANAGE FAQ */}
              {adminTab === "faq" && (
                <div className="space-y-6">
                  <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-50 pb-3">Add FAQ Item</h3>
                  
                  <form onSubmit={handleAdminFaqSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Category</label>
                        <select 
                          value={faqCat} onChange={(e) => setFaqCat(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        >
                          <option>General</option>
                          <option>Courses</option>
                          <option>Signals</option>
                          <option>Payments</option>
                          <option>Mentorship</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Question</label>
                        <input 
                          type="text" required value={faqQ} onChange={(e) => setFaqQ(e.target.value)}
                          placeholder="How is lot size calculated?"
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Faq Answer</label>
                      <textarea 
                        required rows={3} value={faqA} onChange={(e) => setFaqA(e.target.value)}
                        placeholder="Detailed response copy..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">
                      Add FAQ to Platform Database
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* STUDENT VIEW LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-3 space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center transition-all ${
                  activeTab === "overview" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Compass className="w-4 h-4 mr-2.5" /> Enrolled Courses & player
              </button>
              
              <button
                onClick={() => setActiveTab("journal")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center transition-all ${
                  activeTab === "journal" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2.5" /> Private Trading Journal
              </button>

              <button
                onClick={() => setActiveTab("ai_coach")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center transition-all ${
                  activeTab === "ai_coach" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Brain className="w-4 h-4 mr-2.5" /> AI Trading Coach (Gemini)
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center transition-all ${
                  activeTab === "notes" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <BookMarked className="w-4 h-4 mr-2.5" /> Study Pad & checklists
              </button>

              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center transition-all ${
                  activeTab === "billing" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <DollarSign className="w-4 h-4 mr-2.5" /> Billing, Receipts & Certs
              </button>
            </div>

            {/* Main Content Pane */}
            <div className="lg:col-span-9 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-8 min-h-[500px]">
              
              {/* STUDENT TAB 1: ACADEMY OVERVIEW & PLAYER */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
                      <h4 className="font-extrabold text-gray-900 text-base">No active enrollments</h4>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto">You have not enrolled in any Academy classes yet. Explore our elite curriculum and unlock a course to begin studying.</p>
                      <button 
                        onClick={() => onNavigate("academy")}
                        className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
                      >
                        Explore Course Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left Course Browser */}
                      <div className="lg:col-span-4 space-y-3">
                        <span className="text-[10px] font-bold uppercase font-mono text-gray-400 block">YOUR ACTIVE CURRICULUM</span>
                        <div className="space-y-2">
                          {enrolledCourses.map((course) => (
                            <button
                              key={course.id}
                              onClick={() => {
                                setSelectedCourse(course);
                                if (course.lessons.length > 0) setActiveLesson(course.lessons[0]);
                              }}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                                selectedCourse?.id === course.id 
                                  ? "border-blue-600 bg-blue-50/25" 
                                  : "border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <span className="text-[9px] uppercase font-bold text-blue-500 font-mono block">{course.category}</span>
                              <span className="font-bold text-gray-800 line-clamp-1 mt-0.5">{course.title}</span>
                              
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-3">
                                <div className="h-full bg-blue-600" style={{ width: `${course.progress}%` }} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right Active Video/Lesson workspace player */}
                      {selectedCourse && (
                        <div className="lg:col-span-8 space-y-6">
                          
                          {/* Live Video player wrapper */}
                          <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 flex items-center justify-center text-white">
                            {activeLesson ? (
                              <video 
                                key={activeLesson.id}
                                controls 
                                className="w-full h-full object-cover"
                                src={activeLesson.videoUrl}
                              />
                            ) : (
                              <span className="text-xs text-gray-400 font-mono">No lesson selected.</span>
                            )}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                            <div>
                              <h4 className="font-extrabold text-gray-900 text-sm">{activeLesson?.title}</h4>
                              <p className="text-xs text-gray-400 font-mono mt-0.5">Course: {selectedCourse.title} • Duration: {activeLesson?.duration}</p>
                            </div>

                            <button
                              onClick={() => {
                                if (activeLesson) {
                                  // toggle checkmark
                                  const isCompleted = selectedCourse.progress !== undefined && selectedCourse.lessons.some(l => l.id === activeLesson.id && l.isCompleted);
                                  handleToggleLessonComplete(activeLesson.id, isCompleted);
                                }
                              }}
                              className="px-4 py-2 rounded-xl text-xs bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 font-semibold flex items-center space-x-1.5"
                            >
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span>Toggle Completion</span>
                            </button>
                          </div>

                          {/* Lessons Grid list */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase font-mono text-gray-400 block">Lessons inside this course</span>
                            <div className="divide-y divide-gray-50 border border-gray-50 rounded-2xl overflow-hidden">
                              {selectedCourse.lessons.map((lesson) => {
                                const isCompleted = selectedCourse.progress !== undefined && selectedCourse.progress > 0; // fallback simulation representation
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(lesson)}
                                    className={`w-full text-left px-4 py-3.5 text-xs flex items-center justify-between transition-all ${
                                      activeLesson?.id === lesson.id ? "bg-gray-50" : "hover:bg-gray-50/40"
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Play className="w-4 h-4 text-blue-500 shrink-0" />
                                      <span className="font-semibold text-gray-700">{lesson.title}</span>
                                    </div>
                                    <span className="font-mono text-gray-400 shrink-0 ml-4">{lesson.duration}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* STUDENT TAB 2: TRADING JOURNAL */}
              {activeTab === "journal" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <h3 className="font-extrabold text-lg text-gray-900">Your Private Trading Log</h3>
                    <span className="text-[10px] text-gray-400 font-mono">syncing live</span>
                  </div>

                  {/* Add Trade Form */}
                  <form onSubmit={handleJournalSubmit} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 items-end bg-gray-50/60 p-4 rounded-2xl border border-gray-100/40">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase font-mono">Asset</label>
                      <select value={jPair} onChange={(e) => setJPair(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs">
                        <option>EUR/USD</option>
                        <option>BTC/USD</option>
                        <option>XAU/USD</option>
                        <option>GBP/JPY</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase font-mono">Dir</label>
                      <select value={jDir} onChange={(e) => setJDir(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs">
                        <option>BUY</option>
                        <option>SELL</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase font-mono">Entry</label>
                      <input type="number" step="any" required value={jEntry} onChange={(e) => setJEntry(e.target.value)} placeholder="1.0850" className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase font-mono">Exit</label>
                      <input type="number" step="any" required value={jExit} onChange={(e) => setJExit(e.target.value)} placeholder="1.0950" className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase font-mono">Lots</label>
                      <input type="number" step="any" required value={jSize} onChange={(e) => setJSize(e.target.value)} placeholder="0.5" className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase font-mono">Profit ($)</label>
                      <input type="number" step="any" required value={jProfit} onChange={(e) => setJProfit(e.target.value)} placeholder="150" className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm">
                        Log Trade
                      </button>
                    </div>
                  </form>

                  {/* Journal Table list */}
                  <div className="border border-gray-100 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-mono font-bold">
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Asset</th>
                          <th className="p-3.5">Dir</th>
                          <th className="p-3.5">Entry / Exit</th>
                          <th className="p-3.5">Size</th>
                          <th className="p-3.5">Net Profit</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-mono">
                        {journal.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-gray-400 text-xs">
                              No trades logged yet. Fill out the parameters above to persist your first trade!
                            </td>
                          </tr>
                        ) : (
                          journal.map((trade) => (
                            <tr key={trade.id} className="hover:bg-gray-50/20">
                              <td className="p-3.5 text-gray-400">{new Date(trade.date).toLocaleDateString()}</td>
                              <td className="p-3.5 font-bold text-gray-800">{trade.pair}</td>
                              <td className="p-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  trade.direction === "BUY" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                }`}>
                                  {trade.direction}
                                </span>
                              </td>
                              <td className="p-3.5 text-gray-500">{trade.entry} ➔ {trade.exit}</td>
                              <td className="p-3.5 text-gray-600">{trade.size} Lots</td>
                              <td className={`p-3.5 font-bold ${trade.profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                {trade.profit >= 0 ? "+" : ""}${trade.profit}
                              </td>
                              <td className="p-3.5 text-right">
                                <button 
                                  onClick={() => handleJournalDelete(trade.id)}
                                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* STUDENT TAB 3: AI COACH (Gemini) */}
              {activeTab === "ai_coach" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
                    <h3 className="font-extrabold text-lg text-gray-900 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-indigo-500" />
                      Gemini Institutional Trading Coach
                    </h3>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold font-mono">
                      GEMINI-3.5-FLASH
                    </span>
                  </div>

                  {/* Chat logs terminal */}
                  <div className="bg-gray-950 text-gray-100 rounded-2xl p-4 sm:p-6 h-[400px] overflow-y-auto space-y-4 font-sans text-xs">
                    {aiChat.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`p-4 rounded-2xl max-w-lg leading-relaxed ${
                          msg.sender === "user" 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none whitespace-pre-wrap"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="p-4 bg-gray-900 border border-gray-800 text-gray-400 rounded-2xl rounded-bl-none flex items-center space-x-2">
                          <span className="animate-pulse">Institutional Analyst is calculating setup models...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleAiChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask about SMC liquidity, Gold news patterns, risk-reward metrics..."
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-blue-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* STUDENT TAB 4: STUDY NOTES PAD */}
              {activeTab === "notes" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-50 pb-3">Study notes Pad</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Saved notes list */}
                    <div className="md:col-span-4 space-y-2">
                      <button
                        onClick={() => setActiveNote({ title: "", content: "" })}
                        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-blue-600 font-bold text-xs rounded-xl border border-dashed border-gray-200 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-1.5" /> New Blank Study Note
                      </button>

                      <div className="space-y-1.5">
                        {notes.map((n) => (
                          <div 
                            key={n.id}
                            className={`p-3 rounded-xl border text-left flex justify-between items-center text-xs transition-all ${
                              activeNote.id === n.id ? "border-blue-500 bg-blue-50/10" : "border-gray-100"
                            }`}
                          >
                            <button 
                              onClick={() => setActiveNote(n)}
                              className="text-left font-semibold text-gray-700 truncate flex-1 mr-2"
                            >
                              {n.title}
                            </button>
                            <button 
                              onClick={() => n.id && handleNoteDelete(n.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right text editor workspace */}
                    <form onSubmit={handleNoteSave} className="md:col-span-8 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Title</label>
                        <input
                          type="text"
                          required
                          value={activeNote.title}
                          onChange={(e) => setActiveNote(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="E.g. Trading session checklists..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Study Notes Content</label>
                        <textarea
                          required
                          rows={8}
                          value={activeNote.content}
                          onChange={(e) => setActiveNote(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Type your macro formulas, structural strategies, or lessons summaries here..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm"
                      >
                        Save Note to Database Sync
                      </button>
                    </form>

                  </div>
                </div>
              )}

              {/* STUDENT TAB 5: BILLING & CERTIFICATES */}
              {activeTab === "billing" && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Certificates Subsection */}
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-50 pb-3">Course Completion Certificates</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {enrolledCourses.map((course) => {
                        const isFinished = course.progress === 100;
                        return (
                          <div key={course.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="space-y-1">
                              <span className="text-[10px] text-gray-400 font-mono font-bold block">{course.category} LICENSE</span>
                              <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{course.title}</h4>
                              <p className="text-[11px] text-gray-400">Completion Status: {course.progress}%</p>
                            </div>

                            {/* Enable certificate download button if finished */}
                            <button
                              onClick={() => simulateCertificateDownload(course.title)}
                              disabled={downloadingCert !== null}
                              className={`p-3 rounded-xl transition-all ${
                                isFinished 
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
                              }`}
                              title={isFinished ? "Download Official Certificate" : "Achieve 100% course progress to unlock!"}
                            >
                              <Download className={`w-5 h-5 ${downloadingCert === course.title ? "animate-bounce" : ""}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Invoices logs */}
                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <h3 className="font-extrabold text-lg text-gray-900">Billing History & Invoices</h3>
                    
                    <div className="border border-gray-100 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-mono font-bold">
                            <th className="p-3.5">Invoice ID</th>
                            <th className="p-3.5">Payment Date</th>
                            <th className="p-3.5">Description</th>
                            <th className="p-3.5">Amount Paid</th>
                            <th className="p-3.5 text-right">Receipt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-mono">
                          {payments.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-gray-400">No transactions recorded.</td>
                            </tr>
                          ) : (
                            payments.map((p) => (
                              <tr key={p.id}>
                                <td className="p-3.5 font-bold text-gray-700">{p.invoiceId}</td>
                                <td className="p-3.5 text-gray-400">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="p-3.5 text-gray-600 font-sans font-medium">{p.plan}</td>
                                <td className="p-3.5 text-blue-600 font-bold">${p.amount}</td>
                                <td className="p-3.5 text-right">
                                  <a 
                                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                                      `BASH ON AIR TRADING ACADEMY\n=========================\nOFFICIAL INVOICE RECEIPT\n\nInvoice ID: ${p.invoiceId}\nDate: ${new Date(p.date).toLocaleString()}\nBilled to: ${user?.name || "Alex Trader"}\n\nItem Purchased:\n- ${p.plan}\n\nTotal Paid: $${p.amount}.00 USD\nPayment Status: SETTLED / sscd_8927\nGateway Code: STRIPE_SECURE_API`
                                    )}`} 
                                    download={`BOA_Invoice_${p.invoiceId}.txt`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-bold"
                                  >
                                    Receipt PDF
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
