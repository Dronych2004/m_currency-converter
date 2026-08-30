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
// СЛОВАРЬ УНИКАЛЬНЫХ ДАННЫХ О ВАЛЮТАХ
// ============================================

interface CurrencyInfo {
  fullNameRu: string
  country: string
  countryEn: string
  centralBank: string
  fact: string
  economicRole: string
  /** Краткое описание для использования в тексте */
  shortDesc: string
}

const CURRENCY_INFO: Record<string, CurrencyInfo> = {
  USD: {
    fullNameRu: 'Американский доллар',
    country: 'США',
    countryEn: 'USA',
    centralBank: 'Федеральная резервная система (ФРС)',
    fact: 'Доллар США является основной мировой резервной валютой — около 60% всех международных резервов хранится в долларах.',
    economicRole: 'Основная резервная валюта мира, используется для ценообразования на нефть и большинства международных расчётов.',
    shortDesc: 'главная мировая резервная валюта',
  },
  EUR: {
    fullNameRu: 'Евро',
    country: 'Европейский союз',
    countryEn: 'EU',
    centralBank: 'Европейский центральный банк (ЕЦБ)',
    fact: 'Евро — вторая по популярности резервная валюта в мире. Ею пользуются более 340 миллионов человек в 20 странах Евросоюза.',
    economicRole: 'Вторая мировая резервная валюта, основная валюта еврозоны.',
    shortDesc: 'валюта Европейского союза',
  },
  RUB: {
    fullNameRu: 'Российский рубль',
    country: 'Россия',
    countryEn: 'Russia',
    centralBank: 'Центральный банк Российской Федерации',
    fact: 'Рубль — одна из старейших валют мира. Первые упоминания о рубле относятся к 13 веку.',
    economicRole: 'Национальная валюта России, крупнейшей страны мира по площади.',
    shortDesc: 'национальная валюта России',
  },
  GBP: {
    fullNameRu: 'Британский фунт стерлингов',
    country: 'Великобритания',
    countryEn: 'UK',
    centralBank: 'Банк Англии',
    fact: 'Фунт стерлингов — старейшая валюта в мире, которая всё ещё используется. Банк Англии был основан в 1694 году.',
    economicRole: 'Одна из главных мировых резервных валют, традиционно сильная валюта.',
    shortDesc: 'старейшая валюта мира',
  },
  JPY: {
    fullNameRu: 'Японская иена',
    country: 'Япония',
    countryEn: 'Japan',
    centralBank: 'Банк Японии',
    fact: 'Иена — третья по популярности резервная валюта. Япония — третья экономика мира по размеру ВВП.',
    economicRole: 'Валюта крупнейшей азиатской экономики, основная резервная валюта Азии.',
    shortDesc: 'валюта крупнейшей азиатской экономики',
  },
  CNY: {
    fullNameRu: 'Китайский юань',
    country: 'Китай',
    countryEn: 'China',
    centralBank: 'Народный банк Китая',
    fact: 'Юань — валюта второй экономики мира. Китай активно продвигает юань как международную валюту.',
    economicRole: 'Валюта крупнейшей экспортной экономики мира.',
    shortDesc: 'валюта крупнейшей экспортной экономики',
  },
  KZT: {
    fullNameRu: 'Казахстанский тенге',
    country: 'Казахстан',
    countryEn: 'Kazakhstan',
    centralBank: 'Национальный банк Казахстана',
    fact: 'Тенге был введён в 1993 году после распада СССР. Название происходит от слов «теньге» (монета) и «тенгри» (небо).',
    economicRole: 'Национальная валюта крупнейшей центральноазиатской экономики.',
    shortDesc: 'валюта Казахстана',
  },
  UAH: {
    fullNameRu: 'Украинская гривна',
    country: 'Украина',
    countryEn: 'Ukraine',
    centralBank: 'Национальный банк Украины',
    fact: 'Гривна — одна из самых древних единиц веса на территории Восточной Европы. Современная гривна была введена в 1996 году.',
    economicRole: 'Национальная валюта Украины.',
    shortDesc: 'валюта Украины',
  },
  BYN: {
    fullNameRu: 'Белорусский рубль',
    country: 'Беларусь',
    countryEn: 'Belarus',
    centralBank: 'Национальный банк Республики Беларусь',
    fact: 'Белорусский рубль был введён в 1996 году, заменив прежний рубль образца 1992 года.',
    economicRole: 'Национальная валюта Беларуси.',
    shortDesc: 'валюта Беларуси',
  },
  TRY: {
    fullNameRu: 'Турецкая лира',
    country: 'Турция',
    countryEn: 'Turkey',
    centralBank: 'Центральный банк Турецкой Республики',
    fact: 'Турция — крупнейшая экономика Ближнего Востока. Страна является мостом между Европой и Азией.',
    economicRole: 'Валюта крупнейшей экономики Ближнего Востока и основного туристического направления.',
    shortDesc: 'валюта Турции',
  },
  EGP: {
    fullNameRu: 'Египетский фунт',
    country: 'Египет',
    countryEn: 'Egypt',
    centralBank: 'Центральный банк Египта',
    fact: 'Египетский фунт — одна из старейших валют Африки. Египет является крупнейшим туристическим направлением на континенте.',
    economicRole: 'Национальная валюта крупнейшей экономики арабского мира.',
    shortDesc: 'валюта Египта',
  },
  GEL: {
    fullNameRu: 'Грузинский лари',
    country: 'Грузия',
    countryEn: 'Georgia',
    centralBank: 'Национальный банк Грузии',
    fact: 'Лари был введён в 1995 году. Название происходит от грузинского слова «лари» (okaneoba — сокровище).',
    economicRole: 'Национальная валюта Грузии, страны с быстрорастущей экономикой.',
    shortDesc: 'валюта Грузии',
  },
  AMD: {
    fullNameRu: 'Армянский драм',
    country: 'Армения',
    countryEn: 'Armenia',
    centralBank: 'Центральный банк Республики Армения',
    fact: 'Драм был введён в 1993 году. Название происходит от древнегреческого «драмахма».',
    economicRole: 'Национальная валюта Армении.',
    shortDesc: 'валюта Армении',
  },
  AZN: {
    fullNameRu: 'Азербайджанский манат',
    country: 'Азербайджан',
    countryEn: 'Azerbaijan',
    centralBank: 'Центральный банк Азербайджанской Республики',
    fact: 'Манат был введён в 1992 году. Азербайджан является крупным экспортёром нефти.',
    economicRole: 'Национальная валюта Азербайджана, крупного нефтедобывающего государства.',
    shortDesc: 'валюта Азербайджана',
  },
  KRW: {
    fullNameRu: 'Южнокорейская вона',
    country: 'Южная Корея',
    countryEn: 'South Korea',
    centralBank: 'Банк Кореи',
    fact: 'Южная Корея — одна из ведущих мировых экономик. Страна является мировым лидером в производстве электроники и автомобилей.',
    economicRole: 'Валюта 10-й экономики мира.',
    shortDesc: 'валюта Южной Кореи',
  },
  INR: {
    fullNameRu: 'Индийская рупия',
    country: 'Индия',
    countryEn: 'India',
    centralBank: 'Резервный банк Индии',
    fact: 'Индия — пятая экономика мира по размеру ВВП. Страна является крупнейшей в мире по населению.',
    economicRole: 'Валюта крупнейшей в мире по населению страны.',
    shortDesc: 'валюта Индии',
  },
  BRL: {
    fullNameRu: 'Бразильский реал',
    country: 'Бразилия',
    countryEn: 'Brazil',
    centralBank: 'Центральный банк Бразилии',
    fact: 'Бразилия — крупнейшая экономика Латинской Америки. Страна является крупным экспортёром сельскохозяйственной продукции.',
    economicRole: 'Валюта крупнейшей экономики Южной Америки.',
    shortDesc: 'валюта Бразилии',
  },
  CAD: {
    fullNameRu: 'Канадский доллар',
    country: 'Канада',
    countryEn: 'Canada',
    centralBank: 'Банк Канады',
    fact: 'Канада — вторая по площади страна мира. Канадский доллар является одной из шести основных мировых резервных валют.',
    economicRole: 'Одна из основных мировых резервных валют.',
    shortDesc: 'валюта Канады',
  },
  AUD: {
    fullNameRu: 'Австралийский доллар',
    country: 'Австралия',
    countryEn: 'Australia',
    centralBank: 'Резервный банк Австралии',
    fact: 'Австралия — крупнейшая островная экономика мира. Австралийский доллар является пятой по популярности валютой наForex.',
    economicRole: 'Валюта крупнейшей островной экономики.',
    shortDesc: 'валюта Австралии',
  },
  CHF: {
    fullNameRu: 'Швейцарский франк',
    country: 'Швейцария',
    countryEn: 'Switzerland',
    centralBank: 'Национальный банк Швейцарии',
    fact: 'Швейцария — одна из богатейших стран мира. Швейцарский франк традиционно считается «валютой-убежищем».',
    economicRole: 'Валюта-убежище, стабильная резервная валюта.',
    shortDesc: 'валюта-убежище',
  },
  // Криптовалюты
  BTC: {
    fullNameRu: 'Биткоин',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет (децентрализованная)',
    fact: 'Биткоин был создан в 2009 году Сатоши Накамото. Максимальная эмиссия — 21 миллион монет.',
    economicRole: 'Первая и крупнейшая криптовалюта по рыночной капитализации.',
    shortDesc: 'первая и крупнейшая криптовалюта',
  },
  ETH: {
    fullNameRu: 'Эфириум',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет (децентрализованная)',
    fact: 'Эфириум был создан Виталиком Бутериным в 2015 году. Это первая платформа для смарт-контрактов.',
    economicRole: 'Вторая по капитализации криптовалюта, основа для DeFi и NFT.',
    shortDesc: 'платформа для смарт-контрактов',
  },
  USDT: {
    fullNameRu: 'Тетер (USDT)',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет (стейблкоин)',
    fact: 'USDT — стейблкоин, привязанный к доллару США. Каждая монета обеспечена реальными долларами.',
    economicRole: 'Крупнейший стейблкоин, основной инструмент для торговли криптовалютами.',
    shortDesc: 'стейблкоин, привязанный к доллару',
  },
  USDC: {
    fullNameRu: 'USD Coin (USDC)',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет (стейблкоин)',
    fact: 'USDC — стейблкоин, выпущенный Circle. Обеспечен реальными долларовыми резервами.',
    economicRole: 'Стейблкоин с высокой прозрачностью резервов.',
    shortDesc: 'прозрачный стейблкоин',
  },
  BNB: {
    fullNameRu: 'Бинанскоин',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет (токен Binance)',
    fact: 'BNB — нативный токен биржи Binance, крупнейшей криптобиржи в мире по объёму торгов.',
    economicRole: 'Токен крупнейшей криптобиржи, используется для снижения комиссий.',
    shortDesc: 'токен крупнейшей криптобиржи',
  },
  XRP: {
    fullNameRu: 'Рипл',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'XRP создан Ripple Labs для быстрых международных банковских переводов.',
    economicRole: 'Криптовалюта для банковских переводов.',
    shortDesc: 'криптовалюта для банковских переводов',
  },
  SOL: {
    fullNameRu: 'Солана',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Солана — высокоскоростная блокчейн-платформа, способная обрабатывать до 65 000 транзакций в секунду.',
    economicRole: 'Высокоскоростная блокчейн-платформа для DeFi и NFT.',
    shortDesc: 'высокоскоростная блокчейн-платформа',
  },
  ADA: {
    fullNameRu: 'Кардано',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Кардано была создана соучредителем Ethereum Чарльзом Хоскинсоном. Платформа использует научный подход к разработке.',
    economicRole: 'Блокчейн-платформа с научным подходом к разработке.',
    shortDesc: 'блокчейн-платформа с научным подходом',
  },
  DOGE: {
    fullNameRu: 'Догикоин',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Догикоин был создан в 2013 году как шутка, но стал популярной криптовалютой благодаря Илону Маску.',
    economicRole: 'Мем-криптовалюта с активным сообществом.',
    shortDesc: 'мем-криптовалюта',
  },
  TRX: {
    fullNameRu: 'Трон',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Трон — блокчейн-платформа для контента и развлечений, основанная Джастином Саном.',
    economicRole: 'Блокчейн для децентрализованных приложений и контента.',
    shortDesc: 'блокчейн для контента и развлечений',
  },
  DOT: {
    fullNameRu: 'Полкадот',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Полкадот создан сооснователем Ethereum Гэвином Вудом. Платформа объединяет разные блокчейны.',
    economicRole: 'Мультичейн-платформа для объединения разных блокчейнов.',
    shortDesc: 'мультичейн-платформа',
  },
  LINK: {
    fullNameRu: 'Чейнлинк',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Chainlink обеспечивает связь смарт-контрактов с реальными данными через оракулы.',
    economicRole: 'Оракулинг для смарт-контрактов.',
    shortDesc: 'оракулинг для смарт-контрактов',
  },
  MATIC: {
    fullNameRu: 'Полигон',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Polygon (ранее Matic Network) — решает проблему масштабируемости Ethereum.',
    economicRole: 'Решение для масштабирования Ethereum.',
    shortDesc: 'решение для масштабирования Ethereum',
  },
  LTC: {
    fullNameRu: 'Лайткоин',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Лайткоин был создан Чарли Ли в 2011 году как «серебро к золоту Биткоина».',
    economicRole: 'Одна из первых криптовалют, «серебро к золоту Биткоина».',
    shortDesc: 'старейшая криптовалюта после Биткоина',
  },
  UNI: {
    fullNameRu: 'Юнисвап',
    country: 'Децентрализованная',
    countryEn: 'Decentralized',
    centralBank: 'Нет',
    fact: 'Uniswap — крупнейший децентрализованный обменник (DEX) на платформе Ethereum.',
    economicRole: 'Токен крупнейшего децентрализованного обменника.',
    shortDesc: 'токен децентрализованного обменника',
  },
}

