/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Check, 
  Sliders, 
  Menu, 
  X,
  BookOpen,
  Compass,
  DollarSign,
  Briefcase,
  Send
} from "lucide-react";
import { User, Notification, UserRole } from "../types";

interface HeaderProps {
  user: User | null;
  notifications: any[];
  activeRoute: string;
  onNavigate: (route: string) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onRoleToggle: () => void;
}

export default function Header({
  user,
  notifications,
  activeRoute,
  onNavigate,
  onLoginClick,
  onLogout,
  onRoleToggle
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Sync unread counts
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const handleMarkAllRead = () => {
    notifications.forEach(n => n.read = true);
    setUnreadCount(0);
  };

  const menuItems = [
    { label: "Home", route: "home" },
    { label: "Academy", route: "academy" },
    { label: "Signals", route: "signals" },
    { label: "Mentorship", route: "mentorship" },
    { label: "Community", route: "community" },
    { label: "Pricing", route: "pricing" },
    { label: "Blog", route: "blog" },
    { label: "FAQ", route: "faq" },
    { label: "Contact", route: "contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFBFF]/70 backdrop-blur-md border-b border-blue-50/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { onNavigate("home"); setIsMobileMenuOpen(false); }} 
            className="flex items-center space-x-2.5 cursor-pointer group"
            id="header-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 flex items-center">
                Bash <span className="text-blue-600 ml-1">On Air</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 block -mt-1 font-mono">
                Learn. Trade. Grow.
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = activeRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-item-${item.route}`}
                  onClick={() => onNavigate(item.route)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-50/60 text-blue-600 font-semibold" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/60"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions Menu */}
          <div className="flex items-center space-x-3">
            
            {/* Direct Telegram Access Button */}
            <a
              href="https://t.me/bashonair"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5 fill-white" />
              <span>Join Telegram</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100/60 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 pt-2 pb-6 space-y-2.5 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-gray-100 px-4">
            <a
              href="https://t.me/bashonair"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-bold rounded-xl shadow-md"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>Join Telegram Channel</span>
            </a>
          </div>

        </div>
      )}
    </header>
  );
}
