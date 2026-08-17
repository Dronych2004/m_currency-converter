import { useState, useEffect } from 'react'

interface MiniChartProps {
  fromCode: string
  toCode: string
}

interface RatePoint {
  date: string
  rate: number
}

export function MiniChart({ fromCode, toCode }: MiniChartProps) {
  const [data, setData] = useState<RatePoint[]>([])
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (fromCode === toCode) return

    async function fetchHistory() {
      setIsLoading(true)
      setError(null)

      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - parseInt(period))

        const start = startDate.toISOString().split('T')[0]
        const end = endDate.toISOString().split('T')[0]

        // Используем frankfurter.app — бесплатный API без ключа
        const url = `https://api.frankfurter.dev/${start}..${end}?from=${fromCode}&to=${toCode}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Не удалось загрузить историю курсов')
        }

        const result = await response.json()
        const rates = result.rates as Record<string, Record<string, number>>

        const points: RatePoint[] = Object.entries(rates)
          .map(([date, rateObj]) => ({
            date,
            rate: rateObj[toCode] || 0,
          }))
          .sort((a, b) => a.date.localeCompare(b.date))

        setData(points)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [fromCode, toCode, period])

  if (fromCode === toCode) return null

  const width = 280
  const height = 80
  const padding = 4

  const minRate = data.length > 0 ? Math.min(...data.map(d => d.rate)) : 0
  const maxRate = data.length > 0 ? Math.max(...data.map(d => d.rate)) : 1
  const range = maxRate - minRate || 1

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding)
    const y = height - padding - ((d.rate - minRate) / range) * (height - 2 * padding)
    return `${x},${y}`
  })

  const pathD = points.length > 0
    ? `M ${points.join(' L ')}`
    : ''

  const areaD = points.length > 0
    ? `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`
    : ''

  const change = data.length >= 2
    ? ((data[data.length - 1].rate - data[0].rate) / data[0].rate) * 100
    : 0

  const changeColor = change >= 0 ? '#22c55e' : '#ef4444'

  return (
    <div className="glass-card p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">
          {fromCode}/{toCode}
        </span>
        <div className="flex gap-1">
          {(['7', '30', '90'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}д
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <div className="loading-spinner" />
        </div>
      ) : error ? (
        <div className="text-xs text-slate-500 text-center h-20 flex items-center justify-center">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="text-xs text-slate-500 text-center h-20 flex items-center justify-center">
          Нет данных
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${fromCode}-${toCode}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
              </linearGradient>
            </defs>
            <path
              d={areaD}
              fill={`url(#gradient-${fromCode}-${toCode})`}
            />
            <path
              d={pathD}
              fill="none"
              stroke="rgb(99, 102, 241)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-slate-500">{data[0]?.date}</span>
            <span className="text-[10px] font-medium" style={{ color: changeColor }}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-500">{data[data.length - 1]?.date}</span>
          </div>
        </>
      )}
    </div>
  )
}
