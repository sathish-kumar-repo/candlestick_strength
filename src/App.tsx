import { useState, useEffect } from "react";
import {
  BarChart3,
  Shuffle,
  Download,
  Share,
  Settings as SettingsIcon,
  History as HistoryIcon,
} from "lucide-react";
import { CandlestickInput } from "./components/CandlestickInput";
import { CandlestickVisualization } from "./components/CandlestickVisualization";
import { ComparisonResults } from "./components/ComparisonResults";
import { SettingsPanel } from "./components/SettingsPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import {
  CandlestickData,
  ComparisonResult,
  AppSettings,
  ComparisonHistory,
} from "./types/candlestick";
import {
  compareCandlesticks,
  generateSampleCandlestick,
  createLinkedCandle,
  identifyCandlestickPattern,
} from "./utils/candlestickAnalysis";
import {
  saveComparisonToHistory,
  getComparisonHistory,
  clearComparisonHistory,
  saveAppSettings,
  getAppSettings,
} from "./utils/localStorage";

function App() {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [history, setHistory] = useState<ComparisonHistory[]>(
    getComparisonHistory()
  );
  const [showSettings, setShowSettings] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [firstCandle, setFirstCandle] = useState<CandlestickData>(() => {
    const candle = generateSampleCandlestick("Candle A", settings.basePrice);
    candle.patternName = identifyCandlestickPattern(candle);
    return candle;
  });

  const [secondCandle, setSecondCandle] = useState<CandlestickData>(() => {
    const candle = settings.autoLinkCandles
      ? createLinkedCandle(firstCandle, "Linked Candle B")
      : generateSampleCandlestick("Candle B", settings.basePrice);
    candle.patternName = identifyCandlestickPattern(candle);
    return candle;
  });

  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setFirstCandle((prev) => ({
      ...prev,
      patternName: identifyCandlestickPattern(prev),
    }));
  }, [firstCandle.open, firstCandle.high, firstCandle.low, firstCandle.close]);

  useEffect(() => {
    setSecondCandle((prev) => ({
      ...prev,
      patternName: identifyCandlestickPattern(prev),
    }));
  }, [
    secondCandle.open,
    secondCandle.high,
    secondCandle.low,
    secondCandle.close,
  ]);

  useEffect(() => {
    if (settings.autoLinkCandles) {
      setSecondCandle((prev) => ({
        ...prev,
        open: firstCandle.close,
      }));
    }
  }, [firstCandle.close, settings.autoLinkCandles]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(true);
      setTimeout(() => {
        const result = compareCandlesticks(
          firstCandle,
          secondCandle,
          settings.includeVolume
        );
        setComparison(result);
        setIsAnalyzing(false);

        const historyItem: ComparisonHistory = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          firstCandle,
          secondCandle,
          result,
          includeVolume: settings.includeVolume,
        };
        saveComparisonToHistory(historyItem);
        setHistory(getComparisonHistory());
      }, 800);
    }, 300);

    return () => clearTimeout(timer);
  }, [firstCandle, secondCandle, settings.includeVolume]);

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  const generateRandomPair = () => {
    const newFirstCandle = generateSampleCandlestick(
      "Random Candle A",
      settings.basePrice
    );
    newFirstCandle.patternName = identifyCandlestickPattern(newFirstCandle);
    setFirstCandle(newFirstCandle);

    const newSecondCandle = settings.autoLinkCandles
      ? createLinkedCandle(newFirstCandle, "Random Candle B")
      : generateSampleCandlestick("Random Candle B", settings.basePrice);
    newSecondCandle.patternName = identifyCandlestickPattern(newSecondCandle);
    setSecondCandle(newSecondCandle);
  };

  const exportResults = () => {
    if (!comparison) return;

    const data = {
      timestamp: new Date().toISOString(),
      settings,
      candles: {
        first: firstCandle,
        second: secondCandle,
      },
      comparison,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candlestick-comparison.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!comparison || !navigator.share) return;

    const currentWinner = settings.includeVolume
      ? comparison.winner
      : comparison.winnerWithoutVolume;
    const winner =
      currentWinner === "tie"
        ? "Tie"
        : currentWinner === "first"
        ? firstCandle.name
        : secondCandle.name;

    try {
      await navigator.share({
        title: "Candlestick Strength Comparison",
        text: `Comparison Result: ${winner} wins! ${firstCandle.name} vs ${
          secondCandle.name
        } (${settings.includeVolume ? "with" : "without"} volume analysis)`,
      });
    } catch {
      const text = `Candlestick Strength Comparison\nWinner: ${winner}\n${
        firstCandle.name
      } vs ${secondCandle.name}\nAnalysis: ${
        settings.includeVolume ? "With" : "Without"
      } Volume`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleClearHistory = () => {
    clearComparisonHistory();
    setHistory([]);
  };

  const handleLoadComparison = (item: ComparisonHistory) => {
    setFirstCandle(item.firstCandle);
    setSecondCandle(item.secondCandle);
    setSettings((prev) => ({ ...prev, includeVolume: item.includeVolume }));
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Candlestick Strength Analyzer
                </h1>
                <p className="text-sm text-neutral-400">
                  Compare and analyze trading candlestick patterns with advanced
                  metrics
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  showHistory
                    ? "bg-purple-900 text-purple-200"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                <HistoryIcon className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  showSettings
                    ? "bg-blue-900 text-blue-200"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              <button
                onClick={generateRandomPair}
                className="flex items-center space-x-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors duration-200 text-sm"
              >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Random</span>
              </button>

              {comparison && (
                <>
                  <button
                    onClick={exportResults}
                    className="flex items-center space-x-2 px-3 py-2 bg-emerald-900 text-emerald-300 hover:bg-emerald-800 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>

                  <button
                    onClick={shareResults}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-900 text-blue-300 hover:bg-blue-800 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Share className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {showSettings && (
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          )}
          {showHistory && (
            <HistoryPanel
              history={history}
              onClearHistory={handleClearHistory}
              onLoadComparison={handleLoadComparison}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CandlestickInput
            candle={firstCandle}
            onUpdate={setFirstCandle}
            title="First Candlestick"
            color="bg-emerald-500"
            basePrice={settings.basePrice}
            onBasePriceApply={() => {}}
          />
          <CandlestickInput
            candle={secondCandle}
            onUpdate={setSecondCandle}
            title="Second Candlestick"
            color="bg-blue-500"
            basePrice={settings.basePrice}
            onBasePriceApply={() => {}}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CandlestickVisualization
            candle={firstCandle}
            title="First Candlestick"
            color="bg-emerald-500"
          />
          <CandlestickVisualization
            candle={secondCandle}
            title="Second Candlestick"
            color="bg-blue-500"
          />
        </div>

        {isAnalyzing && (
          <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-neutral-700 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
              <span className="text-neutral-300">
                Analyzing candlestick strength...
              </span>
            </div>
          </div>
        )}

        {comparison && !isAnalyzing && (
          <ComparisonResults
            comparison={comparison}
            firstCandleName={firstCandle.name}
            secondCandleName={secondCandle.name}
            includeVolume={settings.includeVolume}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-neutral-900/50 border-t border-neutral-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-neutral-400">
              Professional candlestick pattern analysis tool with advanced
              strength metrics
            </div>
            <div className="flex items-center space-x-4 text-xs text-neutral-500">
              <span>Body Strength</span>
              <span>•</span>
              <span>Pattern Recognition</span>
              <span>•</span>
              <span>Volume Analysis</span>
              <span>•</span>
              <span>Historical Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
