/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Bell,
  TrendingUp,
  X,
  MessageSquare,
  Lock
} from "lucide-react";
import { TradingSignal, User } from "../types";

interface SignalsViewProps {
  user: User | null;
  signals: TradingSignal[];
  onOpenLogin: () => void;
  fetchSignals: () => void;
}

export default function SignalsView({
  user,
  signals,
  onOpenLogin,
  fetchSignals
}: SignalsViewProps) {
  const [checkoutPlan, setCheckoutPlan] = useState<{ name: string; price: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const closeCheckout = () => {
    setCheckoutPlan(null);
    setCheckoutSuccess(false);
  };

  const mockTelegramMessages = [
    {
      pair: "EURUSD",
      type: "BUY SETUP 🔵",
      entry: "1.08420 - 1.08450",
      sl: "1.08180",
      tp: "1.09200",
      status: "HIT TP2 (+80 pips) 🚀",
      time: "10:24 AM"
    },
    {
      pair: "XAUUSD (GOLD)",
      type: "SELL LIMIT SETUP 🔴",
      entry: "2354.50 - 2356.00",
      sl: "2361.00",
      tp: "2338.00",
      status: "HIT TP1 (+165 pips) 🔥",
      time: "02:15 PM"
    },
    {
      pair: "GBPUSD",
      type: "BUY Setup 🔵",
      entry: "1.26800",
      sl: "1.26550",
      tp: "1.27500",
      status: "ACTIVE • Running +35 pips",
      time: "04:02 PM"
    }
  ];

  return (
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
        
        {/* Intro */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-[#0088cc]/10 text-[#0088cc] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#0088cc]/20">
            <Send className="w-3.5 h-3.5 fill-[#0088cc]" />
            <span>EXCLUSIVELY VIA TELEGRAM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            BOA VIP Trading Signals
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            All our high-accuracy, institutional smart money signals are delivered instantly straight to your smartphone via our private Telegram channel. No manual refresh required.
          </p>
        </div>

        {/* Telegram Promo Card */}
        <div className="bg-gradient-to-br from-[#0088cc] to-[#006699] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Background decorative patterns */}
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-25%] left-[-10%] w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7 space-y-6">
              <span className="bg-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full w-fit block font-mono">
                REAL-TIME TELEGRAM PUSH ALERTS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Get Institutional Setups Delivered Instantly
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Why wait on a browser dashboard? Receive live entries, stop losses, take profits, and regular charting breakdowns formatted clearly as beautiful Telegram alerts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans font-medium text-blue-50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Real-time instant push notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Interactive SMC chart markups</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Risk management guidelines</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Direct admin support link</span>
                </div>
              </div>
            </div>

            {/* Mock Telegram Feed Screen */}
            <div className="md:col-span-5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                    BOA
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-white">BOA VIP SIGNALS</span>
                    <span className="text-[9px] text-[#0088cc] font-mono">4,124 subscribers</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-[#0088cc]/30 text-white px-2 py-0.5 rounded-full font-bold">LIVE STREAM</span>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {mockTelegramMessages.map((msg, i) => (
                  <div key={i} className="bg-slate-950/60 p-3 rounded-xl border border-white/5 space-y-1 text-[11px]">
                    <div className="flex justify-between items-center text-gray-400 font-mono text-[9px]">
                      <span>{msg.pair} • {msg.type}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="text-white space-y-0.5">
                      <div><span className="text-gray-400">Entry:</span> <strong className="font-mono">{msg.entry}</strong></div>
                      <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                        <div><span className="text-rose-400">SL:</span> {msg.sl}</div>
                        <div><span className="text-emerald-400">TP:</span> {msg.tp}</div>
                      </div>
                    </div>
                    <div className="border-t border-white/5 pt-1 mt-1 text-[10px] text-emerald-400 font-bold flex items-center justify-between">
                      <span>{msg.status}</span>
                      <span className="text-[8px] text-gray-500">BOA Bot 🤖</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing/Subscription Cards */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 font-sans">Select Your VIP Access Pass</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Processed securely via Selar. Get added instantly to the private Telegram channel upon successful subscription.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            
            {/* Monthly Pass */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold font-mono text-blue-500 uppercase tracking-wider block">BOOSTER ACCURACY</span>
                <h4 className="text-xl font-extrabold text-gray-900">Monthly VIP Pass</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Perfect for retail traders seeking consistent institutional entries and high-accuracy Forex, Indices and Commodities setups daily.
                </p>
                <div className="text-3xl font-extrabold text-gray-900 font-mono pt-2">
                  ₦75,000 <span className="text-xs font-normal text-gray-400">/ month</span>
                </div>
              </div>

              <button
                id="signals-monthly-checkout-btn"
                onClick={() => setCheckoutPlan({ name: "Monthly VIP Pass", price: 75000 })}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5 fill-white shrink-0" />
                <span>Join Monthly VIP via Selar</span>
              </button>
            </div>

            {/* Yearly Pass */}
            <div className="bg-white rounded-3xl border-2 border-indigo-600 p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3.5 right-6 bg-indigo-600 text-white text-[9px] font-extrabold tracking-wider px-2.5 py-1 rounded-full font-mono uppercase shadow-sm">
                POPULAR BEST VALUE (SAVE 50%)
              </span>
              <div className="space-y-3">
                <span className="text-[10px] font-bold font-mono text-indigo-500 uppercase tracking-wider block font-bold">UNLIMITED FUNDED PRO</span>
                <h4 className="text-xl font-extrabold text-gray-900">Yearly VIP Pass</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  For traders serious about passing prop-firm evaluations, getting funded, and sustaining massive multi-tier payouts.
                </p>
                <div className="text-3xl font-extrabold text-gray-900 font-mono pt-2">
                  ₦450,000 <span className="text-xs font-normal text-gray-400">/ year</span>
                </div>
              </div>

              <button
                id="signals-yearly-checkout-btn"
                onClick={() => setCheckoutPlan({ name: "Yearly VIP Pass", price: 450000 })}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5 fill-white shrink-0" />
                <span>Join Yearly VIP via Selar</span>
              </button>
            </div>

          </div>
        </div>

        {/* Secure Checkout Dialog */}
        {checkoutPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold font-mono uppercase text-blue-100 block">SELAR SECURE GATEWAY</span>
                  <h3 className="text-lg font-extrabold">{checkoutPlan.name}</h3>
                  <p className="text-xs text-blue-100 mt-1">Instant Telegram Channel Invitation</p>
                </div>
                <button onClick={closeCheckout} className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {checkoutSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm font-sans">Checkout Redirect Succeeded!</h4>
                      <p className="text-xs text-gray-500 mt-2">
                        We have successfully generated your secure checkout order on Selar. After payment is completed, you will be instantly added to the private Telegram signals channel!
                      </p>
                    </div>
                    <div className="pt-2">
                      <a
                        href="https://t.me/bashonair"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
                      >
                        <Send className="w-4 h-4 fill-white" />
                        <span>Join Private Telegram Channel</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-2xl space-y-2">
                      <h4 className="font-bold text-xs text-indigo-800 font-sans">🔔 Automated Push Delivery</h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        To access live trade signals, exact entries, stop losses, take profits, and regular charting breakdowns, please complete your subscription on Selar.
                      </p>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-500">Subscription Price:</span>
                      <span className="text-base font-extrabold text-gray-900 font-mono">₦{checkoutPlan.price.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsProcessing(true);
                          // Open Selar link in new tab
                          window.open(`https://selar.co/`, "_blank");
                          
                          // Simulate successful redirect registration
                          setTimeout(() => {
                            setCheckoutSuccess(true);
                            setIsProcessing(false);
                          }, 1500);
                        }}
                        disabled={isProcessing}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
                      >
                        {isProcessing ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>Redirecting to Selar...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-blue-100" />
                            <span>Proceed to Selar Secure Checkout</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={closeCheckout}
                        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex items-center justify-center space-x-1 text-[9px] text-gray-400 font-mono">
                      <span>SECURED SELAR GATEWAY • NO LOGIN REQUIRED</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
