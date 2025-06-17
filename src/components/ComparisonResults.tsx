import React from "react";
import {
  Trophy,
  TrendingUp,
  BarChart,
  Activity,
  Volume2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { ComparisonResult } from "../types/candlestick";

interface ComparisonResultsProps {
  comparison: ComparisonResult;
  firstCandleName: string;
  secondCandleName: string;
  includeVolume: boolean;
}

export const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  comparison,
  firstCandleName,
  secondCandleName,
  includeVolume,
}) => {
  const {
    winner,
    winnerWithoutVolume,
    metrics,
    advantages,
    advantagesWithoutVolume,
  } = comparison;

  const currentWinner = includeVolume ? winner : winnerWithoutVolume;
  const currentAdvantages = includeVolume
    ? advantages
    : advantagesWithoutVolume;

  const getWinnerInfo = () => {
    switch (currentWinner) {
      case "first":
        return {
          name: firstCandleName,
          color: "text-emerald-400",
          bgColor: "bg-emerald-900/40",
          borderColor: "border-emerald-800",
        };
      case "second":
        return {
          name: secondCandleName,
          color: "text-blue-400",
          bgColor: "bg-blue-900/40",
          borderColor: "border-blue-800",
        };
      default:
        return {
          name: "Tie",
          color: "text-neutral-400",
          bgColor: "bg-neutral-800/50",
          borderColor: "border-neutral-700",
        };
    }
  };

  const winnerInfo = getWinnerInfo();

  const MetricBar: React.FC<{
    label: string;
    first: number;
    second: number;
    icon: React.ElementType;
    showVolume?: boolean;
  }> = ({ label, first, second, icon: Icon, showVolume = true }) => {
    if (!includeVolume && !showVolume) return null;

    const maxValue = Math.max(first, second, 1);
    const firstWidth = (first / maxValue) * 100;
    const secondWidth = (second / maxValue) * 100;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-20 text-xs text-neutral-400 truncate">
              {firstCandleName}
            </div>
            <div className="flex-1 bg-neutral-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${firstWidth}%` }}
              ></div>
            </div>
            <div className="w-12 text-xs text-right font-medium text-white">
              {first.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20 text-xs text-neutral-400 truncate">
              {secondCandleName}
            </div>
            <div className="flex-1 bg-neutral-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${secondWidth}%` }}
              ></div>
            </div>
            <div className="w-12 text-xs text-right font-medium text-white">
              {second.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-neutral-950 text-white rounded-xl p-6 shadow-lg border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-white">Strength Comparison</h3>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <span className="text-neutral-400">Volume Analysis:</span>
          {includeVolume ? (
            <div className="flex items-center space-x-1 text-emerald-400">
              <ToggleRight className="w-4 h-4" />
              <span>ON</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-neutral-500">
              <ToggleLeft className="w-4 h-4" />
              <span>OFF</span>
            </div>
          )}
        </div>
      </div>

      {/* Winner announcement */}
      <div
        className={`${winnerInfo.bgColor} ${winnerInfo.borderColor} border rounded-lg p-4 mb-6`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Trophy className={`w-5 h-5 ${winnerInfo.color}`} />
          <span className={`text-lg font-bold ${winnerInfo.color}`}>
            {currentWinner === "tie"
              ? "It's a Tie!"
              : `${winnerInfo.name} Wins!`}
          </span>
        </div>
        {currentWinner !== "tie" && (
          <div className="text-center text-sm text-neutral-400 mt-1">
            Overall Strength:{" "}
            {currentWinner === "first"
              ? (includeVolume
                  ? metrics.first.overallStrength
                  : metrics.first.overallStrengthWithoutVolume
                ).toFixed(1)
              : (includeVolume
                  ? metrics.second.overallStrength
                  : metrics.second.overallStrengthWithoutVolume
                ).toFixed(1)}
          </div>
        )}
      </div>

      {/* Detailed metrics */}
      <div className="space-y-6">
        <MetricBar
          label="Body Strength (%)"
          first={metrics.first.bodyStrength}
          second={metrics.second.bodyStrength}
          icon={BarChart}
        />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BarChart className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-medium text-white">
              Absolute Body Size ($)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-emerald-900/30 p-3 rounded-lg">
              <div className="font-medium text-emerald-300">
                {firstCandleName}
              </div>
              <div className="text-emerald-400">
                ${metrics.first.bodySize.toFixed(5)}
              </div>
            </div>
            <div className="bg-blue-900/30 p-3 rounded-lg">
              <div className="font-medium text-blue-300">
                {secondCandleName}
              </div>
              <div className="text-blue-400">
                ${metrics.second.bodySize.toFixed(5)}
              </div>
            </div>
          </div>
        </div>

        <MetricBar
          label="Momentum (%)"
          first={metrics.first.momentum}
          second={metrics.second.momentum}
          icon={TrendingUp}
        />
        <MetricBar
          label="Volatility (%)"
          first={metrics.first.volatility}
          second={metrics.second.volatility}
          icon={Activity}
        />

        {includeVolume && (
          <MetricBar
            label="Volume Strength"
            first={metrics.first.volumeStrength}
            second={metrics.second.volumeStrength}
            icon={Volume2}
            showVolume={true}
          />
        )}
      </div>

      {/* Advantages */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-emerald-400 mb-2">
            {firstCandleName} Advantages
          </h4>
          <ul className="space-y-1">
            {currentAdvantages.first.map((advantage, index) => (
              <li
                key={index}
                className="text-sm text-neutral-300 flex items-start space-x-1"
              >
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{advantage}</span>
              </li>
            ))}
            {currentAdvantages.first.length === 0 && (
              <li className="text-sm text-neutral-500">
                No significant advantages
              </li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-blue-400 mb-2">
            {secondCandleName} Advantages
          </h4>
          <ul className="space-y-1">
            {currentAdvantages.second.map((advantage, index) => (
              <li
                key={index}
                className="text-sm text-neutral-300 flex items-start space-x-1"
              >
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{advantage}</span>
              </li>
            ))}
            {currentAdvantages.second.length === 0 && (
              <li className="text-sm text-neutral-500">
                No significant advantages
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Comparison Summary */}
      <div className="mt-6 p-4 bg-neutral-800/60 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Analysis Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-400">
          <div>
            <span>With Volume:</span>
            <span
              className={`ml-2 font-medium ${
                winner === "first"
                  ? "text-emerald-400"
                  : winner === "second"
                  ? "text-blue-400"
                  : "text-neutral-400"
              }`}
            >
              {winner === "first"
                ? firstCandleName
                : winner === "second"
                ? secondCandleName
                : "Tie"}
            </span>
          </div>
          <div>
            <span>Without Volume:</span>
            <span
              className={`ml-2 font-medium ${
                winnerWithoutVolume === "first"
                  ? "text-emerald-400"
                  : winnerWithoutVolume === "second"
                  ? "text-blue-400"
                  : "text-neutral-400"
              }`}
            >
              {winnerWithoutVolume === "first"
                ? firstCandleName
                : winnerWithoutVolume === "second"
                ? secondCandleName
                : "Tie"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
