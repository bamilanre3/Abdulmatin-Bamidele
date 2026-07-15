/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Globe
} from "lucide-react";

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Support");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !email || !message) {
      setFormError("All inputs are required.");
      return;
    }
    if (!email.includes("@")) {
      setFormError("Please provide a valid email.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Connect With Our Team
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Have questions about our Smart Money SMC masterclass, VIP signals subscription, or custom mentorship? Drop us a line. We respond in under 12 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Form Col */}
          <div className="lg:col-span-7 bg-gray-50/60 border border-gray-100 p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
            <h3 className="font-extrabold text-lg text-gray-900 mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" /> Send a direct ticket
            </h3>

            {submitSuccess ? (
              <div className="text-center py-12 space-y-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">Ticket Submitted!</h4>
                  <p className="text-xs text-gray-500 mt-1">Thank you. Your message has been safely logged in our backend system. Our trading coaches will contact you via email shortly.</p>
                </div>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
                >
                  Submit Another Question
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Trader"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Your Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Query category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Support & Assistance</option>
                    <option>SMC Academy Courses</option>
                    <option>VIP Signals Subscription</option>
                    <option>1-on-1 Mentorship Bookings</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Describe Your Query</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Provide details about what you want to achieve or any account issues..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {formError && (
                  <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Sending your message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-blue-100" />
                      <span>Submit Query Ticket</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

          {/* Right Info Col */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Contact Details Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-extrabold text-lg text-gray-900 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-indigo-600" /> Corporate Headquarters
              </h3>

              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">London Financial District</span>
                    <span>12 Old Broad St, London EC2N 1AR, United Kingdom</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">Direct Email Support</span>
                    <a href="mailto:support@bashonair.com" className="hover:underline text-blue-600">support@bashonair.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">Hotline Support</span>
                    <span>+44 20 7946 0958 (Mon-Fri, 9am - 5pm GMT)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Simulated Block */}
            <div className="h-52 bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden relative p-4 flex flex-col justify-end">
              {/* Creative grid to look like a map */}
              <div className="absolute inset-0 bg-blue-50/50 opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center animate-ping" />
                <div className="w-4 h-4 rounded-full bg-blue-600 absolute top-1 left-1 flex items-center justify-center border border-white">
                  <MapPin className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-gray-100 shadow-sm text-[10px] space-y-0.5 max-w-[200px]">
                <span className="font-bold text-gray-800 block">London HQ Office</span>
                <span className="text-gray-500">Old Broad Street, London</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
