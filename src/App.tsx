/**
 * ГЛАВНЫЙ КОМПОНЕНТ С МАРШРУТИЗАЦИЕЙ
 */

import { useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCurrencyConverter } from './hooks/useCurrencyConverter'
import { useCityInfo } from './hooks/useCityInfo'
import { useHistory } from './hooks/useHistory'
import { useFavorites } from './hooks/useFavorites'
import { useLanguage } from './i18n/LanguageContext'
import { CurrencySelector } from './components/CurrencySelector'
import { AmountInput } from './components/AmountInput'
import { SwapButton } from './components/SwapButton'
import { ConversionResult } from './components/ConversionResult'
import { CityInfoCard } from './components/CityInfoCard'
import { AdBanner } from './components/AdBanner'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { CurrencyTypeSwitcher } from './components/CurrencyTypeSwitcher'
import { HistoryCard } from './components/HistoryCard'
import { FavoritesCard } from './components/FavoritesCard'
import { SeoPage } from './components/SeoPage'
import { seoPages } from './data/seoPages'
import { trackSwap, trackAddFavorite, trackRemoveFavorite, trackQuickPair } from './utils/analytics'

function Home() {
  const { t } = useLanguage()

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

  const fromCity = useCityInfo(fromCurrency)
  const toCity = useCityInfo(toCurrency)
  const { history, addConversion, clearHistory, removeRecord } = useHistory()
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites()

  // Автоматически сохраняем конвертацию при изменении результата
  const lastConversionRef = useRef<string>('')

  // Сигнал для prerenderer: страница готова к захвату
  useEffect(() => {
    document.dispatchEvent(new Event('custom-render-trigger'))
  }, [])

  useEffect(() => {
    if (fromCurrency && toCurrency && convertedAmount !== null && amount) {
      const key = `${fromCurrency.code}-${toCurrency.code}-${amount}`
      if (lastConversionRef.current !== key) {
        lastConversionRef.current = key
        addConversion(
          fromCurrency.code,
          toCurrency.code,
          fromCurrency.flag,
          toCurrency.flag,
          parseFloat(amount),
          convertedAmount,
          exchangeRate || 0
        )
      }
    }
  }, [fromCurrency, toCurrency, amount, convertedAmount, exchangeRate, addConversion])

  const handleSelectPair = (fromCode: string, toCode: string) => {
    const from = currencies.find(c => c.code === fromCode)
    const to = currencies.find(c => c.code === toCode)
    if (from) setFromCurrency(from)
    if (to) setToCurrency(to)
  }

  return (
    <div className="min-h-screen py-4 px-3 md:py-8 md:px-4 relative">
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('subtitle')} />
        <link rel="canonical" href="https://cconverter.ru" />
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('subtitle')} />
        <meta property="og:url" content="https://cconverter.ru" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Декоративные элементы фона */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-2xl" />
      </div>

      <LanguageSwitcher />

      {/* Верхний рекламный блок (мобильные) */}
      <div className="xl:hidden max-w-7xl mx-auto relative z-10">
        <AdBanner position="top" />
      </div>

      {/* Основной контент */}
      <div className="flex items-start justify-center gap-6 max-w-7xl mx-auto relative z-10">
        <AdBanner position="left" />

        <div className="max-w-5xl mx-auto relative z-10 flex-1 min-w-0">
          {/* ШАПКА */}
          <header
            className="text-center mb-2 md:mb-4 animate-zoom-in"
            style={{ animationDelay: '0s', opacity: 0, animationFillMode: 'forwards' }}
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
          <CurrencyTypeSwitcher value={currencyType} onChange={setCurrencyType} />

          {/* БЫСТРЫЙ ДОСТУП К ПОПУЛЯРНЫМ ПАРАМ */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            <h2 className="sr-only">Популярные валютные пары</h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link to="/usd-rub" onClick={() => trackQuickPair('USD', 'RUB')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                USD/RUB
              </Link>
              <Link to="/eur-rub" onClick={() => trackQuickPair('EUR', 'RUB')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                EUR/RUB
              </Link>
              <Link to="/eur-usd" onClick={() => trackQuickPair('EUR', 'USD')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                EUR/USD
              </Link>
              <Link to="/btc-usd" onClick={() => trackQuickPair('BTC', 'USD')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                BTC/USD
              </Link>
              <Link to="/rub-byn" onClick={() => trackQuickPair('RUB', 'BYN')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                RUB/BYN
              </Link>
              <Link to="/rub-kzt" onClick={() => trackQuickPair('RUB', 'KZT')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                RUB/KZT
              </Link>
              <Link to="/rub-try" onClick={() => trackQuickPair('RUB', 'TRY')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                RUB/TRY
              </Link>
              <Link to="/rub-egp" onClick={() => trackQuickPair('RUB', 'EGP')} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-white/15">
                RUB/EGP
              </Link>
            </div>
          </div>

          {/* ОСНОВНОЙ БЛОК */}
          <main>
            {error && (
              <div
                className="mb-4 p-4 rounded-2xl text-center animate-fade-in-scale"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
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
                <div className="loading-spinner mx-auto mb-4" style={{ width: 40, height: 40 }} />
                <p className="text-slate-400 text-lg">{t('loading')}</p>
              </div>
            )}

            {currencies.length > 0 && (
              <div
                className="glass-card neon-main p-4 md:p-8 mb-4 md:mb-6 animate-zoom-in"
                style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}
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
                    <SwapButton onClick={() => {
                      if (fromCurrency && toCurrency) {
                        trackSwap(fromCurrency.code, toCurrency.code)
                      }
                      swapCurrencies()
                    }} disabled={isLoading} />
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
                          1 {fromCurrency.code} = {exchangeRate.toFixed(4)} {toCurrency.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
                        <span className="text-slate-400">{t('reverse')}</span>
                        <span className="font-semibold text-white">
                          1 {toCurrency.code} = {(1 / exchangeRate).toFixed(4)} {fromCurrency.code}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const wasFav = isFavorite(fromCurrency.code, toCurrency.code)
                          toggleFavorite(
                            fromCurrency.code,
                            toCurrency.code,
                            fromCurrency.flag,
                            toCurrency.flag
                          )
                          if (wasFav) {
                            trackRemoveFavorite(fromCurrency.code, toCurrency.code)
                          } else {
                            trackAddFavorite(fromCurrency.code, toCurrency.code)
                          }
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
                          isFavorite(fromCurrency.code, toCurrency.code)
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-white/5 text-slate-400 hover:text-yellow-300 border border-white/5 hover:border-yellow-500/30'
                        }`}
                      >
                        <span>{isFavorite(fromCurrency.code, toCurrency.code) ? '⭐' : '☆'}</span>
                        <span className="text-xs">{isFavorite(fromCurrency.code, toCurrency.code) ? t('removeFromFavorites') : t('addToFavorites')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ИНФОРМАЦИОННЫЕ КАРТОЧКИ */}
            {fromCurrency && toCurrency && (
              <div
                className="grid md:grid-cols-2 gap-3 md:gap-4"
                style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 300px' }}
              >
                <h2 className="sr-only">Погода и время в столицах</h2>
                <div className="animate-slide-in-left self-stretch" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
                  <CityInfoCard
                    weather={fromWeather}
                    cityName={fromCity.cityName}
                    cityNameEn={fromCity.cityNameEn}
                    currencyCode={fromCurrency.code}
                  />
                </div>
                <div className="animate-slide-in-right self-stretch" style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}>
                  <CityInfoCard
                    weather={toWeather}
                    cityName={toCity.cityName}
                    cityNameEn={toCity.cityNameEn}
                    currencyCode={toCurrency.code}
                  />
                </div>
              </div>
            )}

            {/* ИЗБРАННОЕ */}
            <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}>
              <h2 className="sr-only">Избранные пары</h2>
              <FavoritesCard
                favorites={favorites}
                onSelect={handleSelectPair}
                onRemove={removeFavorite}
              />
            </div>

            {/* ИСТОРИЯ */}
            <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
              <h2 className="sr-only">История конвертаций</h2>
              <HistoryCard
                history={history}
                onRepeat={handleSelectPair}
                onRemove={removeRecord}
                onClear={clearHistory}
              />
            </div>
          </main>

          {/* ПОДВАЛ */}
          <footer
            className="text-center mt-8 pb-4 animate-fade-in-up"
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 200px', animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="inline-flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-4 text-base text-slate-400">
                <a href="https://open.er-api.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {t('ratesFrom')} open.er-api.com
                </a>
                <span className="text-white/20">•</span>
                <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {t('weatherFrom')} Open-Meteo
                </a>
              </div>
              <p className="text-sm text-slate-500">{t('ratesUpdated')}</p>
              <a href="/privacy.html" className="text-sm text-slate-500 hover:text-white transition-colors">
                {t('privacy')}
              </a>
              <a href="/terms.html" className="text-sm text-slate-500 hover:text-white transition-colors">
                {t('terms')}
              </a>
              <a href="mailto:info@cconverter.ru" className="text-sm text-slate-500 hover:text-white transition-colors">
                ✉ info@cconverter.ru
              </a>
            </div>
          </footer>
        </div>

        <AdBanner position="right" />
      </div>

      {/* Нижний рекламный блок (мобильные) */}
      <div className="xl:hidden max-w-7xl mx-auto relative z-10">
        <AdBanner position="bottom" />
      </div>

      {/* JSON-LD микроразметка */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Как конвертировать валюту онлайн?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Выберите валюту из и в поле "Из" и "В", введите сумму, и конвертер автоматически рассчитает результат по текущему курсу.',
                },
              },
              {
                '@type': 'Question',
                name: 'Как часто обновляются курсы валют?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Курсы валют обновляются один раз в день. Данные берутся из открытого API open.er-api.com.',
                },
              },
              {
                '@type': 'Question',
                name: 'Какие валюты поддерживает конвертер?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Конвертер поддерживает более 150 фиатных валют и 15 криптовалют, включая Bitcoin, Ethereum и другие.',
                },
              },
              {
                '@type': 'Question',
                name: 'Можно ли конвертировать криптовалюты?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Да, конвертер поддерживает 15 криптовалют: BTC, ETH, USDT, BNB, XRP, SOL, ADA, DOGE и другие. Курсы загружаются через CoinGecko API.',
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Главная',
                item: 'https://cconverter.ru',
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Конвертер валют',
            alternateName: 'Currency Converter',
            url: 'https://cconverter.ru',
            description: 'Бесплатный онлайн конвертер валют с реальными курсами, погодой и часами в столицах мира',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://cconverter.ru/?search={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {seoPages.map(page => (
          <Route
            key={page.path}
            path={page.path}
            element={
              <SeoPage
                title={page.title}
                description={page.description}
                h1={page.h1}
                fromCode={page.fromCode}
                toCode={page.toCode}
                faq={page.faq}
                content={page.content}
              />
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
