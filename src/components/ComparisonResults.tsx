import React from 'react';
import { Trophy, TrendingUp, BarChart, Activity, Volume2, ToggleLeft, ToggleRight } from 'lucide-react';
import { ComparisonResult } from '../types/candlestick';

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
  includeVolume
}) => {
  const { winner, winnerWithoutVolume, metrics, advantages, advantagesWithoutVolume } = comparison;
  
  const currentWinner = includeVolume ? winner : winnerWithoutVolume;
  const currentAdvantages = includeVolume ? advantages : advantagesWithoutVolume;
  
  const getWinnerInfo = () => {
    switch (currentWinner) {
      case 'first':
        return {
          name: firstCandleName,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        };
      case 'second':
        return {
          name: secondCandleName,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          name: 'Tie',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const winnerInfo = getWinnerInfo();

  const MetricBar: React.FC<{ label: string; first: number; second: number; icon: React.ElementType; showVolume?: boolean }> = 
    ({ label, first, second, icon: Icon, showVolume = true }) => {
    
    if (!includeVolume && !showVolume) return null;
    
    const maxValue = Math.max(first, second, 1);
    const firstWidth = (first / maxValue) * 100;
    const secondWidth = (second / maxValue) * 100;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-20 text-xs text-gray-600 truncate">{firstCandleName}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${firstWidth}%` }}
              ></div>
            </div>
            <div className="w-12 text-xs text-right font-medium">{first.toFixed(1)}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20 text-xs text-gray-600 truncate">{secondCandleName}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${secondWidth}%` }}
              ></div>
            </div>
            <div className="w-12 text-xs text-right font-medium">{second.toFixed(1)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-gray-800">Strength Comparison</h3>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600">Volume Analysis:</span>
          {includeVolume ? (
            <div className="flex items-center space-x-1 text-emerald-600">
              <ToggleRight className="w-4 h-4" />
              <span>ON</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-gray-500">
              <ToggleLeft className="w-4 h-4" />
              <span>OFF</span>
            </div>
          )}
        </div>
      </div>

      {/* Winner announcement */}
      <div className={`${winnerInfo.bgColor} ${winnerInfo.borderColor} border rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-center space-x-2">
          <Trophy className={`w-5 h-5 ${winnerInfo.color}`} />
          <span className={`text-lg font-bold ${winnerInfo.color}`}>
            {currentWinner === 'tie' ? 'It\'s a Tie!' : `${winnerInfo.name} Wins!`}
          </span>
        </div>
        {currentWinner !== 'tie' && (
          <div className="text-center text-sm text-gray-600 mt-1">
            Overall Strength: {currentWinner === 'first' ? 
              (includeVolume ? metrics.first.overallStrength : metrics.first.overallStrengthWithoutVolume).toFixed(1) : 
              (includeVolume ? metrics.second.overallStrength : metrics.second.overallStrengthWithoutVolume).toFixed(1)}
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
            <BarChart className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Absolute Body Size ($)</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="font-medium text-emerald-800">{firstCandleName}</div>
              <div className="text-emerald-600">${metrics.first.bodySize.toFixed(5)}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-medium text-blue-800">{secondCandleName}</div>
              <div className="text-blue-600">${metrics.second.bodySize.toFixed(5)}</div>
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
          <h4 className="font-semibold text-emerald-700 mb-2">{firstCandleName} Advantages</h4>
          <ul className="space-y-1">
            {currentAdvantages.first.map((advantage, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start space-x-1">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{advantage}</span>
              </li>
            ))}
            {currentAdvantages.first.length === 0 && (
              <li className="text-sm text-gray-400">No significant advantages</li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-blue-700 mb-2">{secondCandleName} Advantages</h4>
          <ul className="space-y-1">
            {currentAdvantages.second.map((advantage, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start space-x-1">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{advantage}</span>
              </li>
            ))}
            {currentAdvantages.second.length === 0 && (
              <li className="text-sm text-gray-400">No significant advantages</li>
            )}
          </ul>
        </div>
      </div>

      {/* Comparison Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Analysis Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">With Volume:</span>
            <span className={`ml-2 font-medium ${
              winner === 'first' ? 'text-emerald-600' : 
              winner === 'second' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {winner === 'first' ? firstCandleName : 
               winner === 'second' ? secondCandleName : 'Tie'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Without Volume:</span>
            <span className={`ml-2 font-medium ${
              winnerWithoutVolume === 'first' ? 'text-emerald-600' : 
              winnerWithoutVolume === 'second' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {winnerWithoutVolume === 'first' ? firstCandleName : 
               winnerWithoutVolume === 'second' ? secondCandleName : 'Tie'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};