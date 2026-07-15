/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Star, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle, 
  X, 
  CreditCard, 
  ShieldCheck, 
  PlayCircle 
} from "lucide-react";
import { Course, User } from "../types";

interface CoursesViewProps {
  user: User | null;
  courses: Course[];
  onEnroll: (courseId: string) => void;
  onNavigate: (route: string) => void;
  onOpenLogin: () => void;
  fetchCourses: () => void;
}

export default function CoursesView({
  user,
  courses,
  onEnroll,
  onNavigate,
  onOpenLogin,
  fetchCourses
}: CoursesViewProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Checkout Modal State
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<"stripe" | "paystack" | "flutterwave">("stripe");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const categories = ["All", "Forex", "Smart Money Concepts", "Crypto", "Risk Management"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (!checkoutCourse) return;

    setIsProcessing(true);
    
    // Simulate API delay for premium fintech experience
    setTimeout(async () => {
      try {
        const res = await fetch("/api/courses/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            courseId: checkoutCourse.id,
            paymentMethod: paymentGateway
          })
        });

        if (res.ok) {
          setPaymentSuccess(true);
          onEnroll(checkoutCourse.id);
          fetchCourses();
        } else {
          alert("Payment session could not be established.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const closeCheckout = () => {
    setCheckoutCourse(null);
    setPaymentSuccess(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setMobilePhone("");
  };

  return (
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page title and intro */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Elite Trading Academy
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Zero fluff. Real institutional charts. Master SMC strategies, advanced risk management models, and live trading sessions. Enroll in a class below and claim your funded potential.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/60">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-white hover:bg-gray-100/80 text-gray-600 border border-gray-200/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search academy courses..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 font-mono text-sm">
              No courses match your query or selection.
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isEnrolled = course.progress !== undefined;
              return (
                <div 
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  
                  {/* Mock Cover Visual Placeholder styled beautifully */}
                  <div className="h-44 bg-gradient-to-tr from-blue-500 via-indigo-600 to-blue-700 p-6 flex flex-col justify-between relative text-white">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/20 backdrop-blur-md self-start">
                      {course.level}
                    </span>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-blue-100 tracking-wider">
                        {course.category}
                      </span>
                      <h3 className="font-extrabold text-lg line-clamp-1 group-hover:text-blue-50 transition-colors">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 border-y border-gray-50 py-3 text-center text-[11px] font-medium text-gray-400 font-mono">
                      <div>
                        <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-blue-500" />
                        {course.duration}
                      </div>
                      <div>
                        <Star className="w-3.5 h-3.5 mx-auto mb-1 text-amber-500 fill-amber-500" />
                        {course.rating.toFixed(1)} / 5.0
                      </div>
                      <div>
                        <Users className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-500" />
                        {course.enrolledCount} joined
                      </div>
                    </div>

                    {/* Progress representation if enrolled */}
                    {isEnrolled ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-600">Course Progress</span>
                          <span className="font-mono text-blue-600 font-bold">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Class Instructor</span>
                        <span className="text-xs font-semibold text-gray-800">{course.instructor}</span>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2">
                      {!isEnrolled ? (
                        <>
                          <span className="text-lg font-extrabold text-gray-900 font-mono">
                            ₦{course.price.toLocaleString()}
                          </span>
                          <button
                            id={`enroll-btn-${course.id}`}
                            onClick={() => {
                              setCheckoutCourse(course);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-50 transition-all transform active:scale-95"
                          >
                            Enroll Now
                          </button>
                        </>
                      ) : (
                        <button
                          id={`continue-learning-btn-${course.id}`}
                          onClick={() => onNavigate("dashboard")}
                          className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-blue-600 border border-gray-100 text-xs font-bold flex items-center justify-center space-x-1.5"
                        >
                          <PlayCircle className="w-4 h-4 text-blue-500" />
                          <span>Continue Learning</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Custom Selar & Telegram Redirection Modal */}
        {checkoutCourse && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-250">
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-blue-100 block">SELAR SECURE CHECKOUT</span>
                  <h3 className="text-lg font-extrabold">{checkoutCourse.title}</h3>
                  <p className="text-xs text-blue-100 mt-1">Hosted on Telegram Private Channel</p>
                </div>
                <button onClick={closeCheckout} className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {paymentSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-900 text-lg">Enrolled Successfully!</h4>
                      <p className="text-xs text-gray-500">
                        We have opened your secure checkout window on Selar. After payment is completed, you will be added to the Telegram training channel.
                      </p>
                      <p className="text-xs text-blue-600 font-semibold mt-2">
                        We have also unlocked the local curriculum player on this portal for you!
                      </p>
                    </div>
                    <div className="pt-2 space-y-2">
                      <a
                        href="https://t.me/bashonair"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>Join Telegram Channel</span>
                      </a>
                      <button
                        onClick={() => {
                          closeCheckout();
                          onNavigate("dashboard");
                        }}
                        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        Explore Curriculum Player
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl space-y-2">
                      <h4 className="font-bold text-xs text-blue-800">📌 Interactive Telegram Course</h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        Our premium masterclasses, live charting webinars, and mentorship resources are hosted directly inside our VIP Telegram training group. 
                      </p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        To claim lifetime access and receive your automated invitation link, please purchase access via Selar.
                      </p>
                    </div>

                    {/* Price Tag */}
                    <div className="flex justify-between items-center bg-gray-50 px-4 py-3.5 rounded-2xl border border-gray-100/50">
                      <span className="text-xs text-gray-500">Course Price Due:</span>
                      <span className="text-lg font-extrabold text-gray-900 font-mono">₦{checkoutCourse.price.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsProcessing(true);
                          // Open Selar link in new tab
                          window.open(`https://selar.co/`, "_blank");
                          
                          // Register enrollment in local database so they can play around with the mock player too!
                          try {
                            const res = await fetch("/api/courses/enroll", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                userId: user?.id || "usr_student",
                                courseId: checkoutCourse.id,
                                paymentMethod: "selar"
                              })
                            });

                            if (res.ok) {
                              setPaymentSuccess(true);
                              onEnroll(checkoutCourse.id);
                              fetchCourses();
                            }
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setIsProcessing(false);
                          }
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
                            <span>Proceed to Selar Secure Payment</span>
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
