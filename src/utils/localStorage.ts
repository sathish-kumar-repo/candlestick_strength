import { ComparisonHistory, AppSettings } from '../types/candlestick';

const HISTORY_KEY = 'candlestick_comparison_history';
const SETTINGS_KEY = 'candlestick_app_settings';
const MAX_HISTORY_ITEMS = 50;

export const saveComparisonToHistory = (comparison: ComparisonHistory): void => {
  try {
    const existingHistory = getComparisonHistory();
    const newHistory = [comparison, ...existingHistory].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to save comparison to history:', error);
  }
};

export const getComparisonHistory = (): ComparisonHistory[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) return [];
    
    const history = JSON.parse(historyJson);
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load comparison history:', error);
    return [];
  }
};

export const clearComparisonHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear comparison history:', error);
  }
};

export const saveAppSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save app settings:', error);
  }
};

export const getAppSettings = (): AppSettings => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (!settingsJson) {
      return {
        includeVolume: true,
        autoLinkCandles: false,
        basePrice: 100
      };
    }
    return JSON.parse(settingsJson);
  } catch (error) {
    console.error('Failed to load app settings:', error);
    return {
      includeVolume: true,
      autoLinkCandles: false,
      basePrice: 100
    };
  }
};