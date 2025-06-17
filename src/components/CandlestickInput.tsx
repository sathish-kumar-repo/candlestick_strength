import React, { useState } from "react";
import { Edit3, TrendingUp, BarChart3, Tag } from "lucide-react";
import { CandlestickData } from "../types/candlestick";

interface CandlestickInputProps {
  candle: CandlestickData;
  onUpdate: (candle: CandlestickData) => void;
  title: string;
  color: string;
  basePrice?: number;
  onBasePriceApply?: () => void;
}

export const CandlestickInput: React.FC<CandlestickInputProps> = ({
  candle,
  onUpdate,
  title,
  color,
  basePrice,
  onBasePriceApply,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof CandlestickData, value: string) => {
    const numValue = field === "name" ? value : parseFloat(value) || 0;
    onUpdate({
      ...candle,
      [field]: numValue,
    });
  };

  const applyBasePrice = () => {
    if (!basePrice || !onBasePriceApply) return;

    const volatility = 0.01;
    const priceChange = (Math.random() - 0.5) * 2 * volatility * basePrice;

    const open = basePrice;
    const close = open + priceChange;
    const range =
      Math.abs(priceChange) + Math.random() * volatility * basePrice * 0.5;
    const high = Math.max(open, close) + Math.random() * range * 0.3;
    const low = Math.min(open, close) - Math.random() * range * 0.3;

    onUpdate({
      ...candle,
      open: Math.round(open * 100000) / 100000,
      high: Math.round(high * 100000) / 100000,
      low: Math.round(low * 100000) / 100000,
      close: Math.round(close * 100000) / 100000,
    });

    onBasePriceApply();
  };

  const applyInitialPrice = () => {
    if (!basePrice || !onBasePriceApply) return;

    onUpdate({
      ...candle,
      open: basePrice,
      high: basePrice,
      low: basePrice,
      close: basePrice,
      volume: 0,
    });

    onBasePriceApply();
  };

  const inputFields = [
    { key: "open" as const, label: "Open", icon: TrendingUp },
    { key: "high" as const, label: "High", icon: BarChart3 },
    { key: "low" as const, label: "Low", icon: BarChart3 },
    { key: "close" as const, label: "Close", icon: TrendingUp },
    { key: "volume" as const, label: "Volume", icon: BarChart3 },
  ];

  return (
    <div className="bg-neutral-950 text-white backdrop-blur-sm rounded-xl p-6 shadow-lg border border-neutral-800 hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${color}`}></div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {basePrice && onBasePriceApply && (
            <>
              <button
                onClick={applyInitialPrice}
                className="px-3 py-1 text-xs bg-blue-900 hover:bg-blue-800 text-blue-200 rounded-lg transition-colors duration-200"
                title={`Apply base price $${basePrice}`}
              >
                Base: ${basePrice}
              </button>
              <button
                onClick={applyBasePrice}
                className="px-3 py-1 text-xs bg-green-900 hover:bg-green-800 text-green-200 rounded-lg transition-colors duration-200"
                title={`Apply base price $${basePrice}`}
              >
                Random
              </button>
            </>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4 text-neutral-300" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Name
        </label>
        <input
          type="text"
          value={candle.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-neutral-900 text-white transition-all duration-200"
          placeholder="Candlestick name"
        />
      </div>

      {candle.patternName && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg border border-purple-700">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-200">
              Detected Pattern:
            </span>
            <span className="text-sm font-bold text-white">
              {candle.patternName}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {inputFields.map(({ key, label, icon: Icon }) => (
          <div key={key} className="relative">
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              <Icon className="w-4 h-4 inline mr-1" />
              {label}
            </label>
            <input
              type="number"
              step="0.00001"
              value={candle[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-4 py-2 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-neutral-900 text-white transition-all duration-200"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
