import { useState, useEffect, useCallback } from 'react';

interface Stats {
  visits: number;
  conversions: number;
}

const STORAGE_KEY = 'currency-converter-stats';

function loadStats(): Stats {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return { visits: 0, conversions: 0 };
}

function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(() => loadStats());

  useEffect(() => {
    const current = loadStats();
    const updated = { ...current, visits: current.visits + 1 };
    saveStats(updated);
    setStats(updated);
  }, []);

  const incrementConversions = useCallback(() => {
    setStats(prev => {
      const updated = { ...prev, conversions: prev.conversions + 1 };
      saveStats(updated);
      return updated;
    });
  }, []);

  return { stats, incrementConversions };
}
