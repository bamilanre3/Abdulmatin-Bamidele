/**
 * Client-Side API Interceptor & Mock Database for Static Deployments (e.g. GitHub Pages)
 * Intercepts all window.fetch('/api/*') requests and fulfills them entirely in the browser using localStorage.
 */

import { UserRole } from "./types";

const memoryStorage: Record<string, string> = {};

const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete memoryStorage[key];
    }
  }
};

const IS_STATIC_HOST =
  window.location.hostname.includes("github.io") ||
  window.location.hostname.includes("vercel.app") ||
  window.location.hostname.includes("netlify.app") ||
  window.location.hostname.includes("pages.dev") ||
  (!["localhost", "127.0.0.1"].includes(window.location.hostname) && !window.location.hostname.includes(".run.app"));

const FORCE_MOCK =
  window.location.search.includes("mock=true") ||
  window.location.hash.includes("mock") ||
  safeLocalStorage.getItem("force_mock") === "true";

// Seed Database
const initialDB = {
  users: [
    {
      id: "usr_student",
      name: "Alex Trader",
      email: "student@bashonair.com",
      role: "student" as UserRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      bio: "Aspiring Forex and Crypto trader focused on Smart Money Concepts.",
      joinedDate: "2026-01-15T08:00:00Z"
    },
    {
      id: "usr_admin",
      name: "Coach Bash",
      email: "admin@bashonair.com",
      role: "admin" as UserRole,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bio: "Chief Trading Mentor at Bash On Air. 10+ years of institutional trading experience.",
      joinedDate: "2025-06-01T08:00:00Z"
    }
  ],
  courses: [
    {
      id: "course_forex_beginners",
      title: "Complete Forex Beginner's Masterclass",
      description: "Learn the absolute fundamentals of the foreign exchange market. Understand currency pairs, market sessions, candlestick anatomy, brokers, leverage, and basic technical analysis.",
      instructor: "Coach Bash",
      lessons: [
        { id: "l1", title: "Introduction to Forex & Market Structures", duration: "12:15", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l2", title: "Understanding Pips, Lots, and Leverage", duration: "18:40", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l3", title: "Setting Up MetaTrader & Charting", duration: "15:20", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l4", title: "Basic Support and Resistance Theory", duration: "22:10", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l5", title: "Your First Trading Strategy Demo", duration: "25:35", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false }
      ],
      duration: "1h 34m",
      level: "Beginner",
      rating: 4.8,
      price: 150000,
      category: "Forex",
      enrolledCount: 1420
    },
    {
      id: "course_smc_pro",
      title: "Smart Money Concepts & Order Blocks",
      description: "Dive deep into how commercial institutions trade. Understand market structure shifts, liquidity sweeps, fair value gaps, mitigation zones, and high-probability order blocks.",
      instructor: "Coach Bash",
      lessons: [
        { id: "l1_smc", title: "Market Structure: MS, BOS, and CHoCH", duration: "25:10", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l2_smc", title: "Identifying Valid Order Blocks & Breakers", duration: "20:45", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l3_smc", title: "Fair Value Gaps (FVG) & Liquidity Pools", duration: "30:15", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l4_smc", title: "Premium vs Discount Pricing Matrix", duration: "18:50", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l5_smc", title: "SMC High-Winrate Setup Case Studies", duration: "35:12", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false }
      ],
      duration: "2h 10m",
      level: "Advanced",
      rating: 4.95,
      price: 350000,
      category: "Smart Money Concepts",
      enrolledCount: 890
    },
    {
      id: "course_crypto_defi",
      title: "Crypto Trading, DeFi & On-Chain Analysis",
      description: "Navigate the highly volatile cryptocurrency markets. Master spot trading, leverage futures, decipher on-chain metrics, track smart wallets, and structure long-term growth portfolios.",
      instructor: "Coach Air",
      lessons: [
        { id: "l1_crypto", title: "The Bitcoin Cycle & Halving Economics", duration: "15:40", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l2_crypto", title: "Trading Futures & Perps Responsibly", duration: "22:15", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l3_crypto", title: "On-Chain Tools: Glassnode & Etherscan", duration: "28:30", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l4_crypto", title: "DeFi Yield Farming & Risk Management", duration: "20:10", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false }
      ],
      duration: "1h 26m",
      level: "Intermediate",
      rating: 4.7,
      price: 225000,
      category: "Crypto",
      enrolledCount: 1120
    },
    {
      id: "course_risk_management",
      title: "Advanced Risk & Professional Capital Management",
      description: "The most important course you will ever take. Learn mathematical sizing models, risk-to-reward metrics, portfolio preservation rules, drawdowns survival, and psychological trading bias hacks.",
      instructor: "Coach Air",
      lessons: [
        { id: "l1_risk", title: "The Math Behind the 1% Sizing Rule", duration: "14:20", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l2_risk", title: "Understanding Expectancy & R-Multiple", duration: "19:15", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l3_risk", title: "How to Keep Your Account Funding", duration: "25:40", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false },
        { id: "l4_risk", title: "Trading Journal: The Ultimate Catalyst", duration: "16:10", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isLocked: false }
      ],
      duration: "1h 15m",
      level: "Intermediate",
      rating: 4.9,
      price: 180000,
      category: "Risk Management",
      enrolledCount: 2150
    }
  ],
  enrollments: [
    { id: "enr_1", userId: "usr_student", courseId: "course_forex_beginners", progress: 60, completedLessons: ["l1", "l2", "l3"] }
  ],
  signals: [
    {
      id: "sig_1",
      pair: "EUR/USD",
      entry: 1.0850,
      stopLoss: 1.0815,
      takeProfit: 1.0955,
      risk: "Medium",
      direction: "BUY",
      status: "ACTIVE",
      winRate: 88,
      timestamp: "2026-07-13T07:15:00Z",
      comment: "Sweep of London session lows completed. Targetting the 4H Fair Value Gap."
    },
    {
      id: "sig_2",
      pair: "BTC/USD",
      entry: 89650,
      stopLoss: 90200,
      takeProfit: 87500,
      risk: "High",
      direction: "SELL",
      status: "HIT TP",
      winRate: 92,
      timestamp: "2026-07-12T14:20:00Z",
      comment: "Double top at psychological 90k resistance level on 1H chart with institutional divergence."
    },
    {
      id: "sig_3",
      pair: "XAU/USD (Gold)",
      entry: 2345.5,
      stopLoss: 2351.0,
      takeProfit: 2325.0,
      risk: "Medium",
      direction: "SELL",
      status: "ACTIVE",
      winRate: 84,
      timestamp: "2026-07-13T06:30:00Z",
      comment: "Testing the hourly supply zone. Expecting bearish reversal targeting Daily Order block."
    },
    {
      id: "sig_4",
      pair: "US30",
      entry: 39150,
      stopLoss: 39020,
      takeProfit: 39450,
      risk: "Medium",
      direction: "BUY",
      status: "CLOSED",
      winRate: 85,
      timestamp: "2026-07-11T12:00:00Z",
      comment: "Broke above consolidation. Secured +300 pips. Manual exit recommended."
    }
  ],
  mentorshipSlots: [
    { id: "slot_1", mentorName: "Coach Bash", date: "2026-07-15", time: "10:00 AM UTC", status: "available", topic: "SMC structure review" },
    { id: "slot_2", mentorName: "Coach Bash", date: "2026-07-15", time: "2:00 PM UTC", status: "booked", topic: "Forex Basics 1-on-1" },
    { id: "slot_3", mentorName: "Coach Air", date: "2026-07-16", time: "11:00 AM UTC", status: "available", topic: "Crypto Futures Risk Sizing" },
    { id: "slot_4", mentorName: "Coach Air", date: "2026-07-16", time: "4:00 PM UTC", status: "available", topic: "Trading Psychology Audit" }
  ],
  blogPosts: [
    {
      id: "blog_1",
      title: "The Psychology of a Winning Trader",
      excerpt: "Why is it that two traders with the exact same blueprint can have completely opposite results? Let's dive deep into risk aversion, greed, and trading discipline.",
      content: `The hard truth of professional trading is that your emotional state will make or break your account balance. You can have a 90% accurate system, but if you panic during drawdowns or double down on losing positions out of revenge, your account will bleed to zero.\n\n### 1. The Revenge Trading Trap\nWhen you take a loss, your brain registers it as a personal attack. The automatic reaction is to strike back—by opening a larger size trade without setup confirmation. This is called revenge trading. \nTo beat this:\n- Accept that losses are a regular operating cost of running a business.\n- Walk away from your computer screens for at least 1 hour after any consecutive losses.\n\n### 2. FOMO (Fear Of Missing Out)\nSeeing a currency pair breakout and buying the top because you feel left behind is the easiest way to buy institutional supply. Professional traders wait for pullbacks into high-probability demand blocks. If the market goes without them, they happily let it go. There are always more trades.\n\n### 3. Master the R-Multiple\nTreat trading like statistical risk rather than a get-rich-quick gamble. Focus strictly on taking setups that provide at least a 1:3 Risk-to-Reward ratio. That way, you only need to be right 30% of the time to remain fully profitable over the long term.`,
      author: "Coach Bash",
      date: "2026-07-10T10:00:00Z",
      category: "Trading Psychology",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600",
      views: 520,
      likes: 42,
      comments: [
        { id: "c1", author: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", text: "This article saved my account today. I was about to revenge trade GBPUSD!", date: "2026-07-10T12:40:00Z" }
      ]
    },
    {
      id: "blog_2",
      title: "Trading Position Sizing: How to Survive High Volatility",
      excerpt: "If you don't know the exact dollar risk of your position before pressing buy or sell, you are gambling. Master the mathematical sizing formula used by hedge fund managers.",
      content: `Let's break down the exact mathematical formula that keeps institutional desks safe during high volatility news events like the NFP, CPI, and FOMC speeches.\n\n### The Professional Sizing Formula:\n\`Position Size = (Account Balance * Risk Percentage) / (Stop Loss in Pips * Pip Value)\`\n\nFor example:\n- Account Balance: $10,000\n- Maximum Risk: 1% ($100)\n- Stop Loss: 20 Pips on EURUSD\n- Pip Value: $10 per standard lot\n\nWith this formula, your standard lot sizing will be exactly \`100 / (20 * 10) = 0.5 Lots\`.\nThis guarantees that even if your trade is invalidated and hits your stop loss, your capital loss is strictly capped at $100.\n\nNever adjust your stop loss to fit your lot size; always adjust your lot size to fit your stop loss.`,
      author: "Coach Air",
      date: "2026-07-08T09:15:00Z",
      category: "Forex Tips",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600",
      views: 310,
      likes: 28,
      comments: []
    }
  ],
  faqs: [
    { id: "faq_1", question: "Is Bash On Air a trading broker or exchange?", answer: "No. Bash On Air is strictly an educational platform. We do not accept deposits for trading, execute trades on your behalf, or act as a brokerage. We provide signals, mentorship, and courses to help you trade independently.", category: "General" },
    { id: "faq_2", question: "How do I receive the Real-Time VIP Trading Signals?", answer: "Signals are instantly pushed to the Signals section of your Student Dashboard. We also provide a real-time webhook sync to our private VIP Discord and Telegram alerts channels so you never miss an entry.", category: "Signals" },
    { id: "faq_3", question: "What is your refund policy for Course Enrollments & VIP Subscriptions?", answer: "We offer a 14-day money-back guarantee if you haven't watched more than 20% of the course. VIP Signals subscriptions can be cancelled at any time to avoid renewal billing.", category: "Payments" },
    { id: "faq_4", question: "How do live interactive trading classes work?", answer: "Live sessions occur inside the Academy tab. Users can click 'Join Meeting' to open our live embedded broadcast where they can interact directly with mentors in real-time, ask questions, and follow live charts.", category: "Courses" }
  ],
  journalEntries: [
    { id: "j_1", date: "2026-07-10T15:30:00Z", pair: "EUR/USD", direction: "BUY", entry: 1.0820, exit: 1.0865, size: 0.5, profit: 225, notes: "Followed the 15m order block. High probability setup. Managed risk well." },
    { id: "j_2", date: "2026-07-12T10:15:00Z", pair: "BTC/USD", direction: "SELL", entry: 90100, exit: 90600, size: 0.1, profit: -50, notes: "Stop loss swept before reversing. Need to place stop loss above liquidity level next time." }
  ],
  payments: [
    { id: "pay_1", userId: "usr_student", amount: 99, currency: "USD", status: "succeeded", plan: "Complete Forex Beginner's Masterclass", date: "2026-07-10T12:00:00Z", invoiceId: "INV-8927" }
  ],
  notifications: [
    { id: "n_1", title: "New EUR/USD Signal Alert", message: "A new Buy Setup for EUR/USD has been posted with entry 1.0850. Review targets now.", date: "2026-07-13T07:16:00Z", type: "signal", read: false },
    { id: "n_2", title: "Live SMC Trading Webinar", message: "Webinar 'Smart Money Concepts AMA' is starting in 30 minutes. Secure your seat.", date: "2026-07-13T08:00:00Z", type: "live", read: true }
  ],
  tradingNotes: [
    { id: "note_1", title: "SMC Entry Checklist", content: "1. 4H Trend direction check\n2. 15m Liquidity grab\n3. CHoCH structure shift confirmed\n4. Premium/Discount validation\n5. Limit orders set on 50% FVG zone." }
  ]
};

// Helper to load db from localStorage
function getLocalDB() {
  const dbStr = safeLocalStorage.getItem("trading_db");
  if (!dbStr) {
    safeLocalStorage.setItem("trading_db", JSON.stringify(initialDB));
    return initialDB;
  }
  try {
    const db = JSON.parse(dbStr);
    // Ensure all keys are initialized
    let changed = false;
    for (const key of Object.keys(initialDB) as Array<keyof typeof initialDB>) {
      if (!db[key] || !Array.isArray(db[key])) {
        db[key] = [...initialDB[key]] as any;
        changed = true;
      }
    }
    if (changed) {
      safeLocalStorage.setItem("trading_db", JSON.stringify(db));
    }
    return db;
  } catch (e) {
    safeLocalStorage.setItem("trading_db", JSON.stringify(initialDB));
    return initialDB;
  }
}

// Helper to save db to localStorage
function saveLocalDB(db: any) {
  safeLocalStorage.setItem("trading_db", JSON.stringify(db));
}

// Track active session user ID in localStorage
function getSessionUserId() {
  let userId = safeLocalStorage.getItem("session_user_id");
  if (!userId) {
    userId = "usr_student"; // default session user
    safeLocalStorage.setItem("session_user_id", userId);
  }
  return userId;
}

// Register Mock Fetch Interceptor
if (IS_STATIC_HOST || FORCE_MOCK) {
  console.log("%c[Mock API] Intercepting all /api/* network requests...", "color: #10B981; font-weight: bold;");

  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (!url.includes("/api/")) {
      return originalFetch(input, init);
    }

    // Parse path and query parameters
    const parsedUrl = new URL(url, window.location.origin);
    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;
    const method = (init?.method || "GET").toUpperCase();

    // Read request body safely
    let body: any = {};
    if (init?.body && typeof init.body === "string") {
      try {
        body = JSON.parse(init.body);
      } catch (e) {
        body = {};
      }
    }

    const db = getLocalDB();
    const currentUserId = getSessionUserId();
    const currentUser = db.users.find((u: any) => u.id === currentUserId) || db.users[0];

    // Helper response builders
    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
      });
    };

    const errorResponse = (error: string, status = 400) => {
      return jsonResponse({ error }, status);
    };

    // --- AUTH ROUTES ---
    if (pathname === "/api/auth/session") {
      return jsonResponse({ user: currentUser || null });
    }

    if (pathname === "/api/auth/logout") {
      safeLocalStorage.setItem("session_user_id", "");
      return jsonResponse({ success: true });
    }

    if (pathname === "/api/auth/register") {
      const { name, email, role } = body;
      if (!name || !email) {
        return errorResponse("Name and email are required.");
      }
      const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return errorResponse("Email is already registered.");
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: role || "student",
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 10000)}?w=150`,
        bio: "Trading student ready to master forex, crypto and indices.",
        joinedDate: new Date().toISOString()
      };
      db.users.push(newUser);
      saveLocalDB(db);
      safeLocalStorage.setItem("session_user_id", newUser.id);
      return jsonResponse({ user: newUser, token: `mock_session_${newUser.id}` }, 201);
    }

    if (pathname === "/api/auth/login") {
      const { email } = body;
      if (!email) {
        return errorResponse("Email is required.");
      }
      const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return errorResponse("User with this email does not exist.", 404);
      }
      safeLocalStorage.setItem("session_user_id", user.id);
      return jsonResponse({ user, token: `mock_session_${user.id}` });
    }

    if (pathname === "/api/auth/profile") {
      const { userId, bio, name } = body;
      const userIndex = db.users.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        return errorResponse("User not found", 404);
      }
      if (bio !== undefined) db.users[userIndex].bio = bio;
      if (name !== undefined) db.users[userIndex].name = name;
      saveLocalDB(db);
      return jsonResponse({ user: db.users[userIndex] });
    }

    if (pathname === "/api/auth/switch-role") {
      const { userId, role } = body;
      const userIndex = db.users.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        return errorResponse("User not found", 404);
      }
      db.users[userIndex].role = role;
      saveLocalDB(db);
      return jsonResponse({ user: db.users[userIndex] });
    }

    // --- COURSES ROUTES ---
    if (pathname === "/api/courses") {
      const userId = searchParams.get("userId") || currentUserId;
      const coursesWithProgress = db.courses.map((course: any) => {
        const enrollment = db.enrollments.find(
          (e: any) => e.userId === userId && e.courseId === course.id
        );
        return {
          ...course,
          progress: enrollment ? enrollment.progress : undefined
        };
      });
      return jsonResponse(coursesWithProgress);
    }

    if (pathname === "/api/courses/enroll") {
      const { userId, courseId } = body;
      if (!userId || !courseId) {
        return errorResponse("userId and courseId are required.");
      }
      const course = db.courses.find((c: any) => c.id === courseId);
      if (!course) {
        return errorResponse("Course not found.", 404);
      }
      const existing = db.enrollments.find(
        (e: any) => e.userId === userId && e.courseId === courseId
      );
      if (existing) {
        return jsonResponse({ enrollment: existing, message: "Already enrolled." });
      }

      const newEnrollment = {
        id: `enr_${Date.now()}`,
        userId,
        courseId,
        progress: 0,
        completedLessons: []
      };

      db.enrollments.push(newEnrollment);
      course.enrolledCount += 1;

      // Add payment
      const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPayment = {
        id: `pay_${Date.now()}`,
        userId,
        amount: course.price,
        currency: "USD",
        status: "succeeded",
        plan: course.title,
        date: new Date().toISOString(),
        invoiceId
      };
      db.payments.push(newPayment);

      // Add notification
      db.notifications.push({
        id: `n_${Date.now()}`,
        title: "Course Enrollment Successful!",
        message: `You have enrolled in '${course.title}'. Start watching lessons now.`,
        date: new Date().toISOString(),
        type: "course",
        read: false
      });

      saveLocalDB(db);
      return jsonResponse({ enrollment: newEnrollment, payment: newPayment });
    }

    if (pathname === "/api/courses/lesson-progress") {
      const { userId, courseId, lessonId, completed } = body;
      if (!userId || !courseId || !lessonId) {
        return errorResponse("userId, courseId, and lessonId are required.");
      }
      const enrollmentIndex = db.enrollments.findIndex(
        (e: any) => e.userId === userId && e.courseId === courseId
      );
      if (enrollmentIndex === -1) {
        return errorResponse("Enrollment not found.", 404);
      }
      const course = db.courses.find((c: any) => c.id === courseId);
      if (!course) {
        return errorResponse("Course not found.", 404);
      }

      const enrollment = db.enrollments[enrollmentIndex];
      if (!enrollment.completedLessons) {
        enrollment.completedLessons = [];
      }

      if (completed) {
        if (!enrollment.completedLessons.includes(lessonId)) {
          enrollment.completedLessons.push(lessonId);
        }
      } else {
        enrollment.completedLessons = enrollment.completedLessons.filter((id: string) => id !== lessonId);
      }

      enrollment.progress = Math.round((enrollment.completedLessons.length / course.lessons.length) * 100);
      saveLocalDB(db);
      return jsonResponse(enrollment);
    }

    // --- SIGNALS ROUTES ---
    if (pathname === "/api/signals") {
      return jsonResponse(db.signals);
    }

    if (pathname === "/api/signals/create") {
      const { pair, entry, stopLoss, takeProfit, risk, direction, comment } = body;
      if (!pair || !entry || !stopLoss || !takeProfit || !risk || !direction) {
        return errorResponse("Missing required signal parameters.");
      }
      const newSignal = {
        id: `sig_${Date.now()}`,
        pair,
        entry: parseFloat(entry),
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit),
        risk,
        direction,
        status: "ACTIVE",
        winRate: Math.floor(82 + Math.random() * 14),
        timestamp: new Date().toISOString(),
        comment: comment || "Review structural analysis before entry."
      };
      db.signals.unshift(newSignal);

      // Notify
      db.notifications.push({
        id: `n_${Date.now()}`,
        title: `New Real-Time Signal: ${pair}`,
        message: `${direction} entry at ${entry} with target ${takeProfit}. Manage risk carefully!`,
        date: new Date().toISOString(),
        type: "signal",
        read: false
      });

      saveLocalDB(db);
      return jsonResponse(newSignal, 201);
    }

    if (pathname === "/api/signals/delete") {
      const { id } = body;
      db.signals = db.signals.filter((s: any) => s.id !== id);
      saveLocalDB(db);
      return jsonResponse({ message: "Signal deleted successfully." });
    }

    if (pathname === "/api/signals/update-status") {
      const { id, status } = body;
      const signalIndex = db.signals.findIndex((s: any) => s.id === id);
      if (signalIndex === -1) {
        return errorResponse("Signal not found", 404);
      }
      db.signals[signalIndex].status = status;
      saveLocalDB(db);
      return jsonResponse(db.signals[signalIndex]);
    }

    // --- MENTORSHIP ROUTES ---
    if (pathname === "/api/mentorship/slots") {
      return jsonResponse(db.mentorshipSlots);
    }

    if (pathname === "/api/mentorship/book") {
      const { userId, slotId, topic } = body;
      if (!userId || !slotId) {
        return errorResponse("userId and slotId are required.");
      }
      const slotIndex = db.mentorshipSlots.findIndex((s: any) => s.id === slotId);
      if (slotIndex === -1) {
        return errorResponse("Slot not found", 404);
      }
      if (db.mentorshipSlots[slotIndex].status === "booked") {
        return errorResponse("This slot is already booked.");
      }

      db.mentorshipSlots[slotIndex].status = "booked";
      db.mentorshipSlots[slotIndex].topic = topic || "SMC structure coaching";

      // Add payment
      const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      db.payments.push({
        id: `pay_${Date.now()}`,
        userId,
        amount: 150,
        currency: "USD",
        status: "succeeded",
        plan: `1-on-1 Mentorship Session with ${db.mentorshipSlots[slotIndex].mentorName}`,
        date: new Date().toISOString(),
        invoiceId
      });

      // Add notification
      db.notifications.push({
        id: `n_${Date.now()}`,
        title: "Mentorship Session Booked!",
        message: `Your session with ${db.mentorshipSlots[slotIndex].mentorName} is confirmed for ${db.mentorshipSlots[slotIndex].date} at ${db.mentorshipSlots[slotIndex].time}.`,
        date: new Date().toISOString(),
        type: "general",
        read: false
      });

      saveLocalDB(db);
      return jsonResponse(db.mentorshipSlots[slotIndex]);
    }

    // --- BLOG ROUTES ---
    if (pathname === "/api/blog") {
      return jsonResponse(db.blogPosts);
    }

    if (pathname === "/api/blog/comment") {
      const { postId, author, text } = body;
      if (!postId || !author || !text) {
        return errorResponse("Missing comment fields.");
      }
      const postIndex = db.blogPosts.findIndex((b: any) => b.id === postId);
      if (postIndex === -1) {
        return errorResponse("Post not found", 404);
      }
      const newComment = {
        id: `com_${Date.now()}`,
        author,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 10000)}?w=100`,
        text,
        date: new Date().toISOString()
      };
      db.blogPosts[postIndex].comments.push(newComment);
      saveLocalDB(db);
      return jsonResponse(newComment, 201);
    }

    if (pathname === "/api/blog/like") {
      const { postId } = body;
      const postIndex = db.blogPosts.findIndex((b: any) => b.id === postId);
      if (postIndex === -1) {
        return errorResponse("Post not found", 404);
      }
      db.blogPosts[postIndex].likes += 1;
      saveLocalDB(db);
      return jsonResponse({ likes: db.blogPosts[postIndex].likes });
    }

    if (pathname === "/api/blog/create") {
      const { title, excerpt, content, category, author } = body;
      if (!title || !excerpt || !content || !category) {
        return errorResponse("Missing blog fields.");
      }
      const newPost = {
        id: `blog_${Date.now()}`,
        title,
        excerpt,
        content,
        author: author || "Coach Bash",
        date: new Date().toISOString(),
        category,
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600",
        views: 1,
        likes: 0,
        comments: []
      };
      db.blogPosts.unshift(newPost);
      saveLocalDB(db);
      return jsonResponse(newPost, 201);
    }

    // --- FAQS ROUTES ---
    if (pathname === "/api/faqs") {
      return jsonResponse(db.faqs);
    }

    if (pathname === "/api/faqs/create") {
      const { question, answer, category } = body;
      if (!question || !answer || !category) {
        return errorResponse("All fields are required");
      }
      const newItem = {
        id: `faq_${Date.now()}`,
        question,
        answer,
        category
      };
      db.faqs.push(newItem);
      saveLocalDB(db);
      return jsonResponse(newItem, 201);
    }

    // --- JOURNAL ROUTES ---
    if (pathname === "/api/journal") {
      return jsonResponse(db.journalEntries);
    }

    if (pathname === "/api/journal/create") {
      const { pair, direction, entry, exit, size, profit, notes } = body;
      if (!pair || !direction || !entry || !exit || !size || profit === undefined) {
        return errorResponse("Missing required trade journal fields.");
      }
      const newEntry = {
        id: `j_${Date.now()}`,
        date: new Date().toISOString(),
        pair,
        direction,
        entry: parseFloat(entry),
        exit: parseFloat(exit),
        size: parseFloat(size),
        profit: parseFloat(profit),
        notes: notes || ""
      };
      db.journalEntries.unshift(newEntry);
      saveLocalDB(db);
      return jsonResponse(newEntry, 201);
    }

    if (pathname === "/api/journal/delete") {
      const { id } = body;
      db.journalEntries = db.journalEntries.filter((j: any) => j.id !== id);
      saveLocalDB(db);
      return jsonResponse({ message: "Journal entry deleted successfully." });
    }

    // --- NOTES ROUTES ---
    if (pathname === "/api/notes") {
      return jsonResponse(db.tradingNotes);
    }

    if (pathname === "/api/notes/save") {
      const { id, title, content } = body;
      if (!title || !content) {
        return errorResponse("Title and content are required.");
      }
      if (id) {
        const noteIndex = db.tradingNotes.findIndex((n: any) => n.id === id);
        if (noteIndex !== -1) {
          db.tradingNotes[noteIndex].title = title;
          db.tradingNotes[noteIndex].content = content;
          saveLocalDB(db);
          return jsonResponse(db.tradingNotes[noteIndex]);
        }
      }
      const newNote = {
        id: `note_${Date.now()}`,
        title,
        content
      };
      db.tradingNotes.unshift(newNote);
      saveLocalDB(db);
      return jsonResponse(newNote, 201);
    }

    if (pathname === "/api/notes/delete") {
      const { id } = body;
      db.tradingNotes = db.tradingNotes.filter((n: any) => n.id !== id);
      saveLocalDB(db);
      return jsonResponse({ message: "Note deleted." });
    }

    // --- PAYMENTS ROUTES ---
    if (pathname === "/api/payments/history") {
      const userId = searchParams.get("userId") || currentUserId;
      const list = userId ? db.payments.filter((p: any) => p.userId === userId) : db.payments;
      return jsonResponse(list);
    }

    if (pathname === "/api/payments/checkout") {
      const { userId, amount, plan, paymentMethod } = body;
      if (!userId || !amount || !plan) {
        return errorResponse("userId, amount, and plan are required.");
      }
      const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPayment = {
        id: `pay_${Date.now()}`,
        userId,
        amount: parseFloat(amount),
        currency: "USD",
        status: "succeeded",
        plan,
        date: new Date().toISOString(),
        invoiceId
      };
      db.payments.unshift(newPayment);

      db.notifications.push({
        id: `n_${Date.now()}`,
        title: "Payment Processed successfully",
        message: `Thank you! Your payment of $${amount} for '${plan}' was processed via ${paymentMethod || "Stripe"}.`,
        date: new Date().toISOString(),
        type: "payment",
        read: false
      });

      saveLocalDB(db);
      return jsonResponse({ success: true, payment: newPayment });
    }

    // --- NOTIFICATIONS ROUTES ---
    if (pathname === "/api/notifications") {
      return jsonResponse(db.notifications);
    }

    if (pathname === "/api/notifications/read-all") {
      db.notifications = db.notifications.map((n: any) => ({ ...n, read: true }));
      saveLocalDB(db);
      return jsonResponse({ message: "Marked all as read." });
    }

    // --- ADMIN OVERVIEW STATS ---
    if (pathname === "/api/admin/stats") {
      const totalUsers = db.users.length;
      const totalRevenue = db.payments.reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const totalCourses = db.courses.length;
      const activeSignals = db.signals.filter((s: any) => s.status === "ACTIVE").length;
      return jsonResponse({
        totalUsers,
        totalRevenue,
        totalCourses,
        activeSignals
      });
    }

    // --- GEMINI AI MARKET ANALYSIS ENGINE (Client-Side Interceptor) ---
    if (pathname === "/api/ai/analyze") {
      const { prompt, context } = body;
      if (!prompt) {
        return errorResponse("Prompt is required for AI analysis.");
      }

      console.log("%c[Mock AI Engine] Responding to query:", "color: #8B5CF6;", prompt);

      // Simple keywords matching to make client-side responses feel unbelievably alive!
      let replyText = "";
      const lower = prompt.toLowerCase();

      if (lower.includes("btc") || lower.includes("bitcoin") || lower.includes("crypto")) {
        replyText = `### 🪙 Institutional Crypto Analyst Report - Bitcoin Focus

Looking closely at current high-timeframe order flow and technical metrics for **Bitcoin (BTC/USD)**:

1. **Liquidity Pool Scenarios**: Bitcoin currently possesses thick sell-side liquidity clusters concentrated directly below the **$88,400 swing low**. This matches institutional mitigation blocks.
2. **Fair Value Gaps (FVG)**: On the 4-Hour timeframe, a major **FVG** remains unfilled between **$86,200 and $87,500**. Standard SMC playbooks state that institutions will likely sweep local retail longs into this zone before launching the next expansion leg toward **$94,500**.
3. **Execution Plan**:
   - Avoid executing high-leverage perpetual longs at current psychological consolidation.
   - Set limit orders inside the discount matrix (**$86,800 - $87,200**) with a strict Stop Loss placed safely beneath **$85,900**.
   - Target 1: **$90,500** (Local Highs) | Target 2: **$94,200** (Premium liquidity sweep).

*Disclaimer: This analysis is for educational purposes only. Cryptocurrency trading carries substantial risk.*`;
      } else if (lower.includes("eur") || lower.includes("forex") || lower.includes("gbp") || lower.includes("dollar")) {
        replyText = `### 💱 Institutional Forex Analyst Report - Currency Markets

Our institutional analysis of key G10 currency pairs, particularly **EUR/USD**, highlights the following setups:

1. **Market Structure (MS)**: The daily trend is firmly bearish, but the 15-minute timeframe indicates a clear **Change of Character (CHoCH)** to the upside after sweeping the London session lows at **1.0820**.
2. **Order Block (OB) Identification**: A valid, unmitigated 4-Hour bullish order block is sitting at **1.0835 - 1.0845**. High-volume trading desks are likely protecting this area to build long inventory.
3. **Execution Plan**:
   - Patiently wait for a retest into the 50% Mean Threshold of the 1.0840 order block.
   - **Stop Loss**: 1.0815 (Placed below structural swing lows).
   - **Take Profit**: 1.0955 (Daily Buy-Side Liquidity target).
   - Maintain strict 1% maximum capital exposure on this Forex swing setup.

*Disclaimer: This analysis is for educational purposes only. Forex trading involves significant risk of leverage.*`;
      } else if (lower.includes("gold") || lower.includes("xau") || lower.includes("commodity")) {
        replyText = `### 🏆 Precious Metals Report - Gold (XAU/USD) Analysis

Gold continues to trade inside an incredibly precise technical structure as global central banks realign liquidity reserves:

1. **Supply/Demand Dynamics**: A powerful 1-Hour institutional supply zone has established between **$2,348 and $2,352**. Three consecutive rejections confirmed heavy limit sell orders residing in this block.
2. **Liquidity Sweep**: A buy-side liquidity grab occurred during early New York session hours, briefly touching **$2,351** before dropping impulsively, shifting the market structure to bearish on lower timeframes.
3. **Execution Plan**:
   - Sell Limit orders can be positioned at the pullback into **$2,345.5**.
   - **Stop Loss**: $2,351.5 (Strict invalidation point above NYC supply).
   - **Take Profit**: $2,325.0 (Targeting the daily discount order block).
   - Secure +100 pips of profit and immediately adjust your Stop Loss to entry (Breakeven).

*Disclaimer: Commodities are extremely volatile. Exercise professional capital sizing controls.*`;
      } else {
        replyText = `### 🎓 Chief Trading Mentor AI Analysis Report

Thank you for your inquiry regarding: **"${prompt}"**.

Here is an institutional-grade educational breakdown based on **Smart Money Concepts (SMC)** and elite risk management:

1. **Structure Shift Rule**: Before entering any technical setup, always ensure a clean **CHoCH (Change of Character)** is accompanied by an **impulsive breakout** that leaves a visible **FVG (Fair Value Gap)**. A break of structure without high volume is often a retail trap.
2. **Discount Pricing Matrix**: Never buy in the **Premium zone** (top 50% of the trading range) or sell in the **Discount zone** (bottom 50% of the range). Draw a Fibonacci retracement from swing low to swing high, and only execute buys below the 0.5 equilibrium level.
3. **The 1% Golden Sizing Rule**: Ensure that your total loss if stopped out is exactly **1% of your total account equity**. Let the mathematics of risk probability work for you, not against you.

*This live report was generated client-side by our educational engine. Add your own GEMINI_API_KEY in settings to unlock real-time streaming model reasoning!*`;
      }

      // Add a slight latency to make it feel beautifully realistic
      await new Promise((r) => setTimeout(r, 800));

      return jsonResponse({ text: replyText });
    }

    // Default Fallback
    return originalFetch(input, init);
  };
}
