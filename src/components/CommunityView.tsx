/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Send, 
  Award, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Lock 
} from "lucide-react";
import { User } from "../types";

interface CommunityViewProps {
  user: User | null;
  onOpenLogin: () => void;
}

interface ChatMessage {
  id: string;
  author: string;
  avatar: string;
  role: "mentor" | "student" | "admin";
  text: string;
  time: string;
  likes: number;
  likedByUser?: boolean;
}

export default function CommunityView({
  user,
  onOpenLogin
}: CommunityViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      author: "Coach Bash",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      role: "mentor",
      text: "🚨 London Session wrap up: EURUSD hit our take profit target at 1.0910 perfectly. Remember to secure partials and move stop loss to entry!",
      time: "08:15 AM",
      likes: 12,
    },
    {
      id: "msg_2",
      author: "Michael K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      role: "student",
      text: "Boom! Just secured +45 pips on that setup. That London supply zone was a textbook order block. Thanks Coach!",
      time: "08:22 AM",
      likes: 5,
    },
    {
      id: "msg_3",
      author: "Coach Air",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      role: "mentor",
      text: "Excellent work Michael! Keep strict risk management active. Remember we have US CPI data coming out in 3 hours, so clear active intraday trades before the release.",
      time: "08:35 AM",
      likes: 8,
    },
    {
      id: "msg_4",
      author: "Sophia R.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      role: "student",
      text: "Passed my FTMO Phase 1 challenge today! 100% of my setups were based on BOA SMC concepts. Sizing down on medium risk setups was the key.",
      time: "09:05 AM",
      likes: 18,
    }
  ]);

  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (!inputVal.trim()) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      author: user.name,
      avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      role: user.role === "admin" ? "admin" : "student",
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      likes: 0
    };

    setMessages([...messages, newMsg]);
    setInputVal("");
  };

  const toggleLike = (id: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === id) {
        const liked = !m.likedByUser;
        return {
          ...m,
          likedByUser: liked,
          likes: liked ? m.likes + 1 : m.likes - 1
        };
      }
      return m;
    }));
  };

  const leaderboard = [
    { rank: 1, name: "Sophia R.", profit: "$14,250", winRate: "89%", streak: 8, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
    { rank: 2, name: "Michael K.", profit: "$8,910", winRate: "84%", streak: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
    { rank: 3, name: "Alex Carter", profit: "$7,300", winRate: "78%", streak: 4, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
    { rank: 4, name: "Jessica L.", profit: "$5,820", winRate: "75%", streak: 3, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" }
  ];

  return (
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            <Users className="w-3.5 h-3.5" />
            <span>STUDENT COMMUNE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Bash On Air Live Community
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Trade alongside 15,000+ elite members globally. Chat live, share setups, track the funded leaderboard, and grow with peer-to-peer accountability.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chat Feed */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-100" />
                <div>
                  <h3 className="font-extrabold text-sm">#global-student-lounge</h3>
                  <p className="text-[10px] text-blue-100">Intraday discussions, news analysis & markups</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-[10px] font-mono font-bold">1,482 ONLINE</span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((msg) => {
                const isMentor = msg.role === "mentor";
                return (
                  <div key={msg.id} className="flex items-start space-x-3.5">
                    <img 
                      src={msg.avatar} 
                      alt={msg.author} 
                      className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0" 
                    />
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-extrabold text-xs text-gray-800">{msg.author}</span>
                        {isMentor ? (
                          <span className="bg-blue-100 text-blue-700 text-[8px] font-extrabold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider">
                            MENTOR
                          </span>
                        ) : msg.role === "admin" ? (
                          <span className="bg-purple-100 text-purple-700 text-[8px] font-extrabold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider">
                            ADMIN
                          </span>
                        ) : null}
                        <span className="text-[9px] text-gray-400 font-mono">{msg.time}</span>
                      </div>

                      <div className={`text-xs leading-relaxed p-3.5 rounded-2xl ${
                        isMentor 
                          ? "bg-blue-50 text-slate-800 font-medium border border-blue-100/50" 
                          : "bg-gray-50 text-gray-700"
                      }`}>
                        {msg.text}
                      </div>

                      <div className="flex items-center space-x-3 pl-1">
                        <button 
                          onClick={() => toggleLike(msg.id)}
                          className={`text-[10px] font-bold flex items-center space-x-1 transition-colors ${
                            msg.likedByUser ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>{msg.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {user ? (
                <form onSubmit={handleSend} className="flex space-x-3">
                  <input
                    type="text"
                    required
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Message #global-student-lounge..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-2">
                  <button
                    onClick={onOpenLogin}
                    className="inline-flex items-center space-x-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-5 py-2.5 rounded-xl border border-blue-100 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log In to Participate in Live Community Chat</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="space-y-6">
            
            {/* Top Traders Leaderboard */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
              <div className="flex items-center space-x-2 border-b border-gray-50 pb-4">
                <Award className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-800">Funded Leaderboard</h3>
                  <p className="text-[10px] text-gray-400 font-mono">THIS MONTH'S GAINS</p>
                </div>
              </div>

              <div className="space-y-4">
                {leaderboard.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between border-b border-gray-50/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-mono font-bold w-5 text-center ${
                        item.rank === 1 ? "text-amber-500 font-extrabold text-sm" : item.rank === 2 ? "text-slate-500" : "text-gray-400"
                      }`}>
                        #{item.rank}
                      </span>
                      <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <div>
                        <span className="font-bold text-xs text-gray-800 block">{item.name}</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[9px] font-mono text-emerald-600 font-bold">{item.profit}</span>
                          <span className="text-[9px] text-gray-400 font-mono">Win Rate: {item.winRate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono">
                      <Flame className="w-3 h-3 mr-0.5 text-rose-500 animate-pulse" />
                      <span>{item.streak} winstreak</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Discord invitation */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Users className="w-32 h-32 text-white" />
              </div>

              <div className="relative z-10 space-y-4">
                <span className="text-[9px] font-bold tracking-wider uppercase font-mono text-indigo-300">BOA ECOSYSTEM</span>
                <h3 className="font-extrabold text-sm tracking-tight leading-snug">
                  Get Approved for the Private BOA Discord Channel
                </h3>
                <p className="text-[11px] text-indigo-200 leading-relaxed">
                  Join our verified Discord to receive automated trade signal push alerts, premium webinars, and voice charting channels.
                </p>
                <a 
                  href="https://discord.gg/boa" 
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Verified Discord</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
