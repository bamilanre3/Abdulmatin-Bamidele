/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Tv, 
  Bell, 
  ShieldCheck, 
  Award,
  ArrowRight,
  Target
} from "lucide-react";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CoursesView from "./components/CoursesView";
import SignalsView from "./components/SignalsView";
import MentorshipView from "./components/MentorshipView";
import BlogView from "./components/BlogView";
import ContactView from "./components/ContactView";
import DashboardView from "./components/DashboardView";
import AuthView from "./components/AuthView";
import PricingView from "./components/PricingView";
import CommunityView from "./components/CommunityView";

import { Course, TradingSignal, FAQItem, User, UserRole } from "./types";

export default function App() {
  const [route, setRoute] = useState<string>("home");
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean }[]>([]);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Load Session on mount
  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          return;
        }
      }
    } catch (e) {
      console.error("Session fetch failed:", e);
    }
    setUser(null);
  };

  const fetchCourses = async () => {
    try {
      const query = user ? `?userId=${user.id}` : "";
      const res = await fetch(`/api/courses${query}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSignals = async () => {
    try {
      const res = await fetch("/api/signals");
      if (res.ok) {
        const data = await res.json();
        setSignals(data);

        // Build notifications for header bell from active signals
        const active = data.filter((s: TradingSignal) => s.status === "ACTIVE");
        const notifyList = active.map((s: TradingSignal) => ({
          id: s.id,
          text: `🚨 New Signal: ${s.direction} ${s.pair} Entry at ${s.entry}`,
          time: new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false
        }));
        setNotifications(notifyList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkSession();
    fetchSignals();
    fetchFaqs();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setShowAuthModal(false);
    fetchCourses();
    
    // Add dynamic notification
    const welcomeAlert = {
      id: "welcome-alert",
      text: `🎉 Welcome back, ${authenticatedUser.name}! Session Synced.`,
      time: "Just Now",
      read: false
    };
    setNotifications(prev => [welcomeAlert, ...prev]);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setRoute("home");
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleToggle = async () => {
    if (!user) return;
    const targetRole = user.role === UserRole.STUDENT ? UserRole.ADMIN : UserRole.STUDENT;
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setRoute("dashboard"); // bounce back to dashboard to see role changes!
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    fetchCourses(); // reload courses enrollment status
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="bg-[#FAFBFF] text-slate-900 min-h-screen flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] opacity-30 pointer-events-none z-0" />
      
      {/* Navigation Header */}
      <Header 
        user={user}
        notifications={notifications}
        activeRoute={route}
        onNavigate={setRoute}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onRoleToggle={handleRoleToggle}
      />

      {/* Main Routed Area */}
      <main className="flex-grow pt-16">
        
        {route === "home" && (
          <div className="animate-fade-in space-y-24">
            
            {/* Landing Hero */}
            <Hero 
              onNavigate={setRoute}
              onOpenRegister={() => setShowAuthModal(true)}
            />

            {/* Bottom Feature Bar */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8 sm:-mt-12">
              <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 bg-blue-50 p-2.5 rounded-xl"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Expert Signals</h4>
                  <p className="text-xs text-slate-500 mt-1">High-accuracy market calls.</p>
                </div>
              </div>
              <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 bg-blue-50 p-2.5 rounded-xl"><BookOpen className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Master Courses</h4>
                  <p className="text-xs text-slate-500 mt-1">From basics to SMC concepts.</p>
                </div>
              </div>
              <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 bg-blue-50 p-2.5 rounded-xl"><Tv className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Live Sessions</h4>
                  <p className="text-xs text-slate-500 mt-1">Daily London & NY analysis.</p>
                </div>
              </div>
              <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 bg-blue-50 p-2.5 rounded-xl"><Users className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Mentorship</h4>
                  <p className="text-xs text-slate-500 mt-1">1-on-1 performance coaching.</p>
                </div>
              </div>
            </div>

            {/* Bento Grid Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-14">
                <span className="text-xs uppercase font-extrabold text-blue-600 font-mono tracking-wider">PLATFORM CAPABILITIES</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans">
                  The BOA Ecosystem Advantage
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm">
                  We bridge the gap between retail confusion and institutional performance. Explore our major functional pillars.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* SMC Block */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between h-[300px]">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Institutional SMC Mastery</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Learn to decipher order block manipulations, Fair Value Gap (FVG) sweeps, liquidity grabs, and stop hunts executed by central algorithms.
                    </p>
                  </div>
                  <button 
                    onClick={() => setRoute("academy")}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center group"
                  >
                    Explore Courses
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* VIP Signals */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between h-[300px]">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">High-Winrate Signal Stream</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Receive real-time high-probability entry targets, strict stop losses, and multi-tier take profit checkpoints formulated by elite traders.
                    </p>
                  </div>
                  <button 
                    onClick={() => setRoute("signals")}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center group"
                  >
                    View Live Alerts
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Live Webinars */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between h-[300px]">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Tv className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Live Virtual Classes</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Attend daily interactive charting webinars. Interact directly with mentors, submit screenshots, and get direct real-time setups reviewed.
                    </p>
                  </div>
                  <button 
                    onClick={() => setRoute("mentorship")}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center group"
                  >
                    Book Mentorship
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-transparent py-16 border-y border-blue-50/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center space-y-4 mb-14">
                  <span className="text-xs uppercase font-extrabold text-blue-600 font-mono tracking-wider">AFFORDABLE EXCELLENCE</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                    Transparent SaaS Pricing Plans
                  </h2>
                  <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm">
                    Unlock institutional strategies with zero hidden fees. Select the pass that aligns with your funded expectations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  
                  {/* Free Plan */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-200/60 flex flex-col justify-between h-[420px] shadow-sm">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-gray-400 font-mono block">STARTER KIT</span>
                        <h3 className="text-xl font-bold text-gray-900">Community Pass</h3>
                        <div className="text-3xl font-extrabold text-gray-900 font-mono">₦0 <span className="text-xs font-normal text-gray-400">/ forever</span></div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Perfect for beginners exploring Forex principles and standard support-resistance models.</p>
                      <ul className="text-xs text-gray-600 space-y-2.5 font-sans font-medium">
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0" /> Free Intro Lessons</li>
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0" /> Standard Community Chat</li>
                        <li className="flex items-center text-gray-400"><CheckCircle2 className="w-4 h-4 mr-2 text-gray-200 shrink-0" /> Locked VIP Signals</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setRoute("community")}
                      className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
                    >
                      Access Community
                    </button>
                  </div>

                  {/* Academy Classes Plan */}
                  <div className="bg-white p-8 rounded-3xl border-2 border-blue-500 flex flex-col justify-between h-[420px] relative shadow-md">
                    <span className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] font-bold tracking-wider font-mono px-2 py-0.5 rounded-full">POPULAR CHOICE</span>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-blue-600 font-mono block">SMC PROFESSIONAL</span>
                        <h3 className="text-xl font-bold text-gray-900">Academy Core</h3>
                        <div className="text-3xl font-extrabold text-gray-900 font-mono">₦150,000 <span className="text-xs font-normal text-gray-400">/ class</span></div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Full lifetime access to a selected elite class, course certificates, and interactive lessons player.</p>
                      <ul className="text-xs text-gray-600 space-y-2.5 font-sans font-medium">
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0" /> Lifetime Selected Course</li>
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0" /> Official BOA Certificates</li>
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0" /> Personal Trade Log Audits</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setRoute("academy")}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      Explore Courses
                    </button>
                  </div>

                  {/* Signals Membership Plan */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-200/60 flex flex-col justify-between h-[420px] shadow-sm">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-indigo-500 font-mono block">PRO ACCURACY</span>
                        <h3 className="text-xl font-bold text-gray-900">VIP Signals Monthly</h3>
                        <div className="text-3xl font-extrabold text-gray-900 font-mono">₦75,000 <span className="text-xs font-normal text-gray-400">/ month</span></div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">Unlock complete active and historical setups with instant push alerts straight to Telegram/SMS.</p>
                      <ul className="text-xs text-gray-600 space-y-2.5 font-sans font-medium">
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0" /> Unrestricted Live Signals</li>
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0" /> Instant Push Telegram Alerts</li>
                        <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500 shrink-0" /> SMC Macro Breakdown Charts</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setRoute("signals")}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      Subscribe VIP Signals
                    </button>
                  </div>

                </div>

              </div>
            </section>

            {/* Testimonials Block */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-14">
                <span className="text-xs uppercase font-extrabold text-blue-600 font-mono tracking-wider">VERIFIED SUCCESS STORIES</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                  What Our Funded Students Say
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm">
                  Over 15,000+ students globally have traded, mastered SMC strategies, and passed prop firm tests with us.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Testimonial 1 */}
                <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between h-[220px]">
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    "Passed my $200K FTMO Challenge within 3 weeks of taking Coach Bash's SMC masterclass. The order block confirmation setups are incredibly reliable."
                  </p>
                  <div className="flex items-center space-x-3.5 border-t border-gray-50 pt-4 mt-4">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Michael S." className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-gray-800 text-xs block">Michael S.</span>
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">+$12,400 FTMO PAYOUT CERTIFIED</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between h-[220px]">
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    "The VIP signals are outstanding. Most channels offer weak setups with no context, but BOA provides complete institutional macro charts and risk guidelines."
                  </p>
                  <div className="flex items-center space-x-3.5 border-t border-gray-50 pt-4 mt-4">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Sarah L." className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-gray-800 text-xs block">Sarah L.</span>
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">+$8,950 FUNDED EARNINGS</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between h-[220px]">
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    "Booking a private 1-on-1 AMA live session with Coach Air changed my perspective. We audited my 10 consecutive losses and discovered critical structural errors."
                  </p>
                  <div className="flex items-center space-x-3.5 border-t border-gray-50 pt-4 mt-4">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Alex K." className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-gray-800 text-xs block">Alex K.</span>
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">SECURED $100K FUNDED SLOTS</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Dynamic Accordion FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="text-center space-y-4 mb-14">
                <span className="text-xs uppercase font-extrabold text-blue-600 font-mono tracking-wider">CLEAR REPLIES</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm">
                  Have questions about certificates, billing, or technical trading definitions? We are here to clarify.
                </p>
              </div>

              <div className="space-y-4.5">
                {faqs.length === 0 ? (
                  <div className="text-center text-gray-400 font-mono text-xs">Loading answers database...</div>
                ) : (
                  faqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div 
                        key={faq.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-xs sm:text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex items-center">
                            <HelpCircle className="w-4 h-4 mr-2.5 text-blue-500" /> {faq.question}
                          </span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50/50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>

          </div>
        )}

        {route === "academy" && (
          <CoursesView 
            user={user}
            courses={courses}
            onEnroll={handleEnroll}
            onNavigate={setRoute}
            onOpenLogin={() => setShowAuthModal(true)}
            fetchCourses={fetchCourses}
          />
        )}

        {route === "signals" && (
          <SignalsView 
            user={user}
            signals={signals}
            onOpenLogin={() => setShowAuthModal(true)}
            fetchSignals={fetchSignals}
          />
        )}

        {route === "mentorship" && (
          <MentorshipView 
            user={user}
            onOpenLogin={() => setShowAuthModal(true)}
            onNavigate={setRoute}
          />
        )}

        {route === "pricing" && (
          <PricingView 
            user={user}
            onOpenLogin={() => setShowAuthModal(true)}
            onNavigate={setRoute}
          />
        )}

        {route === "community" && (
          <CommunityView 
            user={user}
            onOpenLogin={() => setShowAuthModal(true)}
          />
        )}

        {route === "faq" && (
          <PricingView 
            user={user}
            onOpenLogin={() => setShowAuthModal(true)}
            onNavigate={setRoute}
          />
        )}

        {route === "blog" && (
          <BlogView 
            user={user}
            onOpenLogin={() => setShowAuthModal(true)}
          />
        )}

        {route === "contact" && (
          <ContactView />
        )}

        {route === "dashboard" && (
          <DashboardView 
            user={user}
            onOpenLogin={() => setShowAuthModal(true)}
            onNavigate={setRoute}
            fetchSignals={fetchSignals}
          />
        )}

      </main>

      {/* Footer Branding */}
      <Footer onNavigate={setRoute} />

    </div>
  );
}
