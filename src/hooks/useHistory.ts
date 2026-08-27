import { useState, useCallback } from 'react'

export interface ConversionRecord {
  id: string
  fromCode: string
  toCode: string
  fromFlag: string
  toFlag: string
  amount: number
  result: number
  rate: number
  timestamp: number
}

const HISTORY_KEY = 'cc-history'
const MAX_HISTORY = 20

function loadHistory(): ConversionRecord[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ConversionRecord[]
  } catch {
    return []
  }
}

function saveHistory(history: ConversionRecord[]): void {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // sessionStorage переполнена
  }
}

export function useHistory() {
  const [history, setHistory] = useState<ConversionRecord[]>(loadHistory)

  const addConversion = useCallback((
    fromCode: string,
    toCode: string,
    fromFlag: string,
    toFlag: string,
    amount: number,
    result: number,
    rate: number
  ) => {
    setHistory(prev => {
      // Не дублировать последнюю запись
      if (
        prev.length > 0 &&
        prev[0].fromCode === fromCode &&
        prev[0].toCode === toCode &&
        prev[0].amount === amount
      ) {
        return prev
      }

      const record: ConversionRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fromCode,
        toCode,
        fromFlag,
        toFlag,
        amount,
        result,
        rate,
        timestamp: Date.now(),
      }

      const newHistory = [record, ...prev].slice(0, MAX_HISTORY)
      saveHistory(newHistory)
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    sessionStorage.removeItem(HISTORY_KEY)
  }, [])

  const removeRecord = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(r => r.id !== id)
      saveHistory(newHistory)
      return newHistory
    })
  }, [])

  return { history, addConversion, clearHistory, removeRecord }
}