function getCurrencyInfo(code: string): CurrencyInfo {
  return CURRENCY_INFO[code] || {
    fullNameRu: getCurrencyName(code, 'ru'),
    country: '',
    countryEn: '',
    centralBank: '',
    fact: '',
    economicRole: '',
    shortDesc: getCurrencyName(code, 'ru'),
  }
}

function isCryptoCode(code: string): boolean {
  return !!currencies[code]?.crypto
}

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
// УНИКАЛЬНЫЙ КОНТЕНТ ДЛЯ КАЖДОЙ ПАРЫ
// ============================================

/** Детерминированный хеш строки для вариативности контента */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function pick<T>(arr: T[], seed: string): T {
  return arr[simpleHash(seed) % arr.length]
}

function generateContent(from: string, to: string): string {
  const fromInfo = getCurrencyInfo(from)
  const toInfo = getCurrencyInfo(to)
  const fromIsCrypto = isCryptoCode(from)
  const toIsCrypto = isCryptoCode(to)
  const seed = `${from}-${to}`

  const sections: string[] = []

  // --- Вступление (уникальное для каждой пары) ---
  if (fromIsCrypto && toIsCrypto) {
    sections.push(`
      <h2>Обмен ${fromInfo.fullNameRu} на ${toInfo.fullNameRu}</h2>
      <p>${fromInfo.fullNameRu} (${from}) — ${fromInfo.shortDesc}. ${toInfo.fullNameRu} (${to}) — ${toInfo.shortDesc}. Конвертер ${from}/${to} позволяет мгновенно перевести одну криптовалюту в другую по актуальному рыночному курсу.</p>
      <p>${fromInfo.fact} ${toInfo.fact}</p>
    `)
  } else if (fromIsCrypto) {
    sections.push(`
      <h2>Продажа ${fromInfo.fullNameRu} за ${toInfo.fullNameRu}</h2>
      <p>${fromInfo.fullNameRu} (${from}) — ${fromInfo.shortDesc}. ${toInfo.fullNameRu} (${to}) — ${toInfo.shortDesc}. Конвертер ${from}/${to} позволяет продать ${fromInfo.fullNameRu} за ${toInfo.fullNameRu} по текущему курсу.</p>
      <p>${fromInfo.fact}</p>
      <p>Продажа ${fromInfo.fullNameRu} за ${toInfo.shortDesc} — удобный способ зафиксировать прибыль или перевести криптоактивы в фиатную валюту.</p>
    `)
  } else if (toIsCrypto) {
    sections.push(`
      <h2>Покупка ${toInfo.fullNameRu} за ${fromInfo.fullNameRu}</h2>
      <p>${fromInfo.fullNameRu} (${from}) — ${fromInfo.shortDesc}. ${toInfo.fullNameRu} (${to}) — ${toInfo.shortDesc}. Конвертер ${from}/${to} позволяет купить ${toInfo.fullNameRu} за ${fromInfo.fullNameRu} по текущему курсу.</p>
      <p>${toInfo.fact}</p>
      <p>Покупка ${toInfo.shortDesc} за ${fromInfo.shortDesc} — популярный способ приобрести криптовалюту.</p>
    `)
  } else {
    // Обе фиатные — уникальное описание в зависимости от валют
    const introVariants = [
      `<p>${fromInfo.fullNameRu} (${from}) — ${fromInfo.shortDesc}. ${toInfo.fullNameRu} (${to}) — ${toInfo.shortDesc}. Конвертер ${from}/${to} позволяет мгновенно перевести средства по актуальному курсу.</p>`,
      `<p>Курс ${fromInfo.fullNameRu} к ${toInfo.fullNameRu} — важный показатель для тех, кто работает с ${fromInfo.country} и ${toInfo.country}. Наш конвертер позволяет рассчитать точную сумму по актуальному курсу.</p>`,
      `<p>Конвертация ${fromInfo.fullNameRu} в ${toInfo.shortDesc} — востребованная операция для путешественников, бизнеса и переводов. Используйте наш бесплатный калькулятор для расчёта.</p>`,
    ]
    sections.push(`
      <h2>Курс ${fromInfo.fullNameRu} к ${toInfo.fullNameRu}: актуальная информация</h2>
      ${pick(introVariants, seed)}
      <p>${fromInfo.fact} ${toInfo.fact}</p>
    `)
  }

  // --- Как конвертировать (вариативный текст) ---
  const howToVariants = [
    {
      intro: `Для конвертации ${fromInfo.fullNameRu} в ${toInfo.shortDesc}:`,
      steps: [
        'Убедитесь, что выбраны нужные валюты',
        'Введите сумму для конвертации',
        'Получите результат мгновенно по текущему курсу',
      ],
      outro: `Вы также можете нажать кнопку обмена (⇄), чтобы перевести ${toInfo.shortDesc} в ${fromInfo.shortDesc}.`,
    },
    {
      intro: `Чтобы перевести ${from} в ${to}:`,
      steps: [
        'Проверьте, что в полях «Из» и «В» выбраны правильные валюты',
        'Введите любую сумму',
        'Результат рассчитается автоматически',
      ],
      outro: `Для обратной конвертации (${to} → ${from}) нажмите кнопку обмена.`,
    },
  ]
  const howTo = pick(howToVariants, seed + '-howto')
  sections.push(`
    <h2>Как конвертировать ${from} в ${to}</h2>
    <p>${howTo.intro}</p>
    <ol>
      ${howTo.steps.map(s => `<li>${s}</li>`).join('\n      ')}
    </ol>
    <p>${howTo.outro}</p>
  `)

  // --- Уникальные особенности пары ---
  if (fromIsCrypto && toIsCrypto) {
    sections.push(`
      <h2>Особенности обмена ${from} на ${to}</h2>
      <p>Обмен ${fromInfo.fullNameRu} на ${toInfo.shortDesc} осуществляется на основе рыночного курса. Курсы криптовалют значительно варьируются в течение дня, поэтому рекомендуем проверять актуальный курс перед операцией.</p>
      <ul>
        <li><strong>Высокая волатильность</strong> — курс ${from} может измениться на несколько процентов за час.</li>
        <li><strong>Круглосуточная торговля</strong> — обмен ${from} на ${to} доступен 24/7 без выходных.</li>
        <li><strong>Глобальный рынок</strong> — конвертация доступна из любой точки мира.</li>
        <li><strong>Без посредников</strong> — обмен напрямую между криптовалютами.</li>
      </ul>
    `)
  } else if (fromIsCrypto) {
    sections.push(`
      <h2>Как продать ${fromInfo.fullNameRu} за ${toInfo.shortDesc}</h2>
      <p>Конвертация ${fromInfo.fullNameRu} в ${toInfo.shortDesc} — удобный способ зафиксировать прибыль или перевести криптоактивы в ${toInfo.shortDesc}.</p>
      <ul>
        <li><strong>Быстрая конвертация</strong> — результат мгновенно.</li>
        <li><strong>Актуальный курс</strong> — данные обновляются регулярно из CoinGecko.</li>
        <li><strong>Без регистрации</strong> — конвертация доступна без создания аккаунта.</li>
        <li><strong>Прозрачный курс</strong> — вы видите точный результат до конвертации.</li>
      </ul>
    `)
  } else if (toIsCrypto) {
    sections.push(`
      <h2>Как купить ${toInfo.shortDesc} за ${fromInfo.shortDesc}</h2>
      <p>Покупка ${toInfo.shortDesc} за ${fromInfo.shortDesc} — популярный способ приобрести криптовалюту.</p>
      <ul>
        <li><strong>Простая покупка</strong> — выберите валюты и введите сумму.</li>
        <li><strong>Прозрачный курс</strong> — видите точный результат до конвертации.</li>
        <li><strong>Без регистрации</strong> — покупка доступна без аккаунта.</li>
        <li><strong>Поддержка криптовалют</strong> — доступно более 15 криптовалют.</li>
      </ul>
    `)
  } else {
    // Обе фиатные — уникальные факторы для каждой пары
    const fiatVariants = [
      {
        title: `Факторы, влияющие на курс ${from}/${to}`,
        factors: [
          `<strong>Процентные ставки</strong> ${fromInfo.centralBank} и ${toInfo.centralBank} — основной фактор курса.`,
          `<strong>Экономические показатели</strong> ${fromInfo.country} и ${toInfo.country} — ВВП, инфляция, безработица.`,
          `<strong>Геополитика</strong> — политические события и санкции могут существенно влиять на курс.`,
          `<strong>Торговый баланс</strong> — соотношение экспорта и импорта между ${fromInfo.country} и ${toInfo.country}.`,
        ],
      },
      {
        title: `Особенности курса ${from}/${to}`,
        factors: [
          `<strong>Монетарная политика</strong> — решения ${fromInfo.centralBank} напрямую влияют на курс ${from}.`,
          `<strong>Экономика ${toInfo.country}</strong> — ${toInfo.shortDesc} зависит от макроэкономических показателей.`,
          `<strong>Торговые связи</strong> — объём торговли между ${fromInfo.country} и ${toInfo.country}.`,
          `<strong>Курс ${from} к доллару</strong> — косвенно влияет на курс ${from}/${to}.`,
        ],
      },
    ]
    const variant = pick(fiatVariants, seed + '-factors')
    sections.push(`
      <h2>${variant.title}</h2>
      <p>Курс ${fromInfo.fullNameRu} к ${toInfo.shortDesc} формируется на основе спроса и предложения на международном валютном рынке. На курс влияют:</p>
      <ul>
        ${variant.factors.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
    `)
  }

  // --- Интересные факты (уникальные для каждой пары) ---
  if (!fromIsCrypto && !toIsCrypto) {
    const factsVariants = [
      {
        title: `Интересные факты о ${from}/${to}`,
        facts: [
          `${fromInfo.fullNameRu} (${from}) является ${fromInfo.shortDesc}. ${toInfo.fullNameRu} (${to}) — ${toInfo.shortDesc}.`,
          `${fromInfo.country} и ${toInfo.country} — экономики с уникальными особенностями, которые влияют на курс ${from}/${to}.`,
          `Конвертация ${from} в ${to} особенно востребована среди путешественников и бизнесменов.`,
        ],
      },
      {
        title: `О валютах ${from} и ${to}`,
        facts: [
          `${fromInfo.fact}`,
          `${toInfo.fact}`,
          `Пара ${from}/${to} является одной из торгуемых на международном валютном рынке.`,
        ],
      },
    ]
    const facts = pick(factsVariants, seed + '-facts')
    sections.push(`
      <h2>${facts.title}</h2>
      <ul>
        ${facts.facts.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
    `)
  } else if (fromIsCrypto && !toIsCrypto) {
    sections.push(`
      <h2>О ${fromInfo.fullNameRu}</h2>
      <p>${fromInfo.fact}</p>
      <p>Конвертация ${fromInfo.shortDesc} в ${toInfo.shortDesc} позволяет перевести криптоактивы в национальную валюту ${toInfo.country}.</p>
    `)
  } else if (!fromIsCrypto && toIsCrypto) {
    sections.push(`
      <h2>О ${toInfo.fullNameRu}</h2>
      <p>${toInfo.fact}</p>
      <p>Покупка ${toInfo.shortDesc} за ${fromInfo.shortDesc} — популярный способ приобрести криптовалюту.</p>
    `)
  }

  // --- Как пользоваться конвертером ---
  sections.push(`
    <h2>Как пользоваться конвертером ${from}/${to}</h2>
    <p>Наш конвертер позволяет быстро и удобно перевести ${fromInfo.shortDesc} в ${toInfo.shortDesc}:</p>
    <ol>
      <li>Убедитесь, что выбраны валюты ${from} → ${to}</li>
      <li>Введите сумму в ${fromInfo.fullNameRu}</li>
      <li>Получите результат в ${toInfo.shortDesc} мгновенно</li>
    </ol>
    <p>Курсы обновляются регулярно из открытых API. Конвертация полностью бесплатная и не требует регистрации.</p>
  `)

  return sections.join('\n')
}

