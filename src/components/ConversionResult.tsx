import type { Currency } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

interface ConversionResultProps {
  amount: string
  convertedForAmount: string | null
  fromCurrency: Currency | null
  toCurrency: Currency | null
  convertedAmount: number | null
  exchangeRate: number | null
  isLoading: boolean
}

export function ConversionResult({
  amount,
  convertedForAmount,
  fromCurrency,
  toCurrency,
  convertedAmount,
  exchangeRate,
  isLoading,
}: ConversionResultProps) {
  const { t } = useLanguage()

  if (!fromCurrency || !toCurrency) {
    return (
      <div className="result-card text-center py-6 md:py-8">
        <div className="text-4xl md:text-5xl mb-3 md:mb-4 opacity-50">💱</div>
        <div className="text-sm md:text-base text-slate-400">{t('selectCurrencies')}</div>
      </div>
    )
  }

  const amountNumber = parseFloat(amount) || 0

  return (
    <div className="result-card">
      <div className="text-center mb-3 md:mb-6">
        <div className="text-xs md:text-sm font-medium text-slate-300 mb-1 md:mb-2 uppercase tracking-wide">
          {t('initialAmount')}
        </div>
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <span className="text-xl md:text-3xl">{fromCurrency.flag}</span>
          <span className="text-lg md:text-2xl font-bold text-white">
            {amountNumber.toLocaleString('ru-RU')} {fromCurrency.code}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 my-3 md:my-6">
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-linear-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <span className="text-[10px] md:text-xs text-slate-300">{t('rate')}</span>
          <span className="font-bold text-white text-xs md:text-sm">
            {exchangeRate?.toFixed(4)}
          </span>
        </div>
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="text-center">
        <div className="text-xs md:text-sm font-medium text-slate-300 mb-2 md:mb-3 uppercase tracking-wide">
          {t('youWillGet')}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 md:gap-3 py-2 md:py-4">
            <div className="loading-spinner" />
            <span className="text-sm text-slate-300">{t('calculating')}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <span className="text-xl md:text-3xl">{toCurrency.flag}</span>
            <span className="result-amount">
              {amount === '0' || amount === '' || convertedAmount === null
                ? '0.00'
                : convertedAmount.toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
              }
            </span>
            <span className="text-lg md:text-2xl font-bold text-slate-300">
              {toCurrency.code}
            </span>
          </div>
        )}
      </div>

      {convertedForAmount !== null && convertedForAmount !== amount && (
        <div className="mt-2 md:mt-4 text-center">
          <span className="text-[10px] md:text-xs text-slate-500">
            {t('resultFor')} {parseFloat(convertedForAmount).toLocaleString('ru-RU')} {fromCurrency.code}
          </span>
        </div>
      )}

      <div className="mt-3 md:mt-6 pt-3 md:pt-5 border-t border-white/5">
        <div className="flex items-center justify-center gap-3 md:gap-6 text-xs md:text-sm">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-base md:text-lg">{fromCurrency.flag}</span>
            <span>1 {fromCurrency.code}</span>
            <span className="text-white font-medium">=</span>
            <span>{exchangeRate?.toFixed(4) || '—'}</span>
            <span>{toCurrency.code}</span>
            <span className="text-base md:text-lg">{toCurrency.flag}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
