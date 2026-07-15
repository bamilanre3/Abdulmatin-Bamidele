/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrendingUp, Mail, Send, CheckCircle2 } from "lucide-react";

interface FooterProps {
  onNavigate: (route: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-white/40 backdrop-blur-md border-t border-blue-50/60 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate("home")} 
              className="flex items-center space-x-2 cursor-pointer group"
              id="footer-logo"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Bash <span className="text-blue-600">On Air</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              We provide institutional-grade trading education, expert live classes, 1-on-1 coaching sessions, and high-probability market setups. Unleash your full potential on Forex, Crypto, and Indices.
            </p>
            <div className="text-xs text-gray-400 font-mono">
              © 2026 Bash On Air. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-mono">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <button onClick={() => onNavigate("academy")} className="hover:text-blue-600 hover:underline">
                  Academy Courses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("signals")} className="hover:text-blue-600 hover:underline">
                  Trading Signals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("mentorship")} className="hover:text-blue-600 hover:underline">
                  Mentorship Bookings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("community")} className="hover:text-blue-600 hover:underline">
                  Forums & Discussion
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Docs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-mono">Company & Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-blue-600 hover:underline">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("faq")} className="hover:text-blue-600 hover:underline">
                  FAQs & Help Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("privacy")} className="hover:text-blue-600 hover:underline">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("terms")} className="hover:text-blue-600 hover:underline">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-mono">Market Updates</h4>
            <p className="text-xs text-gray-500">
              Receive high-probability setups and tips directly in your inbox.
            </p>
            {isSubscribed ? (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3.5 rounded-xl border border-emerald-100 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Awesome! You are subscribed to our newsletter list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                {error && <p className="text-[11px] text-red-500 font-mono">{error}</p>}
              </form>
            )}
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100/60 text-center max-w-4xl mx-auto">
          <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
            <span className="font-semibold uppercase font-mono mr-1">Risk Warning & Disclaimer:</span> Trading foreign exchange, cryptocurrencies, indices, and commodities carries high risk. Past performance does not guarantee future results. Bash On Air is an educational platform providing signals and mentorship. We do not provide financial advice. All analysis is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
