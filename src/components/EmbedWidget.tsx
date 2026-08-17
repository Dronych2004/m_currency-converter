import { useState, useEffect } from 'react'
import type { Currency } from '../types'
import { fetchCurrencies, convertCurrency } from '../services/api'

export function EmbedWidget() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null)
  const [toCurrency, setToCurrency] = useState<Currency | null>(null)
  const [amount, setAmount] = useState('1')
  const [result, setResult] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCurrencies('ru')
        setCurrencies(data)
        const usd = data.find(c => c.code === 'USD')
        const rub = data.find(c => c.code === 'RUB')
        if (usd) setFromCurrency(usd)
        if (rub) setToCurrency(rub)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !amount) {
      setResult(null)
      return
    }

    const num = parseFloat(amount)
    if (isNaN(num) || num < 0) {
      setResult(null)
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await convertCurrency(fromCurrency.code, toCurrency.code, num)
        if (!cancelled) {
          setResult(res.result)
          setRate(res.rate)
        }
      } catch {
        if (!cancelled) setResult(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [fromCurrency, toCurrency, amount])

  const swap = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #030014, #0a0a2e)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '24px', marginBottom: '4px' }}>💱</div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Конвертер валют</div>
        <div style={{ color: '#94a3b8', fontSize: '11px' }}>cconverter.ru</div>
      </div>

      {/* From */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Из</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={fromCurrency?.code || ''}
            onChange={e => {
              const c = currencies.find(c => c.code === e.target.value)
              if (c) setFromCurrency(c)
            }}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code} style={{ background: '#0a0a2e' }}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              width: '120px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              textAlign: 'right',
            }}
          />
        </div>
      </div>

      {/* Swap */}
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <button
          onClick={swap}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          }}
        >
          ⇄
        </button>
      </div>

      {/* To */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>В</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={toCurrency?.code || ''}
            onChange={e => {
              const c = currencies.find(c => c.code === e.target.value)
              if (c) setToCurrency(c)
            }}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code} style={{ background: '#0a0a2e' }}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div style={{
            flex: 1,
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            textAlign: 'right',
          }}>
            {isLoading ? '...' : result !== null ? result.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>
      </div>

      {/* Rate */}
      {rate && fromCurrency && toCurrency && (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
          1 {fromCurrency.code} = {rate.toFixed(4)} {toCurrency.code}
        </div>
      )}

      {/* Link */}
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <a
          href="https://cconverter.ru"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#6366f1', fontSize: '10px', textDecoration: 'none' }}
        >
          Powered by cconverter.ru
        </a>
      </div>
    </div>
  )
}
