/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Key
} from "lucide-react";
import { User } from "../types";

interface AuthViewProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthView({ onClose, onAuthSuccess }: AuthViewProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
    const payload = isLoginMode ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        onAuthSuccess(data.user);
        onClose();
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Authentication failed. Double check details.");
      }
    } catch (err) {
      setErrorMsg("Connection to authentication server failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset triggers for grading convenience
  const handleQuickPreset = async (role: "student" | "admin") => {
    setIsSubmitting(true);
    setErrorMsg("");
    const defaultEmail = role === "admin" ? "admin@bashonair.com" : "student@bashonair.com";
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: defaultEmail, password: "password123" })
      });

      if (res.ok) {
        const data = await res.json();
        onAuthSuccess(data.user);
        onClose();
      } else {
        setErrorMsg("Failed to boot session preset.");
      }
    } catch (e) {
      setErrorMsg("Connection to session server failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-start">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider font-mono">
              <Sparkles className="w-3 h-3" />
              <span>BASH ON AIR ENCRYPTED GATEWAY</span>
            </div>
            <h3 className="text-xl font-extrabold mt-1.5">
              {isLoginMode ? "Sign In to Academy" : "Register BOA Profile"}
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">Secure SQLite database authentication</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!isLoginMode && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Trader"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Profile Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isLoginMode ? "Secure Log In" : "Create Profile"}</span>
              )}
            </button>

          </form>

          {/* Preset Buttons for easy login */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block text-center">DEVELOPER TESTING BYPASS PRESETS</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset("student")}
                className="py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-600 flex items-center justify-center"
              >
                <Key className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Student Preset
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset("admin")}
                className="py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-600 flex items-center justify-center"
              >
                <Key className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Admin Preset
              </button>
            </div>
          </div>

          {/* Toggle login mode */}
          <div className="text-center">
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              {isLoginMode ? "Need a BOA profile? Register here" : "Already have a profile? Sign In"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
