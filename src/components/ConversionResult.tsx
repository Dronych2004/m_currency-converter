import type { Currency } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

interface ConversionResultProps {
  amount: string
  fromCurrency: Currency | null
  toCurrency: Currency | null
  convertedAmount: number | null
  exchangeRate: number | null
  isLoading: boolean
}

export function ConversionResult({
  amount,
  fromCurrency,
  toCurrency,
  convertedAmount,
  exchangeRate,
  isLoading,
}: ConversionResultProps) {
  const { t } = useLanguage()

  if (!fromCurrency || !toCurrency) {
    return (
      <div className="result-card text-center py-8">
        <div className="text-5xl mb-4 opacity-50">💱</div>
        <div className="text-slate-400">{t('selectCurrencies')}</div>
      </div>
    )
  }

  const amountNumber = parseFloat(amount) || 0

  return (
    <div className="result-card">
      <div className="text-center mb-6">
        <div className="text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
          {t('initialAmount')}
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{fromCurrency.flag}</span>
          <span className="text-2xl font-bold text-white">
            {amountNumber.toLocaleString('ru-RU')} {fromCurrency.code}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <span className="text-xs text-slate-300">{t('rate')}</span>
          <span className="font-bold text-white text-sm">
            {exchangeRate?.toFixed(4)}
          </span>
        </div>
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="text-center">
        <div className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">
          {t('youWillGet')}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="loading-spinner" />
            <span className="text-slate-300">{t('calculating')}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{toCurrency.flag}</span>
            <span className="result-amount">
              {convertedAmount !== null
                ? convertedAmount.toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '0.00'}
            </span>
            <span className="text-2xl font-bold text-slate-300">
              {toCurrency.code}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <span>{fromCurrency.flag}</span>
            <span>1 {fromCurrency.code}</span>
            <span className="text-white font-medium">=</span>
            <span>{exchangeRate?.toFixed(4) || '—'}</span>
            <span>{toCurrency.code}</span>
            <span>{toCurrency.flag}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
