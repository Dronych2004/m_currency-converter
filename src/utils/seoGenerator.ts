import { currencies, getCurrencyName } from '../data/currencies'
import type { SeoPageData } from '../data/seoPages'

// ============================================
// ПРИОРИТЕТНЫЕ ВАЛЮТЫ
// ============================================

/** Топ-20 фиатных валют по популярности в поиске (RU-аудитория) */
const PRIORITY_FIAT = [
  'USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CNY', 'KZT', 'UAH', 'BYN',
  'TRY', 'EGP', 'GEL', 'AMD', 'AZN', 'KRW', 'INR', 'BRL', 'CAD',
  'AUD', 'CHF',
]

/** Криптовалюты (все, что есть в проекте) */
const PRIORITY_CRYPTO = [
  'BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'XRP', 'SOL', 'ADA',
  'DOGE', 'TRX', 'DOT', 'LINK', 'MATIC', 'LTC', 'UNI',
]

// ============================================
// ГЕНЕРАЦИЯ ПАР
// ============================================

/**
 * Генерирует все значимые пары:
 * - Fiat × Fiat: все комбинации топ-20 (20×19 = 380)
 * - Crypto × Fiat: крипто против топ-5 фиатных (15×5 = 75)
 * - Fiat × Crypto: фиат против топ-5 крипто (20×5 = 100, без дубликатов с Crypto×Fiat оставляем только один вариант)
 * - Crypto × Crypto: топ-5 × топ-4 = 20
 * Итого: ~575 пар
 */
function generatePairs(): [string, string][] {
  const pairs: [string, string][] = []
  const seen = new Set<string>()

  const addPair = (from: string, to: string) => {
    if (from === to) return
    const key = `${from}-${to}`
    if (seen.has(key)) return
    seen.add(key)
    pairs.push([from, to])
  }

  // Fiat × Fiat: все комбинации топ-20
  for (const from of PRIORITY_FIAT) {
    for (const to of PRIORITY_FIAT) {
      addPair(from, to)
    }
  }

  // Crypto × Fiat: крипто против топ-5 фиатных
  const topFiat = PRIORITY_FIAT.slice(0, 5) // USD, EUR, RUB, GBP, JPY
  for (const crypto of PRIORITY_CRYPTO) {
    for (const fiat of topFiat) {
      addPair(crypto, fiat)
    }
  }

  // Fiat × Crypto: фиат против топ-5 крипто (только если ещё не добавлено)
  const topCrypto = PRIORITY_CRYPTO.slice(0, 5) // BTC, ETH, USDT, USDC, BNB
  for (const fiat of PRIORITY_FIAT) {
    for (const crypto of topCrypto) {
      addPair(fiat, crypto)
    }
  }

  // Crypto × Crypto: топ-5 × остальные
  for (const from of topCrypto) {
    for (const to of PRIORITY_CRYPTO) {
      addPair(from, to)
    }
  }

  return pairs
}

// ============================================
// ШАБЛОНЫ КОНТЕНТА
// ============================================

function getCurrencyTypeLabel(code: string): string {
  if (code === 'BTC') return 'Биткоин'
  if (code === 'ETH') return 'Эфириум'
  if (code === 'USDT') return 'Тетер (USDT)'
  if (code === 'USDC') return 'USD Coin (USDC)'
  if (code === 'BNB') return 'Бинанскоин'
  if (code === 'XRP') return 'Рипл'
  if (code === 'SOL') return 'Солана'
  if (code === 'ADA') return 'Кардано'
  if (code === 'DOGE') return 'Догикоин'
  return getCurrencyName(code, 'ru')
}

function isCryptoCode(code: string): boolean {
  return !!currencies[code]?.crypto
}

