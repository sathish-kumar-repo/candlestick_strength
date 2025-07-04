import React, { useState } from "react";
import { History, Trash2, Eye, Calendar, TrendingUp } from "lucide-react";
import { ComparisonHistory } from "../types/candlestick";

interface HistoryPanelProps {
  history: ComparisonHistory[];
  onClearHistory: () => void;
  onLoadComparison: (item: ComparisonHistory) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onLoadComparison,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    return (
      <div className="bg-neutral-950 text-white rounded-xl p-6 shadow-lg border border-neutral-800">
        <div className="flex items-center space-x-3 mb-4">
          <History className="w-5 h-5 text-neutral-400" />
          <h3 className="text-lg font-semibold text-white">
            Comparison History
          </h3>
        </div>
        <p className="text-neutral-500 text-sm">
          No comparisons saved yet. Start analyzing candlesticks to build your
          history.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 text-white rounded-xl p-6 shadow-lg border border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <History className="w-5 h-5 text-neutral-400" />
          <h3 className="text-lg font-semibold text-white">
            Comparison History
          </h3>
          <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded-full">
            {history.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={onClearHistory}
            className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            title="Clear all history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {(isExpanded ? history : history.slice(0, 3)).map((item) => {
          const winner = item.includeVolume
            ? item.result.winner
            : item.result.winnerWithoutVolume;
          const winnerName =
            winner === "first"
              ? item.firstCandle.name
              : winner === "second"
              ? item.secondCandle.name
              : "Tie";

          return (
            <div
              key={item.id}
              className="border border-neutral-800 rounded-lg p-4 hover:bg-neutral-900 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-400">
                      {item.timestamp.toLocaleDateString()}{" "}
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.includeVolume
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {item.includeVolume ? "With Volume" : "No Volume"}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-white">
                      {item.firstCandle.name}
                    </span>
                    <span className="text-neutral-500 mx-2">vs</span>
                    <span className="font-medium text-white">
                      {item.secondCandle.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">
                      Winner: {winnerName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onLoadComparison(item)}
                  className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                  title="Load this comparison"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {!isExpanded && history.length > 3 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-center text-sm text-neutral-400 hover:text-white py-2 transition-colors"
          >
            Show {history.length - 3} more...
          </button>
        )}
      </div>
    </div>
  );
};
