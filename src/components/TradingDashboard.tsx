/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  Activity, 
  Percent, 
  AlertTriangle 
} from "lucide-react";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  isBullish: boolean;
}

export default function TradingDashboard() {
  const [activePair, setActivePair] = useState("EUR/USD");
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [priceChange, setPriceChange] = useState(0.0035);
  const [priceChangePct, setPriceChangePct] = useState(0.32);
  const [winRate, setWinRate] = useState(86.5);
  const [tradeProfit, setTradeProfit] = useState(4820);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [riskValue, setRiskValue] = useState(45); // 0 to 100 risk score
  const [activeSignals, setActiveSignals] = useState<{ type: string; price: number; time: string }[]>([
    { type: "BUY", price: 1.0820, time: "09:45" },
    { type: "SELL", price: 1.0890, time: "11:20" }
  ]);

  const currencyPairs = [
    { name: "EUR/USD", basePrice: 1.0850, step: 0.0001 },
    { name: "BTC/USD", basePrice: 89650, step: 12.5 },
    { name: "XAU/USD (Gold)", basePrice: 2345.5, step: 0.25 },
    { name: "GBP/JPY", basePrice: 198.20, step: 0.015 }
  ];

  // Initialize Candle list once
  useEffect(() => {
    generateInitialCandles(activePair);
  }, [activePair]);

  // Handle live tick fluctuations
  useEffect(() => {
    const pairConfig = currencyPairs.find(p => p.name === activePair) || currencyPairs[0];
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const up = Math.random() > 0.48; // slightly bullish drift
        const deviation = (Math.random() * pairConfig.step);
        const nextPrice = up ? prev + deviation : prev - deviation;
        
        // Update price change & percent
        const diff = nextPrice - pairConfig.basePrice;
        setPriceChange(diff);
        setPriceChangePct((diff / pairConfig.basePrice) * 100);

        // Update the last candle
        setCandles(prevCandles => {
          if (prevCandles.length === 0) return prevCandles;
          const copy = [...prevCandles];
          const last = { ...copy[copy.length - 1] };
          
          last.close = nextPrice;
          if (nextPrice > last.high) last.high = nextPrice;
          if (nextPrice < last.low) last.low = nextPrice;
          last.isBullish = last.close >= last.open;
          
          copy[copy.length - 1] = last;
          return copy;
        });

        // Slow updates for other indicators
        if (Math.random() > 0.85) {
          setWinRate(r => Math.min(94, Math.max(78, r + (Math.random() - 0.5) * 1.5)));
          setTradeProfit(p => Math.round(p + (Math.random() - 0.45) * 200));
          setRiskValue(rv => Math.min(95, Math.max(10, rv + Math.floor((Math.random() - 0.5) * 10))));
        }

        return nextPrice;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [activePair]);

  const generateInitialCandles = (pairName: string) => {
    const pairConfig = currencyPairs.find(p => p.name === pairName) || currencyPairs[0];
    let price = pairConfig.basePrice - (10 * pairConfig.step);
    const initialList: Candle[] = [];

    const times = ["08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45"];
    
    times.forEach((t) => {
      const open = price;
      const isBull = Math.random() > 0.45;
      const change = (Math.random() * 5 * pairConfig.step);
      const close = isBull ? open + change : open - change;
      const high = Math.max(open, close) + (Math.random() * 2 * pairConfig.step);
      const low = Math.min(open, close) - (Math.random() * 2 * pairConfig.step);
      
      initialList.push({
        time: t,
        open,
        high,
        low,
        close,
        isBullish: close >= open
      });
      price = close;
    });

    setCandles(initialList);
    setCurrentPrice(price);
  };

  const formattedPrice = (price: number) => {
    if (price > 1000) {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-6 relative overflow-hidden flex flex-col">
      
      {/* Selector and Live status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-5">
        <div className="flex flex-wrap gap-1.5">
          {currencyPairs.map((pair) => (
            <button
              key={pair.name}
              onClick={() => setActivePair(pair.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activePair === pair.name
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-gray-50 hover:bg-gray-100/80 text-gray-600"
              }`}
            >
              {pair.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-gray-400 block font-mono">Live Price</span>
            <span className="text-xl font-bold font-mono text-gray-900">
              {formattedPrice(currentPrice)}
            </span>
          </div>

          <div className={`px-2.5 py-1 rounded-xl text-xs font-semibold font-mono flex items-center ${
            priceChange >= 0 
              ? "bg-emerald-50 text-emerald-700" 
              : "bg-rose-50 text-rose-700"
          }`}>
            {priceChange >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            {priceChange >= 0 ? "+" : ""}{priceChangePct.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Grid of Chart and Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Candlestick Visualizer */}
        <div className="lg:col-span-2 bg-gray-50/60 rounded-2xl p-4 border border-gray-100/60 flex flex-col justify-between h-72">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
            <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1.5 text-blue-500 animate-pulse" /> 15M Timeframe</span>
            <span>Bash Institutional Feed</span>
          </div>

          {/* Candle Bars Graphic container */}
          <div className="flex items-end justify-between h-48 px-2 relative">
            
            {/* Absolute indicator flags */}
            <div className="absolute top-4 left-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono flex items-center animate-bounce">
              <Zap className="w-2.5 h-2.5 mr-1" /> BUY FLAG ACTIVATED (BOA-89)
            </div>

            {candles.map((candle, idx) => {
              const maxVal = Math.max(...candles.map(c => c.high));
              const minVal = Math.min(...candles.map(c => c.low));
              const range = maxVal - minVal || 1;
              
              // Heights relative to range
              const bodyTop = ((Math.max(candle.open, candle.close) - minVal) / range) * 100;
              const bodyBottom = ((Math.min(candle.open, candle.close) - minVal) / range) * 100;
              const bodyHeight = Math.max(4, bodyTop - bodyBottom);
              const wickTop = ((candle.high - minVal) / range) * 100;
              const wickBottom = ((candle.low - minVal) / range) * 100;

              return (
                <div key={idx} className="flex flex-col items-center flex-1 h-full relative group">
                  {/* Candle Wick (Line) */}
                  <div 
                    className={`absolute w-[1.5px] ${candle.isBullish ? "bg-emerald-400" : "bg-rose-400"}`}
                    style={{
                      bottom: `${wickBottom}%`,
                      top: `${100 - wickTop}%`
                    }}
                  />
                  {/* Candle Body */}
                  <div 
                    className={`absolute w-3 sm:w-4 rounded-sm transition-all duration-200 shadow-sm ${
                      candle.isBullish 
                        ? "bg-gradient-to-t from-emerald-500 to-emerald-400 border border-emerald-500/25" 
                        : "bg-gradient-to-t from-rose-500 to-rose-400 border border-rose-500/25"
                    }`}
                    style={{
                      bottom: `${bodyBottom}%`,
                      height: `${bodyHeight}%`
                    }}
                  />
                  {/* Hover tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-900 text-white rounded-lg p-2 text-[10px] leading-tight z-20 font-mono transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                    <div>Open: {formattedPrice(candle.open)}</div>
                    <div>Close: {formattedPrice(candle.close)}</div>
                    <div>High: {formattedPrice(candle.high)}</div>
                    <div>Low: {formattedPrice(candle.low)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-2 pt-2 border-t border-gray-100/60">
            <span>08:00 AM</span>
            <span>09:30 AM</span>
            <span>10:45 AM (UTC)</span>
          </div>
        </div>

        {/* Widgets Panel */}
        <div className="space-y-4">
          
          {/* Win rate indicator */}
          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/20 border border-blue-50 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide block font-mono">Accuracy Gauge</span>
              <span className="text-xl font-bold text-gray-900">BOA Win Rate</span>
              <p className="text-xs text-gray-500 leading-none mt-0.5">Verified average signals success</p>
            </div>
            
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="4.5" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="#2563eb" 
                  strokeWidth="4.5" 
                  fill="transparent" 
                  strokeDasharray={175} 
                  strokeDashoffset={175 - (175 * winRate) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-xs font-bold font-mono text-blue-700">{winRate.toFixed(1)}%</span>
            </div>
          </div>

          {/* Risk Level gauge */}
          <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-700 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-500" /> Setup Risk Meter
              </span>
              <span className={`font-bold font-mono ${
                riskValue > 70 ? "text-rose-600" : riskValue > 35 ? "text-amber-600" : "text-emerald-600"
              }`}>
                {riskValue > 70 ? "HIGH" : riskValue > 35 ? "STABLE" : "CONSERVATIVE"}
              </span>
            </div>
            {/* Slide bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  riskValue > 70 
                    ? "bg-rose-500" 
                    : riskValue > 35 
                    ? "bg-amber-500" 
                    : "bg-emerald-500"
                }`}
                style={{ width: `${riskValue}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 font-mono">
              <span>0% LOW</span>
              <span>SMC ENTRY</span>
              <span>100% EXTREME</span>
            </div>
          </div>

          {/* Profit Growth Tracker */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">Student Profits Simulated</span>
              <span className="text-xl font-bold text-emerald-600 font-mono">
                +${tradeProfit.toLocaleString("en-US")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
