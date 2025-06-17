import React from "react";
import { Settings, ToggleLeft, ToggleRight, DollarSign } from "lucide-react";
import { AppSettings } from "../types/candlestick";

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  const handleToggle = (key: keyof AppSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleBasePriceChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onSettingsChange({
      ...settings,
      basePrice: numValue,
    });
  };

  return (
    <div className="bg-neutral-950 text-white rounded-xl p-6 shadow-lg border border-neutral-800">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-5 h-5 text-neutral-400" />
        <h3 className="text-lg font-semibold text-white">Analysis Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Include Volume Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">
              Include Volume in Analysis
            </label>
            <p className="text-xs text-neutral-400 mt-1">
              Factor in volume when calculating strength
            </p>
          </div>
          <button
            onClick={() => handleToggle("includeVolume")}
            className={`flex items-center p-1 rounded-full transition-colors duration-200 ${
              settings.includeVolume ? "bg-emerald-500" : "bg-neutral-700"
            }`}
          >
            {settings.includeVolume ? (
              <ToggleRight className="w-6 h-6 text-white" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-neutral-400" />
            )}
          </button>
        </div>

        {/* Auto-Link Candles Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">
              Auto-Link Candles
            </label>
            <p className="text-xs text-neutral-400 mt-1">
              Second candle opens at first candle's close
            </p>
          </div>
          <button
            onClick={() => handleToggle("autoLinkCandles")}
            className={`flex items-center p-1 rounded-full transition-colors duration-200 ${
              settings.autoLinkCandles ? "bg-emerald-500" : "bg-neutral-700"
            }`}
          >
            {settings.autoLinkCandles ? (
              <ToggleRight className="w-6 h-6 text-white" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-neutral-400" />
            )}
          </button>
        </div>

        {/* Base Price Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Base Price
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.basePrice}
            onChange={(e) => handleBasePriceChange(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-900 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter base price"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Used as reference for set initial price and generating random
            candlesticks
          </p>
        </div>
      </div>
    </div>
  );
};