// ============================================
// УНИКАЛЬНЫЙ FAQ
// ============================================

function generateFaq(from: string, to: string): { question: string; answer: string }[] {
  const fromInfo = getCurrencyInfo(from)
  const toInfo = getCurrencyInfo(to)
  const fromIsCrypto = isCryptoCode(from)
  const toIsCrypto = isCryptoCode(to)
  const seed = `${from}-${to}`

  const faq: { question: string; answer: string }[] = []

  // Базовые вопросы (вариативные формулировки)
  const q1Variants = [
    {
      question: `Какой сейчас курс ${from} к ${to}?`,
      answer: `Актуальный курс ${fromInfo.fullNameRu} к ${toInfo.shortDesc} можно посмотреть на cconverter.ru. Курсы обновляются регулярно из открытых API.`,
    },
    {
      question: `Сколько стоит ${from} в ${to}?`,
      answer: `Текущий курс ${from}/${to} отображается в нашем конвертере. Данные берутся из открытых источников и обновляются регулярно.`,
    },
    {
      question: `Какой курс ${from} к ${to} сегодня?`,
      answer: `Курс ${fromInfo.fullNameRu} к ${toInfo.shortDesc} на сегодня можно проверить на cconverter.ru — мы показываем актуальный курс с возможностью мгновенной конвертации.`,
    },
  ]
  faq.push(pick(q1Variants, seed + '-q1'))

  // Как конвертировать
  const q2Variants = [
    {
      question: `Как конвертировать ${from} в ${to}?`,
      answer: `Введите сумму, выберите ${from} в поле «Из» и ${to} в поле «В». Конвертер автоматически рассчитает результат по текущему курсу.`,
    },
    {
      question: `Как перевести ${from} в ${to}?`,
      answer: `Откройте конвертер, убедитесь что выбраны нужные валюты, введите сумму — результат появится мгновенно.`,
    },
    {
      question: `Как быстро конвертировать ${fromInfo.shortDesc} в ${toInfo.shortDesc}?`,
      answer: `Используйте наш онлайн-конвертер — просто введите сумму и получите результат за долю секунды.`,
    },
  ]
  faq.push(pick(q2Variants, seed + '-q2'))

  // Специфичные вопросы в зависимости от типа пары
  if (fromIsCrypto && toIsCrypto) {
    faq.push({
      question: `Можно ли обменять ${fromInfo.fullNameRu} на ${toInfo.shortDesc}?`,
      answer: `Да, конвертер поддерживает обмен ${fromInfo.fullNameRu} на ${toInfo.shortDesc}. Курс формируется на основе рыночных данных.`,
    })
  } else if (fromIsCrypto) {
    faq.push({
      question: `Как продать ${fromInfo.shortDesc} за ${toInfo.shortDesc}?`,
      answer: `Выберите ${from} в поле «Из» и ${to} в поле «В», введите количество ${fromInfo.shortDesc}, и конвертер покажет сумму в ${toInfo.shortDesc}.`,
    })
  } else if (toIsCrypto) {
    faq.push({
      question: `Как купить ${toInfo.shortDesc} за ${fromInfo.shortDesc}?`,
      answer: `Выберите ${from} в поле «Из» и ${to} в поле «В», введите сумму ${fromInfo.shortDesc}, и конвертер покажет количество ${toInfo.shortDesc}.`,
    })
  } else {
    faq.push({
      question: `Как часто обновляется курс ${from}/${to}?`,
      answer: `Курс ${from}/${to} обновляется ежедневно. Для точных данных рекомендуем проверять официальные источники: ${fromInfo.centralBank} и ${toInfo.centralBank}.`,
    })
  }

  // Где посмотреть курс (уникальные формулировки)
  const q4Variants = [
    {
      question: `Где посмотреть актуальный курс ${from} к ${to}?`,
      answer: `Курс ${fromInfo.shortDesc} к ${toInfo.shortDesc} доступен на сайте cconverter.ru — мы показываем актуальный курс с возможностью мгновенной конвертации.`,
    },
    {
      question: `Где найти курс ${from}/${to}?`,
      answer: `Актуальный курс ${from} к ${to} можно найти на нашем сайте. Конвертер полностью бесплатный и не требует регистрации.`,
    },
  ]
  faq.push(pick(q4Variants, seed + '-q4'))

  return faq
}

