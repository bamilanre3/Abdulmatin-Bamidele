/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  HelpCircle, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  Tv, 
  Award 
} from "lucide-react";
import { User, FAQItem } from "../types";

interface PricingViewProps {
  user: User | null;
  onOpenLogin: () => void;
  onNavigate: (route: string) => void;
}

export default function PricingView({
  user,
  onOpenLogin,
  onNavigate
}: PricingViewProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<"stripe" | "paystack" | "flutterwave">("stripe");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => setFaqs(data))
      .catch((err) => console.error(err));
  }, []);

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (!selectedPlan) return;

    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const res = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            amount: selectedPlan.price,
            plan: selectedPlan.name,
            paymentMethod: paymentGateway
          })
        });

        if (res.ok) {
          setCheckoutSuccess(true);
        } else {
          alert("Could not complete checkout.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const closeCheckout = () => {
    setSelectedPlan(null);
    setCheckoutSuccess(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setMobilePhone("");
  };

  const pricingPlans = [
    {
      id: "community",
      name: "Community Pass",
      price: 0,
      period: "forever",
      badge: "STARTER KIT",
      description: "Perfect for beginners exploring Forex principles and standard support-resistance models.",
      features: [
        "Free Intro Lessons",
        "Standard Community Chat",
        "Weekly Market Review PDF",
        "Locked VIP Signals",
      ],
      cta: "Sign Up Free",
      action: () => {
        onNavigate("dashboard");
      },
      popular: false
    },
    {
      id: "academy",
      name: "Academy Core",
      price: 150000,
      period: "lifetime",
      badge: "SMC PROFESSIONAL",
      description: "Full lifetime access to a selected elite class, course certificates, and interactive lessons player.",
      features: [
        "Lifetime Selected Course",
        "Official BOA Certificates",
        "Personal Trade Log Audits",
        "Locked VIP Signals",
      ],
      cta: "Explore Courses",
      action: () => onNavigate("academy"),
      popular: true
    },
    {
      id: "signals",
      name: "VIP Signals Monthly",
      price: 75000,
      period: "month",
      badge: "PRO ACCURACY",
      description: "Unlock complete active and historical setups with instant push alerts straight to Telegram/SMS.",
      features: [
        "Unrestricted Live Signals",
        "Instant Push Telegram Alerts",
        "SMC Macro Breakdown Charts",
        "Priority Support Channel",
      ],
      cta: "Subscribe VIP Signals",
      action: () => {
        setSelectedPlan({ name: "VIP Signals Monthly", price: 75000 });
      },
      popular: false
    }
  ];

  return (
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16 animate-fade-in">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AFFORDABLE EXCELLENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Transparent SaaS Pricing Plans
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Unlock institutional strategies with zero hidden fees. Select the pass that aligns with your funded expectations.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white p-8 rounded-3xl border flex flex-col justify-between h-[440px] relative transition-all ${
                plan.popular 
                  ? "border-2 border-blue-500 shadow-md" 
                  : "border-gray-200/60 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] font-bold tracking-wider font-mono px-2 py-0.5 rounded-full">
                  POPULAR CHOICE
                </span>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className={`text-[10px] uppercase font-bold font-mono block ${
                    plan.popular ? "text-blue-600" : "text-gray-400"
                  }`}>
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="text-3xl font-extrabold text-gray-900 font-mono">
                    ₦{plan.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ {plan.period}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">{plan.description}</p>
                
                <ul className="text-xs text-gray-600 space-y-2.5 font-sans font-medium">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle2 className={`w-4 h-4 mr-2 shrink-0 ${
                        feat.startsWith("Locked") ? "text-gray-200" : plan.popular ? "text-blue-500" : "text-indigo-500"
                      }`} />
                      <span className={feat.startsWith("Locked") ? "text-gray-400" : ""}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={plan.action}
                className={`w-full py-3 text-xs font-bold rounded-xl transition-all ${
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : plan.id === "signals"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto border-t border-gray-100 pt-16">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs uppercase font-extrabold text-blue-600 font-mono tracking-wider">CLEAR REPLIES</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm">
              Have questions about certificates, billing, or technical trading definitions? We are here to clarify.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.length === 0 ? (
              <div className="text-center text-gray-400 font-mono text-xs">Loading answers database...</div>
            ) : (
              faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-xs sm:text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2.5 text-blue-500" /> {faq.question}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Secure Checkout Dialog */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <span className="text-[10px] font-bold font-mono text-blue-100 block">SELAR SECURE GATEWAY</span>
                <h3 className="text-lg font-extrabold">{selectedPlan.name}</h3>
                <p className="text-xs text-blue-100 mt-0.5">Instant Telegram channel access</p>
              </div>

              <div className="p-6 space-y-4">
                {checkoutSuccess ? (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm font-sans">VIP Redirect Initiated!</h4>
                      <p className="text-xs text-gray-500 mt-2">
                        We have opened your secure checkout window on Selar. After payment is completed, you will be instantly added to the private Telegram signals channel!
                      </p>
                    </div>
                    <div className="pt-2">
                      <a
                        href="https://t.me/bashonair"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>Join Telegram Channel</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-2xl space-y-2">
                      <h4 className="font-bold text-xs text-indigo-800 font-sans">🔔 VIP Telegram Push Alerts</h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        To receive automated real-time trade signals, live entries, stop losses, take profits, and regular charting breakdowns, please complete your subscription on Selar.
                      </p>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-500">Amount Due:</span>
                      <span className="text-base font-extrabold text-gray-900 font-mono">₦{selectedPlan.price.toLocaleString()}</span>
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
