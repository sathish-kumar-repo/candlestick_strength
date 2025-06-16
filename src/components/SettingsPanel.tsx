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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Analysis Settings
        </h3>
      </div>

      <div className="space-y-6">
        {/* Include Volume Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Include Volume in Analysis
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Factor in volume when calculating strength
            </p>
          </div>
          <button
            onClick={() => handleToggle("includeVolume")}
            className={`flex items-center p-1 rounded-full transition-colors duration-200 ${
              settings.includeVolume ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            {settings.includeVolume ? (
              <ToggleRight className="w-6 h-6 text-white" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Auto-Link Candles Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Auto-Link Candles
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Second candle opens at first candle's close
            </p>
          </div>
          <button
            onClick={() => handleToggle("autoLinkCandles")}
            className={`flex items-center p-1 rounded-full transition-colors duration-200 ${
              settings.autoLinkCandles ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            {settings.autoLinkCandles ? (
              <ToggleRight className="w-6 h-6 text-white" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Base Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Base Price
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.basePrice}
            onChange={(e) => handleBasePriceChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter base price"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used as reference for set initial price and generating random
            candlesticks
          </p>
        </div>
      </div>
    </div>
  );
};