// ============================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================

export function generateSeoPageData(from: string, to: string): SeoPageData {
  const fromInfo = getCurrencyInfo(from)
  const toInfo = getCurrencyInfo(to)
  const seed = `${from}-${to}`

  // Уникальные title и description
  const titleVariants = [
    `Курс ${fromInfo.fullNameRu} к ${toInfo.shortDesc} — конвертер ${from}/${to} | cconverter.ru`,
    `${from}/${to} — актуальный курс ${fromInfo.fullNameRu} к ${toInfo.shortDesc} | cconverter.ru`,
    `Конвертер ${from}/${to} — перевод ${fromInfo.fullNameRu} в ${toInfo.shortDesc} | cconverter.ru`,
  ]
  const descVariants = [
    `Конвертируйте ${fromInfo.shortDesc} в ${toInfo.shortDesc} по актуальному курсу. Бесплатный онлайн калькулятор с мгновенным результатом.`,
    `Актуальный курс ${from}/${to} сегодня. Бесплатная конвертация ${fromInfo.fullNameRu} в ${toInfo.shortDesc} по рыночному курсу.`,
    `Переведите ${fromInfo.shortDesc} в ${toInfo.shortDesc} за секунду. Бесплатный конвертер валют с реальными курсами.`,
  ]

  return {
    path: `/${from.toLowerCase()}-${to.toLowerCase()}`,
    title: pick(titleVariants, seed + '-title'),
    description: pick(descVariants, seed + '-desc'),
    h1: `Курс ${fromInfo.fullNameRu} к ${toInfo.shortDesc} сегодня`,
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
