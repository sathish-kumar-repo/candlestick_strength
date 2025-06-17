import React, { useState } from "react";
import { CandlestickData } from "../types/candlestick";

interface CandlestickVisualizationProps {
  candle: CandlestickData;
  color: string;
  title: string;
}

export const CandlestickVisualization: React.FC<
  CandlestickVisualizationProps
> = ({ candle, color, title }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { open, high, low, close } = candle;
  const range = high - low;
  const bodyTop = Math.max(open, close);
  const bodyHeight = Math.abs(close - open);

  const getY = (price: number) => {
    if (range === 0) return 150;
    return ((high - price) / range) * 200 + 50;
  };

  const isBullish = close > open;
  const candleColor = isBullish
    ? "stroke-emerald-500 fill-emerald-500"
    : "stroke-red-500 fill-red-500";
  const fillOpacity = isBullish ? 0 : 1;

  return (
    <div
      className="bg-neutral-950 text-white rounded-xl p-6 shadow-lg border border-neutral-800 hover:shadow-xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${color}`}></div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isBullish
              ? "bg-emerald-900 text-emerald-300"
              : "bg-red-900 text-red-300"
          }`}
        >
          {isBullish ? "Bullish" : "Bearish"}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 200 300"
          className={`w-full h-64 transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
        >
          {/* Background grid */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#1f2937"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="200" height="300" fill="url(#grid)" />

          {/* High-Low line */}
          <line
            x1="100"
            y1={getY(high)}
            x2="100"
            y2={getY(low)}
            className={candleColor}
            strokeWidth="2"
          />

          {/* Candlestick body */}
          <rect
            x="80"
            y={getY(bodyTop)}
            width="40"
            height={range === 0 ? 2 : Math.max((bodyHeight / range) * 200, 2)}
            className={candleColor}
            fillOpacity={fillOpacity}
            strokeWidth="2"
            rx="2"
          />

          {/* Price labels */}
          <text
            x="130"
            y={getY(high) + 5}
            className="text-xs fill-neutral-400"
            fontSize="10"
          >
            H: ${high.toFixed(2)}
          </text>
          <text
            x="130"
            y={getY(low) + 5}
            className="text-xs fill-neutral-400"
            fontSize="10"
          >
            L: ${low.toFixed(2)}
          </text>
          <text
            x="130"
            y={getY(open) + 5}
            className="text-xs fill-neutral-400"
            fontSize="10"
          >
            O: ${open.toFixed(2)}
          </text>
          <text
            x="130"
            y={getY(close) + 5}
            className="text-xs fill-neutral-400"
            fontSize="10"
          >
            C: ${close.toFixed(2)}
          </text>
        </svg>

        {/* Stats overlay */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-neutral-300">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Range:</span>
              <span className="font-medium">${range.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Body:</span>
              <span className="font-medium">${bodyHeight.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Change:</span>
              <span
                className={`font-medium ${
                  isBullish ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isBullish ? "+" : ""}
                {(((close - open) / open) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Volume:</span>
              <span className="font-medium">
                {(candle.volume / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
