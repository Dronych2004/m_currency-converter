import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CurrencySelector } from './CurrencySelector'
import { AmountInput } from './AmountInput'
import { ConversionResult } from './ConversionResult'
import { useCurrencyConverter } from '../hooks/useCurrencyConverter'
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
    setFromCurrency,
    setToCurrency,
    setAmount,
  } = useCurrencyConverter()

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

  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [title, description])

  return (
    <div className="min-h-screen py-4 px-3 md:py-8 md:px-4">
      <LanguageSwitcher />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Хлебные крошки */}
        <nav className="text-sm text-slate-400 mb-6">
          <Link to="/" className="hover:text-white transition-colors">
            {t('title')}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">{h1}</span>
        </nav>

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
              { from: 'USD', to: 'KZT', label: 'USD/KZT' },
              { from: 'USD', to: 'UAH', label: 'USD/UAH' },
              { from: 'USD', to: 'CNY', label: 'USD/CNY' },
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
    </div>
  )
}
