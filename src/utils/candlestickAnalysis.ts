import {
  CandlestickData,
  StrengthMetrics,
  ComparisonResult,
} from "../types/candlestick";

export const identifyCandlestickPattern = (candle: CandlestickData): string => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  const upperWick = candle.high - Math.max(candle.open, candle.close);
  const lowerWick = Math.min(candle.open, candle.close) - candle.low;
  const bodyToRangeRatio = totalRange > 0 ? bodySize / totalRange : 0;

  const isBullish = candle.close > candle.open;
  // const isBearish = candle.close < candle.open;
  const isDoji = Math.abs(candle.close - candle.open) < totalRange * 0.1;

  // Pattern identification logic
  if (isDoji) {
    if (upperWick > bodySize * 3 && lowerWick < bodySize)
      return "Dragonfly Doji";
    if (lowerWick > bodySize * 3 && upperWick < bodySize)
      return "Gravestone Doji";
    if (upperWick > bodySize * 2 && lowerWick > bodySize * 2)
      return "Long-Legged Doji";
    return "Doji";
  }

  if (bodyToRangeRatio > 0.7) {
    return isBullish ? "Strong Bullish Marubozu" : "Strong Bearish Marubozu";
  }

  if (bodyToRangeRatio > 0.5) {
    if (upperWick < bodySize * 0.3 && lowerWick < bodySize * 0.3) {
      return isBullish ? "Bullish Marubozu" : "Bearish Marubozu";
    }
    return isBullish ? "Strong Bullish" : "Strong Bearish";
  }

  if (upperWick > bodySize * 2 && lowerWick < bodySize * 0.5) {
    return isBullish ? "Bullish Hammer" : "Hanging Man";
  }

  if (lowerWick > bodySize * 2 && upperWick < bodySize * 0.5) {
    return isBullish ? "Inverted Hammer" : "Shooting Star";
  }

  if (bodyToRangeRatio < 0.3) {
    return "Spinning Top";
  }

  return isBullish ? "Bullish" : "Bearish";
};

export const calculateStrengthMetrics = (
  candle: CandlestickData
): StrengthMetrics => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  const upperWick = candle.high - Math.max(candle.open, candle.close);
  const lowerWick = Math.min(candle.open, candle.close) - candle.low;

  // Fixed body strength calculation - now properly represents body dominance
  const bodyStrength = totalRange > 0 ? (bodySize / totalRange) * 100 : 0;
  const bodyToRangeRatio = totalRange > 0 ? bodySize / totalRange : 0;

  // Volume strength calculation
  const volumeStrength = Math.min((candle.volume / 1000000) * 100, 100);

  // Momentum calculation - absolute value for strength comparison
  const momentum =
    (Math.abs(candle.close - candle.open) /
      Math.max(candle.open, candle.close)) *
    100;

  // Volatility calculation
  const volatility =
    totalRange > 0
      ? (totalRange / Math.max(candle.open, candle.close)) * 100
      : 0;

  // Overall strength calculation WITH volume
  const overallStrength =
    bodyStrength * 0.35 + // Body dominance is most important
    momentum * 0.25 + // Price movement strength
    volatility * 0.15 + // Market activity
    volumeStrength * 0.25; // Volume support

  // Overall strength calculation WITHOUT volume
  const overallStrengthWithoutVolume =
    bodyStrength * 0.45 + // Higher weight when volume excluded
    momentum * 0.35 + // Price movement gets more weight
    volatility * 0.2; // Volatility gets slight boost

  return {
    bodySize,
    bodyStrength,
    upperWick,
    lowerWick,
    totalRange,
    volumeStrength,
    momentum,
    volatility,
    overallStrength,
    overallStrengthWithoutVolume,
    bodyToRangeRatio,
  };
};