function generateContent(from: string, to: string): string {
  const fromName = getCurrencyTypeLabel(from)
  const toName = getCurrencyTypeLabel(to)
  const fromIsCrypto = isCryptoCode(from)
  const toIsCrypto = isCryptoCode(to)

  const sections: string[] = []

  // Заголовок и вступление
  sections.push(`
    <h2>Курс ${from} к ${to}: актуальная информация</h2>
    <p>${fromName} (${from}) — ${fromIsCrypto ? 'популярная криптовалюта' : 'международная валюта'}. ${toName} (${to}) — ${toIsCrypto ? 'востребованная криптовалюта' : 'национальная валюта'}. Конвертер ${from}/${to} позволяет мгновенно перевести средства по актуальному курсу.</p>
  `)

  // Как конвертировать
  sections.push(`
    <h2>Как конвертировать ${from} в ${to}</h2>
    <p>Для конвертации ${fromName} в ${toName}:</p>
    <ol>
      <li>Убедитесь, что выбраны валюты ${from} → ${to}</li>
      <li>Введите сумму для конвертации</li>
      <li>Получите результат мгновенно по текущему курсу</li>
    </ol>
    <p>Вы также можете нажать кнопку обмена (⇄), чтобы перевести ${toName} в ${fromName}.</p>
  `)

  // Особенности пары
  if (fromIsCrypto && toIsCrypto) {
    sections.push(`
      <h2>Особенности обмена ${from} на ${to}</h2>
      <p>Обмен криптовалют ${from} на ${to} осуществляется на основе рыночного курса. Курсы криптовалют значительно варьируются в течение дня, поэтому рекомендуем проверять актуальный курс перед операцией.</p>
      <ul>
        <li><strong>Высокая волатильность</strong> — курс криптовалют может измениться на несколько процентов за час.</li>
        <li><strong>Круглосуточная торговля</strong> — криптовалюты торгуются 24/7 без выходных.</li>
        <li><strong>Глобальный рынок</strong> — обмен доступен из любой точки мира.</li>
      </ul>
    `)
  } else if (fromIsCrypto) {
    sections.push(`
      <h2>Как продать ${fromName} за ${toName}</h2>
      <p>Конвертация ${fromName} в ${toName} — удобный способ зафиксировать прибыль или перевести криптоактивы в фиатную валюту.</p>
      <ul>
        <li><strong>Быстрая конвертация</strong> — результат мгновенно.</li>
        <li><strong>Актуальный курс</strong> — данные обновляются регулярно.</li>
        <li><strong>Без регистрации</strong> — конвертация доступна без создания аккаунта.</li>
      </ul>
    `)
  } else if (toIsCrypto) {
    sections.push(`
      <h2>Как купить ${toName} за ${fromName}</h2>
      <p>Конвертация ${fromName} в ${toName} — популярный способ приобрести криптовалюту.</p>
      <ul>
        <li><strong>Простая покупка</strong> — выберите валюты и введите сумму.</li>
        <li><strong>Прозрачный курс</strong> — видите точный результат до конвертации.</li>
        <li><strong>Поддержка криптовалют</strong> — доступно более 15 криптовалют.</li>
      </ul>
    `)
  } else {
    // Обе фиатные
    sections.push(`
      <h2>Особенности курса ${from}/${to}</h2>
      <p>Курс ${fromName} к ${toName} формируется на основе спроса и предложения на международном валютном рынке. На курс влияют:</p>
      <ul>
        <li><strong>Процентные ставки</strong> центральных банков обеих стран.</li>
        <li><strong>Экономические показатели</strong> — ВВП, инфляция, безработица.</li>
        <li><strong>Геополитика</strong> — политические события и санкции.</li>
        <li><strong>Торговый баланс</strong> — соотношение экспорта и импорта.</li>
      </ul>
    `)
  }

  // Популярные суммы
  sections.push(`
    <h2>Популярные суммы для конвертации</h2>
    <p>Вот сколько ${toName} вы получите за стандартные суммы ${fromName}:</p>
    <ul>
      <li>1 ${from} = курс ${from}/${to}</li>
      <li>10 ${from} = 10 × курс</li>
      <li>100 ${from} = 100 × курс</li>
      <li>1 000 ${from} = 1 000 × курс</li>
    </ul>
    <p>Точный результат зависит от текущего курса. Используйте наш конвертер для расчёта любой суммы.</p>
  `)

  return sections.join('\n')
}

function generateFaq(from: string, to: string): { question: string; answer: string }[] {
  const fromName = getCurrencyTypeLabel(from)
  const toName = getCurrencyTypeLabel(to)
  const fromIsCrypto = isCryptoCode(from)
  const toIsCrypto = isCryptoCode(to)

  const faq: { question: string; answer: string }[] = [
    {
      question: `Какой курс ${from} к ${to}?`,
      answer: `Актуальный курс ${from} к ${to} можно посмотреть на cconverter.ru. Курсы обновляются регулярно и берутся из открытых API.`,
    },
    {
      question: `Как конвертировать ${from} в ${to}?`,
      answer: `Введите сумму, выберите ${from} в поле "Из" и ${to} в поле "В". Конвертер автоматически рассчитает результат по текущему курсу.`,
    },
  ]

  if (fromIsCrypto && toIsCrypto) {
    faq.push({
      question: `Можно ли обменять ${from} на ${to}?`,
      answer: `Да, конвертер поддерживает обмен ${fromName} на ${toName}. Курс формируется на основе рыночных данных.`,
    })
  } else if (fromIsCrypto) {
    faq.push({
      question: `Как продать ${from} за ${to}?`,
      answer: `Выберите ${from} в поле "Из" и ${to} в поле "В", введите количество ${fromName}, и конвертер покажет сумму в ${toName}.`,
    })
  } else if (toIsCrypto) {
    faq.push({
      question: `Как купить ${to} за ${from}?`,
      answer: `Выберите ${from} в поле "Из" и ${to} в поле "В", введите сумму ${fromName}, и конвертер покажет количество ${toName}.`,
    })
  } else {
    faq.push({
      question: `Как часто обновляется курс ${from}/${to}?`,
      answer: `Курс ${from}/${to} обновляется ежедневно. Для точных данных рекомендуем проверять официальные источники.`,
    })
  }

  faq.push({
    question: `Где посмотреть курс ${from} к ${to}?`,
    answer: `Курс ${from} к ${to} доступен на сайте cconverter.ru. Мы показываем актуальный курс с возможностью мгновенной конвертации.`,
  })

  return faq
}

// ============================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================

export function generateSeoPageData(from: string, to: string): SeoPageData {
  const fromName = getCurrencyName(from, 'ru')
  const toName = getCurrencyName(to, 'ru')

  return {
    path: `/${from.toLowerCase()}-${to.toLowerCase()}`,
    title: `Курс ${fromName} к ${toName} — конвертер ${from}/${to} | cconverter.ru`,
    description: `Конвертируйте ${from} в ${to} по актуальному курсу. Бесплатный онлайн калькулятор с мгновенным результатом.`,
    h1: `Курс ${fromName} к ${toName} сегодня`,
    fromCode: from,
    toCode: to,
    faq: generateFaq(from, to),
    content: generateContent(from, to),
  }
}

/** Все приоритетные пары (генерируются один раз при загрузке модуля) */
export const ALL_PAIRS: [string, string][] = generatePairs()

/** Экспорт маршрутов для prerenderer */
export function getAllSeoRoutes(): string[] {
  return ALL_PAIRS.map(([from, to]) => `/${from.toLowerCase()}-${to.toLowerCase()}`)
}
