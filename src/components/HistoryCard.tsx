import { useLanguage } from '../i18n/LanguageContext'
import type { ConversionRecord } from '../hooks/useHistory'

interface HistoryCardProps {
  history: ConversionRecord[]
  onRepeat: (fromCode: string, toCode: string) => void
  onRemove: (id: string) => void
  onClear: () => void
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'только что'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} мин. назад`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ч. назад`
  const days = Math.floor(hours / 24)
  return `${days} дн. назад`
}

export function HistoryCard({ history, onRepeat, onRemove, onClear }: HistoryCardProps) {
  const { t } = useLanguage()

  if (history.length === 0) {
    return (
      <div className="glass-card p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📋</span>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            {t('history')}
          </h3>
        </div>
        <p className="text-sm text-slate-500 text-center py-4">
          {t('historyEmpty')}
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            {t('history')}
          </h3>
          <span className="text-xs text-slate-500">({history.length})</span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          {t('clear')}
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {history.map(record => (
          <div
            key={record.id}
            className="flex items-center gap-2 p-2 rounded-xl bg-white/3 hover:bg-white/5 transition-colors group"
          >
            <span className="text-lg">{record.fromFlag}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-medium text-white">{record.amount.toLocaleString('ru-RU')}</span>
                <span className="text-slate-400">{record.fromCode}</span>
                <span className="text-slate-500">→</span>
                <span className="font-medium text-white">{record.result.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</span>
                <span className="text-slate-400">{record.toCode}</span>
              </div>
              <div className="text-[10px] text-slate-500">{timeAgo(record.timestamp)}</div>
            </div>
            <span className="text-lg">{record.toFlag}</span>
            <button
              onClick={() => onRepeat(record.fromCode, record.toCode)}
              className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs hover:bg-indigo-500/30 transition-all"
              title={t('repeat')}
            >
              ↻
            </button>
            <button
              onClick={() => onRemove(record.id)}
              className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30 transition-all"
              title={t('remove')}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
