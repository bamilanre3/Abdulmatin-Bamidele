/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, ArrowRight, BookOpen, ShieldAlert, Users, Trophy } from "lucide-react";
import TradingDashboard from "./TradingDashboard";

interface HeroProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export default function Hero({ onNavigate, onOpenRegister }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-transparent pt-10 pb-20 sm:pb-28">
      
      {/* Absolute decorative floating background gradients (Stripe style) */}
      <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 -z-10 w-96 h-96 bg-indigo-100/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Layout: Text on Left, Chart Dashboard on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Promo banner badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit animate-fade-in mx-auto lg:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Enrolling for 2026 Now</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.05] font-sans">
              Learn Trading <br className="hidden sm:inline" />
              Like A <span className="text-blue-600">Professional.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Master Forex, Crypto and Indices through Live Classes, Premium Signals and Expert Mentorship.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-join-academy-btn"
                onClick={() => onNavigate("academy")}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Join Academy
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </button>
              
              <button
                id="hero-explore-courses-btn"
                onClick={() => onNavigate("academy")}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Explore Courses
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 max-w-md mx-auto lg:mx-0 font-sans">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">15K+</span>
                <span className="text-xs text-gray-400 block font-mono">ACTIVE STUDENTS</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">89%</span>
                <span className="text-xs text-gray-400 block font-mono">SIGNAL WIN RATE</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">$5M+</span>
                <span className="text-xs text-gray-400 block font-mono">SECURED PAYOUTS</span>
              </div>
            </div>

          </div>

          {/* Right Interactive Dashboard */}
          <div className="lg:col-span-7">
            <div className="relative">
              
              {/* Premium Glow effect behind dashboard */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-indigo-300/10 to-blue-200/10 rounded-3xl blur-2xl -z-10 transform scale-105 pointer-events-none" />
              
              {/* Actual Trading Dashboard Widget */}
              <TradingDashboard />

              {/* Floating feature highlights */}
              <div className="absolute -top-4 -right-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-md flex items-center space-x-2.5 max-w-[180px] hidden sm:flex">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono block">TOP PERFORMANCE</span>
                  <span className="text-xs font-bold text-gray-800">142 Funded Students</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-md flex items-center space-x-2.5 max-w-[190px] hidden sm:flex">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono block">RISK PROTECTION</span>
                  <span className="text-xs font-bold text-gray-800">100% Capital Safe Sizing</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
