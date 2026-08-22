import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CurrencySelector } from './CurrencySelector'
import { AmountInput } from './AmountInput'
import { ConversionResult } from './ConversionResult'
import { CityInfoCard } from './CityInfoCard'
import { useCurrencyConverter } from '../hooks/useCurrencyConverter'
import { useCityInfo } from '../hooks/useCityInfo'
import { useLanguage } from '../i18n/LanguageContext'

interface SeoPageProps {
  title: string
  description: string
  h1: string
  fromCode: string
  toCode: string
  faq: { question: string; answer: string }[]
  content: string
}

export function SeoPage({
  title,
  description,
  h1,
  fromCode,
  toCode,
  faq,
  content,
}: SeoPageProps) {
  const { t } = useLanguage()
  const {
    currencies,
    fromCurrency,
    toCurrency,
    amount,
    convertedAmount,
    exchangeRate,
    isLoading,
    fromWeather,
    toWeather,
    setFromCurrency,
    setToCurrency,
    setAmount,
  } = useCurrencyConverter()

  const fromCity = useCityInfo(fromCurrency)
  const toCity = useCityInfo(toCurrency)

  // Устанавливаем валюты по умолчанию для этой страницы
  useEffect(() => {
    if (currencies.length > 0) {
      const from = currencies.find(c => c.code === fromCode)
      const to = currencies.find(c => c.code === toCode)
      if (from) setFromCurrency(from)
      if (to) setToCurrency(to)
    }
  }, [currencies, fromCode, toCode, setFromCurrency, setToCurrency])

  // JSON-LD FAQPage schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  // JSON-LD Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: h1,
    description,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Currency Converter',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Currency Converter',
      url: 'https://cconverter.ru',
    },
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://cconverter.ru',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: h1,
        item: `https://cconverter.ru/${fromCode.toLowerCase()}-${toCode.toLowerCase()}`,
      },
    ],
  }

  // Сигнал для prerenderer: страница готова к захвату
  useEffect(() => {
    document.dispatchEvent(new Event('custom-render-trigger'))
  }, [])

  const canonicalUrl = `https://cconverter.ru/${fromCode.toLowerCase()}-${toCode.toLowerCase()}`

  return (
    <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
    </Helmet>
    <div className="min-h-screen py-4 px-3 md:py-8 md:px-4 relative">
      {/* Декоративные элементы фона */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-2xl" />
      </div>

      <LanguageSwitcher />

      {/* Основной контент с боковыми блоками */}
      <div className="flex items-start justify-center gap-6 max-w-7xl mx-auto relative z-10">
        {/* Левый рекламный блок (заглушка) */}
        <div className="hidden xl:flex flex-col items-center justify-start shrink-0 w-[300px] min-h-[250px] pt-24" />

        {/* Центральный контент */}
        <div className="max-w-5xl mx-auto relative z-10 flex-1 min-w-0">
        {/* Кнопка возврата */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all"
        >
          <span className="text-lg">←</span>
          <span>{t('title')}</span>
        </Link>

        {/* Заголовок */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{h1}</h1>
        <p className="text-slate-400 text-lg mb-8">{description}</p>

        {/* Конвертер */}
        <div className="glass-card neon-main p-4 md:p-6 mb-8">
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-3 md:gap-4 items-start">
            <div className="space-y-3">
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
              <button
                onClick={() => {
                  if (fromCurrency && toCurrency) {
                    const temp = fromCurrency
                    setFromCurrency(toCurrency)
                    setToCurrency(temp)
                  }
                }}
                className="swap-button"
                disabled={isLoading}
              >
                ⇄
              </button>
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
        </div>

        {/* Карточки погоды и времени */}
        {fromCurrency && toCurrency && (
          <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-8">
            <div className="self-stretch">
              <CityInfoCard
                weather={fromWeather}
                cityName={fromCity.cityName}
                cityNameEn={fromCity.cityNameEn}
                currencyCode={fromCurrency.code}
              />
            </div>
            <div className="self-stretch">
              <CityInfoCard
                weather={toWeather}
                cityName={toCity.cityName}
                cityNameEn={toCity.cityNameEn}
                currencyCode={toCurrency.code}
              />
            </div>
          </div>
        )}

        {/* Контент статьи */}
        <article className="prose prose-invert max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('title') === 'Currency Converter' ? 'Frequently Asked Questions' : 'Часто задаваемые вопросы'}
            </h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details
                  key={i}
                  className="glass-card p-4 md:p-6 group"
                >
                  <summary className="text-lg font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                    {item.question}
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-slate-300 mt-4 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Ссылки на другие страницы */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('title') === 'Currency Converter' ? 'Other currency pairs' : 'Другие валютные пары'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { from: 'USD', to: 'RUB', label: 'USD/RUB' },
              { from: 'EUR', to: 'RUB', label: 'EUR/RUB' },
              { from: 'EUR', to: 'USD', label: 'EUR/USD' },
              { from: 'BTC', to: 'USD', label: 'BTC/USD' },
              { from: 'RUB', to: 'BYN', label: 'RUB/BYN' },
              { from: 'RUB', to: 'KZT', label: 'RUB/KZT' },
              { from: 'RUB', to: 'TRY', label: 'RUB/TRY' },
              { from: 'RUB', to: 'EGP', label: 'RUB/EGP' },
            ].map(pair => (
              <Link
                key={pair.label}
                to={`/${pair.from.toLowerCase()}-${pair.to.toLowerCase()}`}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors"
              >
                {pair.label}
              </Link>
            ))}
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        </div>

        {/* Правый рекламный блок (заглушка) */}
        <div className="hidden xl:flex flex-col items-center justify-start shrink-0 w-[300px] min-h-[250px] pt-24" />
      </div>
    </div>
    </>
  )
}
