/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Send, 
  Users, 
  Layers, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  HelpCircle
} from "lucide-react";
import { User } from "../types";

interface MentorshipViewProps {
  user: User | null;
  onOpenLogin: () => void;
  onNavigate: (route: string) => void;
}

export default function MentorshipView({
  user,
  onOpenLogin,
  onNavigate
}: MentorshipViewProps) {
  return (
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16 animate-fade-in">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>ELITE PRIVATE COACHING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Elite 1-on-1 Private Mentorship
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Skip years of painful retail losses. Work directly with Coach Bash and Coach Air to audit your executions, refine your setups, and clear your funded prop-firm accounts.
          </p>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">Personal Trade Audits</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We look directly at your trade journals, analyze bad executions, highlight emotional biases, and write a personalized recovery plan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">SMC Live Charting</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Open live markets on Zoom together. Practice marking order blocks, liquidity traps, and confirming high-winrate entry confirmations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">Prop Firm Prep</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Master the exact sizing guidelines, drawdowns protection structures, and phase targets required to clear FTMO and funded accounts.
            </p>
          </div>
        </div>

        {/* Telegram Direct Booking Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-1.5 bg-[#0088cc]/20 text-[#0088cc] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#0088cc]/30">
              <Send className="w-3.5 h-3.5 fill-[#0088cc]" />
              <span>DIRECT APPOINTMENTS</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                All Mentorship Bookings Are Handled via Telegram
              </h3>
              <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
                To guarantee immediate scheduling response, coordinate timezones, and receive customized billing templates, all private 1-on-1 lessons are booked directly by messaging Coach Bash on Telegram.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left font-mono">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-blue-500 font-bold block text-sm mb-1">STEP 1</span>
                <span className="text-[11px] text-gray-300 leading-relaxed block">Click the booking link below to message Coach Bash on Telegram.</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-blue-500 font-bold block text-sm mb-1">STEP 2</span>
                <span className="text-[11px] text-gray-300 leading-relaxed block">Propose your trading goals and agree on a session timeframe.</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-blue-500 font-bold block text-sm mb-1">STEP 3</span>
                <span className="text-[11px] text-gray-300 leading-relaxed block">Lock in your Zoom slot and begin your intensive trading audit.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="https://t.me/bashonair"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-xl font-bold text-base shadow-lg shadow-[#0088cc]/20 flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
              >
                <Send className="w-4 h-4 fill-white" />
                <span>Message Coach Bash on Telegram</span>
              </a>
              
              <button
                onClick={() => onNavigate("faq")}
                className="w-full sm:w-auto px-6 py-4 bg-slate-850 hover:bg-slate-800 text-gray-300 border border-slate-700 rounded-xl font-semibold text-sm"
              >
                Learn Pricing Plans
              </button>
            </div>

            <div className="text-[10px] text-gray-500 font-mono">
              GUARANTEED RESPONSE WITHIN 24 HOURS • WORLDWIDE SLOTS OPEN
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
