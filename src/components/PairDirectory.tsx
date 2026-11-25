import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { seoPages } from '../data/seoPages'
import { getCurrencyName } from '../data/currencies'
import { useLanguage } from '../i18n/LanguageContext'

const codes = [...new Set(seoPages.map(page => page.fromCode))]

export function PairDirectory() {
  const { lang } = useLanguage()
  const title = lang === 'ru' ? 'Все валютные пары' : 'All currency pairs'
  return <main className="max-w-5xl mx-auto px-4 py-8 text-slate-300">
    <Helmet>
      <title>{title} — конвертер | cconverter.ru</title>
      <meta name="description" content="Каталог валютных пар: выберите исходную валюту и направление для расчёта справочного эквивалента онлайн." />
      <meta property="og:title" content={title} />
      <meta property="og:description" content="Все направления конвертации валют: справочные расчёты онлайн." />
      <meta property="og:url" content="https://cconverter.ru/pairs/" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://cconverter.ru/pairs/" />
    </Helmet>
    <Link to="/" className="text-indigo-300 hover:underline">← {lang === 'ru' ? 'Конвертер валют' : 'Currency converter'}</Link>
    <h1 className="text-3xl font-bold text-white mt-6 mb-4">{title}</h1>
    <p className="mb-6">{lang === 'ru' ? 'Выберите валюту, затем направление расчёта. Сервис рассчитывает справочную сумму и не выполняет обмен денег.' : 'Choose a currency and a conversion pair. This calculator provides reference values and does not exchange money.'}</p>
    <nav aria-label={title} className="flex flex-wrap gap-3 mb-8">
      {codes.map(code => <a key={code} href={`#${code.toLowerCase()}`} className="text-indigo-300 hover:underline">{code}</a>)}
    </nav>
    {codes.map(code => <section key={code} id={code.toLowerCase()} className="glass-card p-4 mb-4">
      <h2 className="text-xl font-semibold text-white mb-3">{getCurrencyName(code, lang)} ({code})</h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {seoPages.filter(page => page.fromCode === code).map(page => <li key={page.path}>
          <Link to={page.path} className="text-indigo-300 hover:underline">{code} → {page.toCode} — {getCurrencyName(page.toCode, lang)}</Link>
        </li>)}
      </ul>
    </section>)}
  </main>
}