export const compareCandlesticks = (
  first: CandlestickData,
  second: CandlestickData,
  includeVolume: boolean = true
): ComparisonResult => {
  const firstMetrics = calculateStrengthMetrics(first);
  const secondMetrics = calculateStrengthMetrics(second);

  // Comparison with volume
  const strengthFirst = includeVolume
    ? firstMetrics.overallStrength
    : firstMetrics.overallStrengthWithoutVolume;
  const strengthSecond = includeVolume
    ? secondMetrics.overallStrength
    : secondMetrics.overallStrengthWithoutVolume;

  const winner =
    strengthFirst > strengthSecond
      ? "first"
      : strengthSecond > strengthFirst
      ? "second"
      : "tie";

  // Comparison without volume
  const winnerWithoutVolume =
    firstMetrics.overallStrengthWithoutVolume >
    secondMetrics.overallStrengthWithoutVolume
      ? "first"
      : secondMetrics.overallStrengthWithoutVolume >
        firstMetrics.overallStrengthWithoutVolume
      ? "second"
      : "tie";

  const advantages = {
    first: [] as string[],
    second: [] as string[],
  };

  const advantagesWithoutVolume = {
    first: [] as string[],
    second: [] as string[],
  };

  // Determine advantages with volume
  if (firstMetrics.bodyStrength > secondMetrics.bodyStrength) {
    advantages.first.push(
      `Stronger body dominance (${firstMetrics.bodyStrength.toFixed(
        1
      )}% vs ${secondMetrics.bodyStrength.toFixed(1)}%)`
    );
  } else if (secondMetrics.bodyStrength > firstMetrics.bodyStrength) {
    advantages.second.push(
      `Stronger body dominance (${secondMetrics.bodyStrength.toFixed(
        1
      )}% vs ${firstMetrics.bodyStrength.toFixed(1)}%)`
    );
  }

  if (firstMetrics.bodySize > secondMetrics.bodySize) {
    advantages.first.push(
      `Larger absolute body size ($${firstMetrics.bodySize.toFixed(
        3
      )} vs $${secondMetrics.bodySize.toFixed(3)})`
    );
  } else if (secondMetrics.bodySize > firstMetrics.bodySize) {
    advantages.second.push(
      `Larger absolute body size ($${secondMetrics.bodySize.toFixed(
        3
      )} vs $${firstMetrics.bodySize.toFixed(3)})`
    );
  }

  if (firstMetrics.momentum > secondMetrics.momentum) {
    advantages.first.push(
      `Higher momentum (${firstMetrics.momentum.toFixed(
        2
      )}% vs ${secondMetrics.momentum.toFixed(2)}%)`
    );
  } else if (secondMetrics.momentum > firstMetrics.momentum) {
    advantages.second.push(
      `Higher momentum (${secondMetrics.momentum.toFixed(
        2
      )}% vs ${firstMetrics.momentum.toFixed(2)}%)`
    );
  }

  if (includeVolume) {
    if (firstMetrics.volumeStrength > secondMetrics.volumeStrength) {
      advantages.first.push(
        `Higher volume support (${firstMetrics.volumeStrength.toFixed(
          1
        )} vs ${secondMetrics.volumeStrength.toFixed(1)})`
      );
    } else if (secondMetrics.volumeStrength > firstMetrics.volumeStrength) {
      advantages.second.push(
        `Higher volume support (${secondMetrics.volumeStrength.toFixed(
          1
        )} vs ${firstMetrics.volumeStrength.toFixed(1)})`
      );
    }
  }

  if (firstMetrics.volatility > secondMetrics.volatility) {
    advantages.first.push(
      `Higher volatility (${firstMetrics.volatility.toFixed(
        2
      )}% vs ${secondMetrics.volatility.toFixed(2)}%)`
    );
  } else if (secondMetrics.volatility > firstMetrics.volatility) {
    advantages.second.push(
      `Higher volatility (${secondMetrics.volatility.toFixed(
        2
      )}% vs ${secondMetrics.volatility.toFixed(2)}%)`
    );
  }

  // Advantages without volume (copy relevant ones)
  advantagesWithoutVolume.first = advantages.first.filter(
    (adv) => !adv.includes("volume")
  );
  advantagesWithoutVolume.second = advantages.second.filter(
    (adv) => !adv.includes("volume")
  );

  return {
    winner,
    winnerWithoutVolume,
    metrics: {
      first: firstMetrics,
      second: secondMetrics,
    },
    advantages,
    advantagesWithoutVolume,
  };
};

export const generateSampleCandlestick = (
  name: string,
  basePrice?: number
): CandlestickData => {
  const base = basePrice || 100 + Math.random() * 200;
  const volatility = 0.002 + Math.random() * 0.02; // 0.2-2% volatility for more realistic data

  const open = base;
  const priceChange = (Math.random() - 0.5) * 2 * volatility * base;
  const close = open + priceChange;

  const range = Math.abs(priceChange) + Math.random() * volatility * base * 0.5;
  const high = Math.max(open, close) + Math.random() * range * 0.3;
  const low = Math.min(open, close) - Math.random() * range * 0.3;

  const volume = Math.floor(500000 + Math.random() * 2000000);

  const candleData: CandlestickData = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    open: Math.round(open * 100000) / 100000,
    high: Math.round(high * 100000) / 100000,
    low: Math.round(low * 100000) / 100000,
    close: Math.round(close * 100000) / 100000,
    volume,
    timestamp: new Date(),
  };

  candleData.patternName = identifyCandlestickPattern(candleData);
  return candleData;
};

export const createLinkedCandle = (
  previousCandle: CandlestickData,
  name: string
): CandlestickData => {
  const open = previousCandle.close;
  const volatility = 0.002 + Math.random() * 0.02;

  const priceChange = (Math.random() - 0.5) * 2 * volatility * open;
  const close = open + priceChange;

  const range = Math.abs(priceChange) + Math.random() * volatility * open * 0.5;
  const high = Math.max(open, close) + Math.random() * range * 0.3;
  const low = Math.min(open, close) - Math.random() * range * 0.3;

  const volume = Math.floor(500000 + Math.random() * 2000000);

  const candleData: CandlestickData = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    open: Math.round(open * 100000) / 100000,
    high: Math.round(high * 100000) / 100000,
    low: Math.round(low * 100000) / 100000,
    close: Math.round(close * 100000) / 100000,
    volume,
    timestamp: new Date(),
  };

  candleData.patternName = identifyCandlestickPattern(candleData);
  return candleData;
};
