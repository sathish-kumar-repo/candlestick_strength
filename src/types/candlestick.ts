export interface CandlestickData {
  id: string;
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp?: Date;
  patternName?: string;
}

export interface StrengthMetrics {
  bodySize: number;
  bodyStrength: number;
  upperWick: number;
  lowerWick: number;
  totalRange: number;
  volumeStrength: number;
  momentum: number;
  volatility: number;
  overallStrength: number;
  overallStrengthWithoutVolume: number;
  bodyToRangeRatio: number;
}

export interface ComparisonResult {
  winner: 'first' | 'second' | 'tie';
  winnerWithoutVolume: 'first' | 'second' | 'tie';
  metrics: {
    first: StrengthMetrics;
    second: StrengthMetrics;
  };
  advantages: {
    first: string[];
    second: string[];
  };
  advantagesWithoutVolume: {
    first: string[];
    second: string[];
  };
}

export interface ComparisonHistory {
  id: string;
  timestamp: Date;
  firstCandle: CandlestickData;
  secondCandle: CandlestickData;
  result: ComparisonResult;
  includeVolume: boolean;
}

export interface AppSettings {
  includeVolume: boolean;
  autoLinkCandles: boolean;
  basePrice: number;
}