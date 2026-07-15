/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  joinedDate: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isLocked: boolean;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  lessons: Lesson[];
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  price: number;
  category: "Forex" | "Crypto" | "Indices" | "Risk Management" | "Price Action" | "Smart Money Concepts";
  enrolledCount: number;
  progress?: number; // 0 to 100, present if enrolled
}

export interface TradingSignal {
  id: string;
  pair: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  risk: "Low" | "Medium" | "High";
  direction: "BUY" | "SELL";
  status: "ACTIVE" | "HIT TP" | "HIT SL" | "CLOSED";
  winRate: number;
  timestamp: string;
  comment?: string;
}

export interface MentorshipSlot {
  id: string;
  mentorName: string;
  date: string;
  time: string;
  status: "available" | "booked";
  topic: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: "Market Analysis" | "Trading Psychology" | "Forex Tips" | "Crypto Analysis";
  image: string;
  views: number;
  likes: number;
  comments: Comment[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Courses" | "Signals" | "Payments" | "Mentorship";
}

export interface JournalEntry {
  id: string;
  date: string;
  pair: string;
  direction: "BUY" | "SELL";
  entry: number;
  exit: number;
  size: number;
  profit: number; // Positive or negative
  notes: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "pending";
  plan: string;
  date: string;
  invoiceId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "signal" | "course" | "live" | "payment" | "general";
  read: boolean;
}
