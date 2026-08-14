/**
 * ГЛАВНЫЙ КОМПОНЕНТ - ПРОДВИНУТЫЙ ДИЗАЙН
 */

import { useCurrencyConverter } from './hooks/useCurrencyConverter'
import { useLanguage } from './i18n/LanguageContext'
import { CurrencySelector } from './components/CurrencySelector'
import { AmountInput } from './components/AmountInput'
import { SwapButton } from './components/SwapButton'
import { ConversionResult } from './components/ConversionResult'
import { CityInfoCard } from './components/CityInfoCard'
import { AdBanner } from './components/AdBanner'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { CurrencyTypeSwitcher } from './components/CurrencyTypeSwitcher'
import { currencies as currencyMeta } from './data/currencies'

function App() {
  const { t, lang } = useLanguage()

  const {
    currencies,
    fromCurrency,
    toCurrency,
    amount,
    convertedAmount,
    exchangeRate,
    isLoading,
    error,
    fromWeather,
    toWeather,
    currencyType,
    setFromCurrency,
    setToCurrency,
    setAmount,
    swapCurrencies,
    setCurrencyType,
  } = useCurrencyConverter()

  // Определяем город для крипты или фиата
  const fromMeta = fromCurrency ? currencyMeta[fromCurrency.code] : undefined
  const toMeta = toCurrency ? currencyMeta[toCurrency.code] : undefined

  const fromCityCode = fromMeta?.crypto?.cityCode || fromCurrency?.code
  const toCityCode = toMeta?.crypto?.cityCode || toCurrency?.code

  const fromCity = fromCityCode ? currencyMeta[fromCityCode]?.capital : null
  const toCity = toCityCode ? currencyMeta[toCityCode]?.capital : null

  // Для крипты используем название из crypto, для фиата - из capital
  const fromCityName =
    fromMeta?.crypto?.cityRu ||
    fromCity?.name ||
    (lang === 'ru' ? 'Неизвестно' : 'Unknown')
  const fromCityNameEn = fromMeta?.crypto?.cityEn || fromCity?.nameEn || 'Unknown'
  const toCityName =
    toMeta?.crypto?.cityRu ||
    toCity?.name ||
    (lang === 'ru' ? 'Неизвестно' : 'Unknown')
  const toCityNameEn = toMeta?.crypto?.cityEn || toCity?.nameEn || 'Unknown'

  return (
    <div className="min-h-screen py-4 px-3 md:py-8 md:px-4 relative">
      {/* Декоративные элементы фона */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <LanguageSwitcher />

      {/* Верхний рекламный блок (только мобильные) */}
      <div className="xl:hidden max-w-7xl mx-auto relative z-10">
        <AdBanner position="top" />
      </div>

      {/* Основной контент с боковыми рекламными блоками (десктоп) */}
      <div className="flex items-start justify-center gap-6 max-w-7xl mx-auto relative z-10">
        {/* Левая реклама (только десктоп) */}
        <AdBanner position="left" />

        {/* Центральный контент */}
        <div className="max-w-5xl mx-auto relative z-10 flex-1 min-w-0">
          {/* ШАПКА */}
          <header
            className="text-center mb-2 md:mb-4 animate-zoom-in"
            style={{
              animationDelay: '0s',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            <div className="inline-flex relative mb-2 md:mb-4">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-glow" />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-2xl">
                <span className="text-4xl drop-shadow-lg">💱</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-2 text-gradient tracking-tight">
              {t('title')}
            </h1>

            <p className="text-xl text-slate-400 max-w-md mx-auto mb-4">
              {t('subtitle')}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-linear-to-r from-transparent to-indigo-500/50" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <div className="h-px w-16 bg-linear-to-l from-transparent to-indigo-500/50" />
            </div>
          </header>

          {/* ПЕРЕКЛЮЧАТЕЛЬ ТИПА ВАЛЮТЫ */}
          <CurrencyTypeSwitcher
            value={currencyType}
            onChange={setCurrencyType}
          />

          {/* ОСНОВНОЙ БЛОК */}
          <main>
            {error && (
              <div
                className="mb-4 p-4 rounded-2xl text-center animate-fade-in-scale"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)',
                }}
              >
                <span className="text-xl mr-2">⚠️</span>
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {isLoading && currencies.length === 0 && (
              <div className="text-center py-12 animate-fade-in-scale">
                <div
                  className="loading-spinner mx-auto mb-4"
                  style={{ width: 40, height: 40 }}
                />
                <p className="text-slate-400 text-lg">{t('loading')}</p>
              </div>
            )}

            {currencies.length > 0 && (
              <div
                className="glass-card neon-main p-4 md:p-8 mb-4 md:mb-6 animate-zoom-in"
                style={{
                  animationDelay: '0.15s',
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-3 md:gap-4 items-start">
                  <div className="space-y-3 md:space-y-4">
                    <CurrencySelector
                      currencies={currencies}
                      selected={fromCurrency}
                      onSelect={setFromCurrency}
                      label={t('from')}
                      id="from-currency"
                    />
                    <AmountInput value={amount} onChange={setAmount} />
                  </div>

                  <div className="flex items-center justify-center pt-10">
                    <SwapButton onClick={swapCurrencies} disabled={isLoading} />
                  </div>

                  <div className="space-y-4">
                    <CurrencySelector
                      currencies={currencies}
                      selected={toCurrency}
                      onSelect={setToCurrency}
                      label={t('to')}
                      id="to-currency"
                    />
                    <ConversionResult
                      amount={amount}
                      fromCurrency={fromCurrency}
                      toCurrency={toCurrency}
                      convertedAmount={convertedAmount}
                      exchangeRate={exchangeRate}
                      isLoading={isLoading}
                    />
                  </div>
                </div>

                {exchangeRate && fromCurrency && toCurrency && (
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
                        <span className="text-slate-400">{t('course')}</span>
                        <span className="font-semibold text-white">
                          1 {fromCurrency.code} = {exchangeRate.toFixed(4)}{' '}
                          {toCurrency.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
                        <span className="text-slate-400">{t('reverse')}</span>
                        <span className="font-semibold text-white">
                          1 {toCurrency.code} = {(1 / exchangeRate).toFixed(4)}{' '}
                          {fromCurrency.code}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ИНФОРМАЦИОННЫЕ КАРТОЧКИ */}
            {fromCurrency && toCurrency && (
              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                <div
                  className="animate-slide-in-left"
                  style={{
                    animationDelay: '0.3s',
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  <CityInfoCard
                    weather={fromWeather}
                    cityName={fromCityName}
                    cityNameEn={fromCityNameEn}
                    currencyCode={fromCurrency.code}
                  />
                </div>

                <div
                  className="animate-slide-in-right"
                  style={{
                    animationDelay: '0.45s',
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  <CityInfoCard
                    weather={toWeather}
                    cityName={toCityName}
                    cityNameEn={toCityNameEn}
                    currencyCode={toCurrency.code}
                  />
                </div>
              </div>
            )}
          </main>

          {/* ПОДВАЛ */}
          <footer
            className="text-center mt-8 pb-4 animate-fade-in-up"
            style={{
              animationDelay: '0.6s',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            <div className="inline-flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-4 text-base text-slate-400">
                <a
                  href="https://open.er-api.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('ratesFrom')} open.er-api.com
                </a>
                <span className="text-white/20">•</span>
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('weatherFrom')} Open-Meteo
                </a>
              </div>
              <p className="text-sm text-slate-500">{t('ratesUpdated')}</p>
              <a
                href="/privacy.html"
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                {t('privacy')}
              </a>
              <a
                href="/terms.html"
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                {t('terms')}
              </a>
              <a
                href="mailto:info@cconverter.ru"
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                ✉ info@cconverter.ru
              </a>
            </div>
          </footer>
        </div>

        {/* Правая реклама (только десктоп) */}
        <AdBanner position="right" />
      </div>

      {/* Нижний рекламный блок (только мобильные) */}
      <div className="xl:hidden max-w-7xl mx-auto relative z-10">
        <AdBanner position="bottom" />
      </div>
    </div>
  )
}

export default App
